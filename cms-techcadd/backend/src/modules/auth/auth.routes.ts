import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

import { config, isProduction, loginAttemptLimit } from '../../config.js'
import { asyncHandler, unauthorised } from '../../http/errors.js'
import { requireAuth, SESSION_COOKIE } from '../../middleware/auth.js'
import * as auth from './auth.service.js'

export const authRouter = Router()

/** Slows credential stuffing. Keyed by IP; add per-account limiting behind it. */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: loginAttemptLimit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Try again in a few minutes.' },
})

const cookieOptions = {
  httpOnly: true, // unreadable from JavaScript, so XSS cannot steal the session
  secure: isProduction, // HTTPS only in production
  sameSite: 'lax' as const, // blocks the common CSRF shapes
  signed: true,
  maxAge: config.SESSION_DAYS * 24 * 60 * 60 * 1000,
  path: '/',
}

const loginSchema = z.object({
  identifier: z.string().min(1, 'Enter your username.'),
  password: z.string().min(1, 'Enter your password.'),
})

authRouter.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { identifier, password } = loginSchema.parse(req.body)
    const { sessionId, user } = await auth.login(identifier, password, req.get('user-agent'))

    res.cookie(SESSION_COOKIE, sessionId, cookieOptions)
    res.json(user)
  }),
)

authRouter.post(
  '/logout',
  asyncHandler(async (req, res) => {
    if (req.signedCookies?.[SESSION_COOKIE]) {
      await auth.logout(req.signedCookies[SESSION_COOKIE] as string)
    }
    res.clearCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: undefined })
    res.status(204).end()
  }),
)

/** Called on app boot to restore the session. 401 simply means "signed out". */
authRouter.get('/me', (req, res) => {
  if (!req.user) throw unauthorised()
  res.json(req.user)
})

/*
 * `/forgot-password` and `/reset-password` used to sit here.
 *
 * The CMS is operated by a single administrator who signs in with a username;
 * there is no address to send a reset link to, and the sign-in screen no longer
 * offers one. An endpoint that mails a working credential to whoever asks is
 * not something to keep running for nobody.
 *
 * The way back into a locked-out install is now the seed script, which is the
 * only thing that could have helped anyway if the mailbox were unreachable:
 *
 *   SEED_EMAIL=<address> SEED_PASSWORD=<new password> npm run db:seed
 */

/**
 * Length, not composition.
 *
 * The old rule was eight characters with mixed case and a digit, which rejects
 * a long memorable passphrase and accepts `Password1`. Twelve characters with
 * no character-class rules is both stronger in practice and the current NIST
 * guidance — and it is a rule an administrator can satisfy without inventing a
 * capital letter they will not remember where they put.
 */
const passwordSchema = z.string().min(12, 'Use at least 12 characters.')

authRouter.post(
  '/change-password',
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = z
      .object({ currentPassword: z.string().min(1), newPassword: passwordSchema })
      .parse(req.body)

    await auth.changePassword(
      req.user!.userId,
      body.currentPassword,
      body.newPassword,
      req.sessionId!,
    )
    res.status(204).end()
  }),
)
