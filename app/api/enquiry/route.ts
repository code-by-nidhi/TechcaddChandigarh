import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { courses } from "@/data/courses";
import { getPool } from "@/lib/db";
import { validateEnquiry } from "@/lib/enquiry";

// mysql2 is a Node driver, so this route must not run on the edge, and a lead
// must never be served from a cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Per-IP throttle. In-memory, so it resets on redeploy and is per-instance —
 * enough to blunt a script hammering the form, not a substitute for a WAF.
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

  const enquiry = result.value;
  const id = randomUUID();

  // The forms submit a course id ("python"); the table stores the readable
  // name. `course_id` stays null — it is a char(36) key for a courses table
  // that does not exist in this database, not our slug.
  const courseName =
    courses.find((course) => course.id === enquiry.course)?.name ??
    (enquiry.course === "not-sure" ? "Not sure yet" : (enquiry.course ?? ""));

  // The branch is not a column of its own, so it rides along in the message
  // rather than being dropped.
  const message = enquiry.branch
    ? `${enquiry.message ? `${enquiry.message}\n\n` : ""}Preferred centre: ${enquiry.branch}`
    : enquiry.message;

  try {
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
        courseName,
        enquiry.formType,
        enquiry.pagePath,
        ip === "unknown" ? null : ip.slice(0, 45),
        request.headers.get("user-agent")?.slice(0, 255) ?? null,
        message,
      ],
    );

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    // The visitor must never see a driver error, but we need it in the logs —
    // a lead lost to a misconfigured database should be loud on our side.
    console.error("[enquiry] insert failed", error);
    return NextResponse.json(
      { error: "We could not save your request. Please call us instead." },
      { status: 500 },
    );
  }
}
