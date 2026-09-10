import type { UserRole } from '../types'

/**
 * What each role reaches, as the CMS understands it.
 *
 * A mirror of `MODULE_ACCESS` in the API's `middleware/moduleAccess.ts`, which
 * is the actual boundary — this copy only decides which sidebar entries to
 * draw and which routes render the Forbidden page. Hiding a link is not
 * security; the server refuses the request either way.
 *
 * It is duplicated rather than fetched because the sidebar has to render on
 * first paint, and a menu that arrives a moment after the page does is worse
 * than one that is occasionally a deploy behind. Keep the two in step: the
 * failure mode of drift is a link that leads to a 403, which is visible.
 *
 * Keyed by module — the first path segment, which is the same word in the CMS
 * route (`/blogs`) and the API (`/api/blogs`). Two exceptions are mapped in
 * `moduleForPath` below, where the CMS names a page differently from the API
 * it reads.
 */

const ALL: UserRole[] = ['admin', 'content', 'counsellor']
const CONTENT: UserRole[] = ['admin', 'content']
const ENQUIRIES: UserRole[] = ['admin', 'counsellor']
const ADMIN: UserRole[] = ['admin']

interface ModuleRule {
  /** Who may open the section at all. */
  read: UserRole[]
  /** Who may save changes in it. */
  write: UserRole[]
}

export const MODULE_ACCESS: Record<string, ModuleRule> = {
  blogs: { read: CONTENT, write: CONTENT },
  pages: { read: CONTENT, write: CONTENT },
  courses: { read: CONTENT, write: CONTENT },
  'course-categories': { read: CONTENT, write: CONTENT },
  categories: { read: CONTENT, write: CONTENT },
  faqs: { read: CONTENT, write: CONTENT },
  testimonials: { read: CONTENT, write: CONTENT },
  events: { read: CONTENT, write: CONTENT },
  gallery: { read: CONTENT, write: CONTENT },
  reviews: { read: CONTENT, write: CONTENT },
  seo: { read: CONTENT, write: CONTENT },
  'ai-knowledge': { read: CONTENT, write: CONTENT },
  comments: { read: CONTENT, write: CONTENT },

  enquiries: { read: ENQUIRIES, write: ENQUIRIES },
  newsletter: { read: ENQUIRIES, write: ENQUIRIES },

  dashboard: { read: ALL, write: ALL },
  search: { read: ALL, write: ALL },
  auth: { read: ALL, write: ALL },
  activity: { read: ALL, write: ALL },
  media: { read: ALL, write: CONTENT },
  users: { read: ALL, write: ADMIN },
  settings: { read: ALL, write: ADMIN },
}

/**
 * The module a CMS path belongs to.
 *
 * `/blogs/123/edit` → `blogs`. Two pages are named for what they show rather
 * than the endpoint behind them: Team and Team Contributions both read
 * `/api/users`, so both answer to `users`.
 */
export function moduleForPath(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean)[0] ?? ''
  if (segment === '') return 'dashboard'
  if (segment === 'team' || segment === 'contributions') return 'users'
  return segment
}

export function canRead(role: UserRole, module: string): boolean {
  return MODULE_ACCESS[module]?.read.includes(role) ?? false
}

export function canWrite(role: UserRole, module: string): boolean {
  return MODULE_ACCESS[module]?.write.includes(role) ?? false
}

/** What to show in the team list and the role picker. */
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  content: 'Content',
  counsellor: 'Counsellor',
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Everything, including adding and removing people.',
  content: 'Every content section. No access to enquiries or subscribers.',
  counsellor: 'Enquiries and subscribers. No access to content.',
}
