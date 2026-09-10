import type { NextFunction, Request, Response } from 'express'

import { forbidden, unauthorised } from '../http/errors.js'
import { canAccess, moduleOf } from './moduleAccess.js'
import { resolveSession, type SessionUser } from '../modules/auth/auth.service.js'

export const SESSION_COOKIE = 'techcadd_session'

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser
    sessionId?: string
  }
}

/** Attaches `req.user` when a valid session cookie is present. Never rejects. */
export async function attachUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const sessionId = req.signedCookies?.[SESSION_COOKIE] as string | undefined
  if (!sessionId) return next()

  try {
    const user = await resolveSession(sessionId)
    if (user) {
      req.user = user
      req.sessionId = sessionId
    }
    next()
  } catch (error) {
    next(error)
  }
}

/** Rejects the request unless a session was resolved. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) return next(unauthorised())
  next()
}

/**
 * Admin-only gate.
 *
 * The roles stopped being a ladder in migration 024 — `content` and
 * `counsellor` are siblings, so there is no rank to compare and no "minimum"
 * to take as an argument. What each role may reach is a table, applied to
 * every request by `enforceModuleAccess`; this is the narrower thing on top of
 * it, for the handful of routes only an administrator may call.
 *
 * This is a real check. `useCan()` in the CMS only hides buttons; anyone can
 * call the API directly.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) return next(unauthorised())
  if (req.user.role !== 'admin') return next(forbidden('Only an administrator can do this.'))
  next()
}

/**
 * Write gate for a mutating route.
 *
 * `enforceModuleAccess` already refuses these requests before any router sees
 * them, so this is not the boundary — it is the marker. It stays at each
 * mutating call site because that is where someone reads it: the route file
 * says "this changes data", instead of that fact living only in a table two
 * directories away. It resolves against the same table, so the two cannot
 * drift apart.
 */
export function requireWrite(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) return next(unauthorised())
  if (!canAccess(req.user.role, moduleOf(req.originalUrl), req.method)) {
    return next(forbidden('Your account cannot make changes in this section.'))
  }
  next()
}
