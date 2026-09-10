import { Icon, cx } from "@/components/ui";
import type { Heading } from "@/lib/headings";

/**
 * The "on this page" index.
 *
 * A map of the article's own headings, so a reader can see its shape before
 * committing to it and jump to the part they came for. On a long guide that is
 * the difference between scanning and scrolling.
 *
 * Rendered as a plain `<nav>` of anchors — no JavaScript, no scroll spy. The
 * browser handles fragment navigation, and `scroll-margin-top` on the headings
 * (see `globals.css`) keeps the target clear of the fixed header.
 */
/**
 * Whether an index is worth rendering.
 *
 * Exported so a page can collapse its sidebar column instead of reserving an
 * empty one: the grid track is declared by the layout, and without this the
 * content sits indented beside a gap on every page too short to index.
 */
/** One heading is a label, not a map — there is nowhere to navigate to. */
const MIN_HEADINGS = 2;

export function hasIndex(headings: Heading[]): boolean {
  return headings.length >= MIN_HEADINGS;
}

export function TableOfContents({
  headings,
  className,
}: {
  headings: Heading[];
  className?: string;
}) {
  /*
   * One heading is a label, not a map — there is nowhere to navigate to. Two
   * or more is a structure worth showing, and on a long page even two saves a
   * scroll. Anything stricter mostly hides the feature on the pages editors
   * are actually writing.
   */
  if (!hasIndex(headings)) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className={cx("rounded-2xl border border-line bg-subtle p-6", className)}
    >
      <p
        id="toc-heading"
        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted"
      >
        <Icon name="list" className="size-4" aria-hidden="true" />
        On this page
      </p>

      <ol className="mt-4 space-y-2 text-left">
        {headings.map((heading) => (
          <li
            key={heading.id}
            // Sub-headings sit under the section they belong to, so the list
            // shows the article's shape rather than a flat run of links.
            className={cx("text-sm", heading.level === 3 && "ml-4")}
          >
            <a
              href={`#${heading.id}`}
              className="wrap-anywhere text-muted transition-colors hover:text-brand-600"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
