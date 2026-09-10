/**
 * Mirrors the API's rule in `auth.routes.ts`.
 *
 * Client-side validation is a convenience; the server's is the guarantee. They
 * have to agree, though — a form that accepts a password the API then refuses
 * is worse than no check at all, and that is exactly what happened while this
 * file asked for mixed case and the API had stopped requiring it.
 */
export const MIN_PASSWORD_LENGTH = 12

/** Returns the first unmet requirement, or undefined when the password passes. */
export function passwordProblem(password: string): string | undefined {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  return undefined
}

/**
 * 0–4, used only to colour the strength meter.
 *
 * Length carries most of the weight, because it is what actually resists a
 * guess. The variety checks still count for something — they are a reasonable
 * proxy for how large the search space is — but none of them is required, so
 * the meter advises rather than blocks.
 */
export function passwordScore(password: string): number {
  if (!password) return 0

  let value = 0
  if (password.length >= MIN_PASSWORD_LENGTH) value += 1
  if (password.length >= 16) value += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) value += 1
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) value += 1

  return Math.min(value, 4)
}
