import type { PageBlock } from './blockSchema'

/**
 * Every heading a page or post will render, in order.
 *
 * Its own module rather than sitting beside the component that uses it: a file
 * that exports both a component and a plain function breaks React Fast Refresh,
 * so editing it reloads the whole app instead of swapping the component.
 *
 * Mirrors the website's rule — a block's own heading, plus any h2 or h3 inside
 * a text block's rich text. Kept in step by hand because the two run in
 * different builds; if they drift, this preview stops matching the page.
 */

/** Headings inside a text block's rich text. h2 and h3 only, as the site does. */
function headingsInHtml(html: string): string[] {
  return [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)]
    .map((match) => match[1]?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() ?? '')
    .filter(Boolean)
}

export function headingsOf(blocks: PageBlock[]): string[] {
  const out: string[] = []

  for (const block of blocks) {
    if ((block.type === 'text' || block.type === 'video') && block.heading?.trim()) {
      out.push(block.heading.trim())
    }
    if (block.type === 'text' && block.body) out.push(...headingsInHtml(block.body))
  }

  return out
}

/**
 * Matches the website: fewer than two headings and no index is shown, so
 * promising one in the CMS would be a claim the editor disproves on the live
 * page.
 */
export const MIN_HEADINGS_FOR_INDEX = 2
