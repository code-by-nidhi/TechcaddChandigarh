import { queryOne, type Row } from '../../db/pool.js'
import { badRequest } from '../../http/errors.js'

/**
 * reCAPTCHA v3 verification for the public write endpoints.
 *
 * Off unless configured. An install with no key pair in Settings behaves
 * exactly as it did before this existed — which matters because the enquiry
 * form is the site's lead channel, and a captcha that starts rejecting
 * submissions the moment someone half-fills a settings field would cost real
 * enquiries.
 *
 * v3 rather than the checkbox: it returns a score instead of interrupting the
 * visitor, so no form on the website has to change shape and nobody is asked to
 * identify a traffic light before enquiring about a course.
 */

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

/**
 * Below this a submission is treated as automated.
 *
 * Google's own suggested default. Deliberately not tunable from the CMS: it is
 * a number whose effect is invisible until leads stop arriving, and there is no
 * way for an administrator to tell 0.5 from 0.7 by looking.
 */
const MIN_SCORE = 0.5

/** How long to wait on Google before giving up. */
const TIMEOUT_MS = 5000

interface SiteVerifyResponse {
  success: boolean
  score?: number
  action?: string
  'error-codes'?: string[]
}

/** The stored secret, or undefined when the feature is not configured. */
async function storedSecret(): Promise<string | undefined> {
  const row = await queryOne<Row>('SELECT integrations FROM settings WHERE id = 1 LIMIT 1')
  const raw = row?.integrations

  const parsed: Record<string, unknown> =
    typeof raw === 'string' ? (JSON.parse(raw) as Record<string, unknown>) : ((raw as Record<string, unknown>) ?? {})

  const secret = parsed.recaptchaSecret
  return typeof secret === 'string' && secret.trim() ? secret.trim() : undefined
}

/**
 * Throws unless the submission carries a token Google accepts.
 *
 * Resolves silently when no secret is configured, so this can be called
 * unconditionally from every public write route.
 *
 * A network failure reaching Google resolves rather than rejects. The choice is
 * between dropping genuine enquiries while Google is unreachable and accepting
 * some spam for the duration; for a lead form the second is plainly the lesser
 * harm, and the rate limit and duplicate guard still apply either way.
 */
export async function assertHuman(token: unknown, ip?: string): Promise<void> {
  const secret = await storedSecret()
  if (!secret) return

  if (typeof token !== 'string' || !token) {
    throw badRequest('This form could not be verified. Please reload the page and try again.')
  }

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)

  let result: SiteVerifyResponse
  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    result = (await response.json()) as SiteVerifyResponse
  } catch (error) {
    console.warn('[recaptcha] could not reach Google, allowing the submission:', error)
    return
  }

  if (!result.success || (result.score !== undefined && result.score < MIN_SCORE)) {
    // Deliberately vague to the submitter: naming the score would tell someone
    // tuning a bot exactly how close they are.
    console.warn(
      `[recaptcha] rejected a submission (score ${result.score ?? 'n/a'}, codes ${(result['error-codes'] ?? []).join(',') || 'none'})`,
    )
    throw badRequest('We could not verify that submission. Please reload the page and try again.')
  }
}
