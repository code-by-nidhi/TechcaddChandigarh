import type { NextFunction, Request, Response } from 'express'

import { forbidden } from '../http/errors.js'
import type { UserRole } from '../modules/auth/auth.service.js'

/**
 * Who may touch which module.
 *
 * Enforced here, in the request pipeline, rather than by adding a guard to each
 * of the twenty route files — for the same reason `recordActivity` sits here.
 * A rule that depends on every module remembering to apply it is a rule with
 * holes in it, and the holes are invisible until someone finds one. A module
 * added next year is governed before anyone thinks about it, because an
 * unlisted module is denied rather than allowed.
 *
 * The roles are not a hierarchy. `content` and `counsellor` are siblings: a
 * counsellor is not a lesser editor, they are a different job. So this is a
 * table of what each may do, not a rank to compare — see `requireAdmin`,
 * which is the one gate narrow enough to still be a single comparison.
 *
 * `read` covers GET/HEAD; `write` covers POST/PATCH/PUT/DELETE. A role in
 * `write` is not automatically in `read` — both lists are written out, because
 * an implicit rule here is a rule someone has to remember.
 *
 * The CMS mirrors this table in `src/config/access.ts` to decide which sidebar
 * entries to draw. That copy hides links; this one is the actual boundary.
 */

const ALL: UserRole[] = ['admin', 'content', 'counsellor']
const CONTENT: UserRole[] = ['admin', 'content']
const ENQUIRIES: UserRole[] = ['admin', 'counsellor']
const ADMIN: UserRole[] = ['admin']

interface ModuleRule {
  read: UserRole[]
  write: UserRole[]
}

export const MODULE_ACCESS: Record<string, ModuleRule> = {
  /* Content. Written by the content team; a counsellor cannot see the
     editing screens at all, so there is nothing for them to save by accident. */
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

  /* Comments are moderation of published content, so they sit with the people
     who publish it — the reply a visitor reads is the institute's voice. */
  comments: { read: CONTENT, write: CONTENT },

  /* Enquiries and subscribers. The line the request drew: "team can deal with
     all the content part but not queries — for that there will be different
     persons than content." A prospective student's phone number is not
     editorial material, and it is the counsellors' work queue. */
  enquiries: { read: ENQUIRIES, write: ENQUIRIES },
  newsletter: { read: ENQUIRIES, write: ENQUIRIES },

  /* Shared. Everyone signs in to the same dashboard and searches the same
     CMS; each module still filters what it returns. */
  dashboard: { read: ALL, write: ALL },
  search: { read: ALL, write: ALL },
  auth: { read: ALL, write: ALL },
  activity: { read: ALL, write: ALL },

  /* Media is read by everyone — an enquiry note may cite an image, and the
     avatar on your own profile comes from here — but only content people add
     to or prune the library. */
  media: { read: ALL, write: CONTENT },

  /* The team list is readable by all, because enquiries are assigned to people
     and the list is what renders a name against an assignee. Changing it is
     admin-only, which is what stops a team member removing another or an
     admin — see the note on the users router. */
  users: { read: ALL, write: ADMIN },

  /* Settings are site-wide: the address in the footer, the phone number every
     page prints. Readable by all so the CMS can show the site it manages. */
  settings: { read: ALL, write: ADMIN },
}

const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

/** `/api/blogs/123?x=1` → `blogs`. */
export function moduleOf(url: string): string {
  const path = url.split('?')[0] ?? ''
  const [, api, name] = path.split('/')
  return api === 'api' ? (name ?? '') : ''
}

export function canAccess(role: UserRole, module: string, method: string): boolean {
  const rule = MODULE_ACCESS[module]
  // Unlisted modules are denied. A new one is invisible until it is listed
  // here, which is a missing sidebar entry — noticed immediately, and far
  // better than a module that quietly let everyone in.
  if (!rule) return false
  return (READ_METHODS.has(method) ? rule.read : rule.write).includes(role)
}

/**
 * Rejects a request for a module this role has no business in.
 *
 * `/api/public` and `/api/health` never reach here — they are mounted with no
 * session and are not part of the CMS surface.
 */
export function enforceModuleAccess(req: Request, _res: Response, next: NextFunction): void {
  const module = moduleOf(req.originalUrl)
  if (!module || module === 'public' || module === 'health') return next()

  // No session is `requireAuth`'s call to make, not this one — otherwise every
  // signed-out request would report 403 "not for your role" instead of 401.
  if (!req.user) return next()

  if (!canAccess(req.user.role, module, req.method)) {
    return next(
      forbidden(
        READ_METHODS.has(req.method)
          ? 'Your account does not have access to this section.'
          : 'Your account cannot make changes in this section.',
      ),
    )
  }

  next()
}
