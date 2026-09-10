/**
 * Which TechCADD this CMS administers.
 *
 * TechCADD runs more than one centre and more than one website, and this
 * codebase began as the Jalandhar CMS. Someone signed in to the wrong one
 * would see a familiar-looking dashboard and start editing live content, so
 * the branch name is stated on the sign-in screen, in the sidebar and in the
 * browser tab rather than left to be inferred from the records on screen.
 *
 * Defined once here so those three never disagree.
 */
export const BRAND = {
  /** The organisation. */
  name: 'TechCADD',
  /** The centre this instance belongs to. */
  branch: 'Chandigarh',
  /** What the product is, for the badge beside the wordmark. */
  product: 'CMS',
} as const

/** "TechCADD Chandigarh" — the full name, for prose and alt text. */
export const BRAND_FULL = `${BRAND.name} ${BRAND.branch}`

/** "TechCADD Chandigarh CMS" — the application's own name. */
export const APP_NAME = `${BRAND_FULL} ${BRAND.product}`

/**
 * The browser tab title for a given page.
 *
 * The page comes first: a row of pinned tabs truncates from the right, and
 * "Blogs" is what distinguishes this tab from the others.
 */
export function documentTitle(page?: string): string {
  return page && page !== 'Dashboard' ? `${page} · ${APP_NAME}` : APP_NAME
}
