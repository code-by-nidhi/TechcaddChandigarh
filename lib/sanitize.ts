/**
 * Allowlist sanitiser for rich text coming out of the CMS.
 *
 * The blog body is authored in the CMS editor and stored verbatim — the API
 * does not strip anything on the way in. That is defensible inside the CMS,
 * where every author is signed in, but this site renders the same string with
 * `dangerouslySetInnerHTML` on a public page, so one compromised or careless
 * editor account would otherwise mean script running against every visitor.
 *
 * Sanitising here rather than in the CMS is deliberate: it protects the site
 * against content already in the database, and against any future writer to
 * that table, without either being changed first. The CMS should still grow
 * its own sanitiser on the way in — this is the second line, not the only one.
 *
 * Server-side only, and by design not a general-purpose HTML sanitiser. It is
 * an allowlist of exactly what the editor can produce: anything outside that
 * list is dropped rather than escaped, because a tag this editor cannot emit
 * has no business appearing in a post.
 */

/** Tags the CMS editor produces. Everything else is unwrapped or dropped. */
const ALLOWED_TAGS = new Set([
  "p", "br", "hr",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "b", "em", "i", "u", "s", "code", "pre", "blockquote",
  "ul", "ol", "li",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
  "figure", "figcaption", "span", "div",
]);

/**
 * Attributes allowed, per tag.
 *
 * No `style`, no `class`, and no `on*` — the page's own stylesheet handles
 * presentation, and an inline style is a vector (`background:url(javascript:)`)
 * for no editorial benefit.
 */
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan", "scope"]),
};

/**
 * Tags whose contents are dropped along with the tag.
 *
 * For everything else, removing the tag but keeping its text is the safe
 * default — a stray `<font>` should not silently delete a paragraph. For these
 * the content *is* the payload, so it goes too.
 */
const DROP_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "noscript", "template"]);

/** Only schemes that cannot execute. `javascript:` and `data:` are the point. */
const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * True when a URL is safe to put in an `href` or `src`.
 *
 * Entities are decoded and whitespace stripped first: `java&#115;cript:` and
 * `java\tscript:` both reach the browser as `javascript:`, so testing the raw
 * string would pass exactly the inputs this exists to catch.
 */
function safeUrl(value: string): boolean {
  const normalised = decodeEntities(value).replace(/[\s\u0000-\u001f]/g, "");
  return SAFE_URL.test(normalised);
}

/** Parses `href="x" target=_blank` into pairs. */
const ATTR_PATTERN = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>=`]+)))?/g;

function cleanAttributes(tag: string, raw: string): string {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed || !raw.trim()) return "";

  const out: string[] = [];
  let match: RegExpExecArray | null;
  ATTR_PATTERN.lastIndex = 0;

  while ((match = ATTR_PATTERN.exec(raw)) !== null) {
    const name = match[1]!.toLowerCase();
    if (!allowed.has(name)) continue;

    const value = match[2] ?? match[3] ?? match[4] ?? "";
    if ((name === "href" || name === "src") && !safeUrl(value)) continue;

    out.push(`${name}="${escapeAttr(value)}"`);
  }

  // A link that opens in a new tab gets `noopener`, always. Without it the
  // opened page can reach back through `window.opener` and navigate this one.
  if (tag === "a" && out.some((attr) => attr.startsWith('target="'))) {
    const rel = out.findIndex((attr) => attr.startsWith('rel="'));
    if (rel === -1) out.push('rel="noopener noreferrer"');
  }

  return out.length ? ` ${out.join(" ")}` : "";
}

const VOID_TAGS = new Set(["br", "hr", "img"]);

/**
 * Returns the input with everything outside the allowlist removed.
 *
 * Comments go first — `<!-- <script> -->` would otherwise survive the tag pass
 * and be re-parsed by the browser once the comment markers are gone.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  let out = html.replace(/<!--[\s\S]*?-->/g, "");

  for (const tag of DROP_CONTENT) {
    out = out.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}\\s*>`, "gi"), "");
    // An unclosed one — `<script>alert(1)` — never matches above, so the bare
    // opening tag is removed too rather than being passed through.
    out = out.replace(new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi"), "");
  }

  return out.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (_full, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";

    const closing = _full.startsWith("</");
    if (closing) return VOID_TAGS.has(tag) ? "" : `</${tag}>`;

    const attrs = cleanAttributes(tag, rawAttrs);
    return VOID_TAGS.has(tag) ? `<${tag}${attrs} />` : `<${tag}${attrs}>`;
  });
}
