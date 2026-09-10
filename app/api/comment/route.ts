import { NextResponse } from "next/server";

/**
 * Forwards a blog comment to the CMS.
 *
 * Proxied rather than posted from the browser for the same reason enquiries
 * are: the CMS origin is server-side configuration, and calling it directly
 * would publish that address to every visitor and require opening the API to
 * cross-origin requests from anywhere.
 *
 * Nothing reaches the site from here — the CMS stores every comment as
 * `pending`, and a moderator has to approve it before it appears.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Per-IP throttle. In-memory, so it resets on redeploy and is per-instance —
 * enough to blunt a script, not a substitute for a WAF. The CMS applies its
 * own limit behind this one, which is the limit that actually holds.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

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
  const base = process.env.CMS_API_URL?.replace(/\/+$/, "");
  if (!base) {
    return NextResponse.json({ error: "Comments are not available right now." }, { status: 503 });
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many comments. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  try {
    const response = await fetch(`${base}/api/public/comments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        blogSlug: payload.blogSlug,
        authorName: payload.authorName,
        email: payload.email || "",
        body: payload.body,
        parentId: payload.parentId || undefined,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { message?: string; ok?: boolean }
      | null;

    if (!response.ok) {
      // The CMS validates independently; its message names what is wrong,
      // which is more use to the visitor than a generic failure.
      return NextResponse.json(
        { error: data?.message ?? "Could not post your comment." },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true, message: data?.message }, { status: 201 });
  } catch (error) {
    console.error("[comment] could not reach the CMS", error);
    return NextResponse.json(
      { error: "Could not post your comment. Please try again." },
      { status: 502 },
    );
  }
}
