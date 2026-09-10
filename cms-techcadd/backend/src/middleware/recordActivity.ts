import type { NextFunction, Request, Response } from 'express'

import * as activity from '../modules/activity/activity.repo.js'

/**
 * Writes an audit entry for every successful change.
 *
 * Middleware rather than a call inside each repository, for one reason: a log
 * that depends on twenty modules each remembering to write to it is a log with
 * holes in it, and the holes are invisible — you only discover the gap when you
 * go looking for the change nobody recorded. Sitting in the request pipeline
 * means a module added next year is audited before anyone thinks about it.
 *
 * Runs on `finish`, so the response is already sent: logging can neither slow a
 * save nor fail one.
 */

const MUTATING = new Set(['POST', 'PATCH', 'PUT', 'DELETE'])

/**
 * Routes that are not content changes.
 *
 * `/api/auth` is excluded here and logged by the auth routes themselves, which
 * know whether a sign-in actually succeeded — this middleware only sees a
 * status code, and a failed password is a 401 that should still be recorded.
 */
const IGNORED = [/^\/api\/auth\b/, /^\/api\/search\b/, /^\/api\/dashboard\b/, /^\/api\/activity\b/]

/**
 * `/api/blogs/123` → `{ entityType: 'blogs', entityId: '123' }`.
 *
 * Read from the URL at middleware entry, never inside the `finish` handler.
 * Express strips a router's mount prefix from `req.url` while that router is
 * handling the request, so by the time the response finishes `req.path` is
 * `/123` rather than `/api/blogs/123` — which is how the module name ends up
 * blank in the log.
 */
function describe(url: string): { entityType: string; entityId?: string } {
  const path = url.split('?')[0] ?? ''
  const [, , entityType, segment] = path.split('/')

  return {
    entityType: entityType || 'unknown',
    // Only when it looks like a record id — `/api/comments/bulk-status` and
    // `/api/seo/redirects` are sub-routes, not records.
    entityId: segment && /^[0-9a-f-]{8,}$/i.test(segment) ? segment : undefined,
  }
}

/**
 * What happened, from the method and what the handler sent back.
 *
 * A PATCH carrying `{ status: 'published' }` is a publish, not an edit — that
 * is the distinction someone reading the log actually cares about, and it is
 * knowable here without asking each module to describe itself.
 */
function actionOf(req: Request): activity.ActivityAction {
  if (req.method === 'POST') return 'create'
  if (req.method === 'DELETE') return 'delete'

  const status = (req.body as { status?: unknown } | undefined)?.status
  if (status === 'published') return 'publish'
  if (status === 'draft' || status === 'review') return 'unpublish'

  return 'update'
}

/**
 * A human-readable name for the record.
 *
 * Taken from the response body, not the request: on a create the request has no
 * id, and on a partial update the request has only the fields that changed. The
 * response is the saved record, which is what the log should describe.
 */
function labelOf(body: unknown): { id?: string; label?: string } {
  if (!body || typeof body !== 'object') return {}

  const record = body as Record<string, unknown>
  const label = ['title', 'name', 'question', 'authorName', 'studentName', 'siteName', 'route']
    .map((key) => record[key])
    .find((value): value is string => typeof value === 'string' && value.length > 0)

  return {
    id: typeof record.id === 'string' ? record.id : undefined,
    label,
  }
}

export function recordActivity(req: Request, res: Response, next: NextFunction) {
  if (!MUTATING.has(req.method) || IGNORED.some((pattern) => pattern.test(req.path))) {
    return next()
  }

  /*
   * The response body is captured on the way out.
   *
   * `res.json` is wrapped rather than the body being re-read later, because by
   * the time `finish` runs the payload is gone. A bulk delete answers 204 with
   * no body at all, which is why the id falls back to the request params.
   */
  // Captured now, while the URL is still the one the client asked for.
  const { entityType, entityId: idFromUrl } = describe(req.originalUrl)

  let payload: unknown
  const json = res.json.bind(res)
  res.json = (body: unknown) => {
    payload = body
    return json(body)
  }

  res.on('finish', () => {
    if (res.statusCode < 200 || res.statusCode >= 300) return

    // Only a signed-in user can reach these routes; without one this is a
    // public write (an enquiry, a comment), which the public router logs
    // itself with the visitor's name rather than a staff name.
    const user = req.user
    if (!user) return

    const { id, label } = labelOf(payload)

    void activity.record({
      userId: user.userId,
      userName: user.name,
      action: actionOf(req),
      entityType,
      entityId: id ?? idFromUrl,
      entityLabel: label,
      ip: req.ip,
    })
  })

  next()
}
