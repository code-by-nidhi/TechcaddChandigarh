import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CMS_TAG } from "@/lib/cms";

/**
 * The CMS tells us here that content changed.
 *
 * Without this, a post an editor just published does not appear until the data
 * cache expires on its own — minutes of a page that still shows the old copy,
 * which reads as the save having failed and is the most common complaint about
 * a headless setup. The CMS fires this after every successful mutation (see
 * `cms-techcadd/backend/src/http/revalidate.ts`), debounced so a multi-step
 * save produces one call.
 *
 * The body is ignored: the CMS does not say what changed, so there is nothing
 * here to act on more precisely than dropping the whole CMS tag.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Constant-time comparison.
 *
 * `===` on a secret leaks its length and its matching prefix through timing.
 * That is a thin channel against an endpoint whose worst outcome is a cleared
 * cache, but the correct comparison costs nothing.
 */
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on a length mismatch, so that is checked first —
  // the length is already disclosed by the header itself.
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    // Refuse rather than revalidate: an unconfigured secret would otherwise
    // leave anyone on the internet able to clear this site's cache at will.
    return NextResponse.json(
      { error: "Revalidation is not configured on this site." },
      { status: 503 },
    );
  }

  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!secretMatches(provided, expected)) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  revalidateTag(CMS_TAG);

  return NextResponse.json({ revalidated: true, tag: CMS_TAG, at: Date.now() });
}
