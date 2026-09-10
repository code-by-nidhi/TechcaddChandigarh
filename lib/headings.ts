/**
 * Heading extraction, for the "on this page" index.
 *
 * A long article needs a map of itself, and the headings are already there —
 * they just have no ids to link to. This adds them and collects the list, from
 * one place so the anchor the index links to and the id on the heading cannot
 * disagree.
 *
 * Server-side only: it runs over the same sanitised HTML `lib/cms.ts` produces,
 * before it reaches the page.
 */

export interface Heading {
  id: string;
  text: string;
  /** 2 or 3. Deeper headings are indented under the one above. */
  level: 2 | 3;
}

/**
 * A URL fragment from heading text.
 *
 * Deliberately not random: the same heading must produce the same anchor on
 * every render, or a link someone shared last week stops working after the
 * next deploy.
 */
export function headingId(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;|&#\d+;/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  // A heading of only punctuation or non-Latin script slugs to nothing; it
  // still needs an anchor, and "section" beats an empty fragment.
  return slug || "section";
}

/** Strips tags and decodes the few entities the editor emits. */
function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Makes every id unique within one document.
 *
 * Two sections called "Overview" would otherwise share an anchor, and the
 * index would send every click to the first one.
 */
function uniqueId(base: string, seen: Map<string, number>): string {
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

/**
 * Adds an `id` to every h2 and h3, and returns them in document order.
 *
 * h2 and h3 only: h1 is the page title, and h4 and below are detail inside a
 * section rather than a place someone navigates to. An index that lists
 * everything is one nobody reads.
 *
 * A heading that already carries an id keeps it — an editor who wrote one
 * meant it, and rewriting it would break whatever links to it.
 */
export function withHeadingIds(
  html: string,
  seen: Map<string, number> = new Map(),
): { html: string; headings: Heading[] } {
  if (!html) return { html, headings: [] };

  const headings: Heading[] = [];

  const out = html.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (full, tag: string, attrs: string, inner: string) => {
      const text = plainText(inner);
      if (!text) return full;

      const existing = /\sid\s*=\s*["']([^"']+)["']/i.exec(attrs);
      const id = existing?.[1] ?? uniqueId(headingId(text), seen);

      headings.push({ id, text, level: tag.toLowerCase() === "h2" ? 2 : 3 });

      return existing
        ? full
        : `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );

  return { html: out, headings };
}

/**
 * The index for a page built from blocks.
 *
 * A block's own `heading` field renders as an h2 in the markup, so it belongs
 * in the index alongside the headings inside its rich text — and the ids have
 * to be allocated in render order, across the whole page, or the duplicate
 * suffixes would not match what the renderer produced.
 *
 * Each block comes back carrying `headingAnchor` — the id allocated for its
 * own heading. The renderer must use that rather than deriving one itself:
 * two blocks headed "Overview" get `overview` and `overview-2` here, and a
 * renderer recomputing the slug would put `overview` on both, so the index's
 * second link would jump to the first section.
 */
export function headingsFromBlocks<T extends { type: string; id: string }>(
  blocks: T[],
): { blocks: (T & { headingAnchor?: string })[]; headings: Heading[] } {
  const seen = new Map<string, number>();
  const headings: Heading[] = [];

  const out = blocks.map((block) => {
    const record = block as unknown as {
      type: string;
      heading?: string;
      body?: string;
    };

    let headingAnchor: string | undefined;

    // The block's own heading comes first: the renderer prints it above the
    // body, so the index has to list it in that order too.
    if (
      (record.type === "text" || record.type === "video") &&
      record.heading?.trim()
    ) {
      const text = record.heading.trim();
      headingAnchor = uniqueId(headingId(text), seen);
      headings.push({ id: headingAnchor, text, level: 2 });
    }

    if (record.type !== "text" || !record.body) {
      return headingAnchor ? { ...block, headingAnchor } : block;
    }

    const result = withHeadingIds(record.body, seen);
    headings.push(...result.headings);

    return { ...block, headingAnchor, body: result.html };
  });

  return { blocks: out, headings };
}
