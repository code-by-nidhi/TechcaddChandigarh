import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { courses } from "@/data/courses";
import { cmsEnabled } from "@/lib/cms";
import { getPool } from "@/lib/db";
import { validateEnquiry, type ValidEnquiry } from "@/lib/enquiry";

// mysql2 is a Node driver, so this route must not run on the edge, and a lead
// must never be served from a cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Per-IP throttle. In-memory, so it resets on redeploy and is per-instance —
 * enough to blunt a script hammering the form, not a substitute for a WAF.
 * The CMS applies its own limit behind this one, which is the limit that
 * actually holds since this endpoint is not the only way in.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * The forms submit a course id ("python"); an enquiry records the readable
 * name, because a counsellor reads this list and "python" is not what the
 * student said they wanted.
 */
function courseNameOf(enquiry: ValidEnquiry): string {
  const match = courses.find((course) => course.id === enquiry.course);
  if (match) return match.name;
  if (enquiry.course === "not-sure") return "Not sure yet";
  return enquiry.course ?? "";
}

/**
 * The branch is not a column on either side, so it rides along in the message
 * rather than being dropped.
 */
function messageOf(enquiry: ValidEnquiry): string | null {
  if (!enquiry.branch) return enquiry.message;
  const prefix = enquiry.message ? `${enquiry.message}\n\n` : "";
  return `${prefix}Preferred centre: ${enquiry.branch}`;
}

/* ------------------------------------------------------------------ */
/* Delivery                                                            */
/* ------------------------------------------------------------------ */

/**
 * Hands the lead to the CMS.
 *
 * Preferred over writing the row ourselves, even though both end up in the
 * same table. The CMS endpoint is where the duplicate guard, the reCAPTCHA
 * check and the counsellor notification mail live; inserting directly bypasses
 * all three, which is how the same number could be submitted all day and every
 * one of them be recorded as a fresh lead.
 */
async function sendToCms(
  enquiry: ValidEnquiry,
  context: { ip: string; userAgent: string | null; captchaToken?: string },
): Promise<Response> {
  const response = await fetch(`${process.env.CMS_API_URL!.replace(/\/+$/, "")}/api/public/enquiries`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    // A lead is worth waiting on, but not worth holding a request open
    // indefinitely for.
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      studentName: enquiry.name ?? "",
      phone: enquiry.phone,
      // The CMS rejects a malformed address but accepts an empty one, and the
      // phone-only forms collect no email.
      email: enquiry.email ?? "",
      courseName: courseNameOf(enquiry),
      message: messageOf(enquiry) ?? undefined,
      source: "website",
      formType: enquiry.formType,
      sourceUrl: enquiry.pagePath ?? undefined,
      ip: context.ip === "unknown" ? undefined : context.ip.slice(0, 45),
      userAgent: context.userAgent?.slice(0, 255) ?? undefined,
      captchaToken: context.captchaToken,
    }),
  });

  if (response.status === 429) {
    // The CMS refuses a repeat submission with a message written for the
    // visitor — passed through rather than replaced, since it is reassuring
    // ("we already have your enquiry") where ours would sound like a failure.
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    return NextResponse.json(
      { ok: true, duplicate: true, message: body?.message ?? "We already have your enquiry. A counsellor will call you shortly." },
      { status: 200 },
    );
  }

  if (!response.ok) {
    throw new Error(`CMS responded ${response.status} ${response.statusText}`);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

/**
 * Writes the lead straight to the database.
 *
 * The path taken when no CMS is configured — a local checkout, or a deployment
 * where the API is not yet up. It loses the duplicate guard and the
 * notification mail, which is a fair trade against losing the lead entirely.
 */
async function insertDirectly(
  enquiry: ValidEnquiry,
  context: { ip: string; userAgent: string | null },
): Promise<Response> {
  const id = randomUUID();

  await getPool().execute<ResultSetHeader>(
    `INSERT INTO enquiries
       (id, student_name, phone, email, course_id, course_name,
        source, form_type, source_url, ip, user_agent, message,
        created_at, updated_at)
     VALUES (?, ?, ?, ?, NULL, ?, 'website', ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [
      id,
      // NOT NULL with no default: the phone-only forms collect no name, and a
      // blank is more honest to a counsellor than an invented placeholder.
      enquiry.name ?? "",
      enquiry.phone,
      enquiry.email,
      courseNameOf(enquiry),
      enquiry.formType,
      enquiry.pagePath,
      context.ip === "unknown" ? null : context.ip.slice(0, 45),
      context.userAgent?.slice(0, 255) ?? null,
      messageOf(enquiry),
    ],
  );

  return NextResponse.json({ ok: true, id }, { status: 201 });
}

/* ------------------------------------------------------------------ */
/* Route                                                               */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  const payload = await request.json().catch(() => null);
  const result = validateEnquiry(payload);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const context = {
    ip,
    userAgent: request.headers.get("user-agent"),
    // Passed through untouched. The site does not mint these today, but the
    // CMS verifies one when reCAPTCHA is configured there, and a form that
    // starts sending one must not need this route changed as well.
    captchaToken:
      typeof (payload as { captchaToken?: unknown } | null)?.captchaToken === "string"
        ? ((payload as { captchaToken: string }).captchaToken)
        : undefined,
  };

  try {
    return cmsEnabled
      ? await sendToCms(result.value, context)
      : await insertDirectly(result.value, context);
  } catch (error) {
    // The visitor must never see a driver or fetch error, but we need it in
    // the logs — a lead lost to a misconfigured backend should be loud on our
    // side.
    console.error("[enquiry] could not record the lead", error);
    return NextResponse.json(
      { error: "We could not save your request. Please call us instead." },
      { status: 500 },
    );
  }
}
