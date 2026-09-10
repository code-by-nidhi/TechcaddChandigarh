import { z } from 'zod'

/** Optional image slots accept null — see the note in blogs.schema.ts. */
const mediaRef = z.object({
  id: z.string().min(1),
  url: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

/** One role. Kept as a list so adding another stays a one-line change. */
export const ROLES = ['admin'] as const

/**
 * Long rather than complex.
 *
 * Length beats character-class rules for real-world strength, and a rule that
 * forces a symbol mostly produces `Password1!`.
 */
const password = z
  .string()
  .min(12, 'Use at least 12 characters.')
  .max(200, 'That password is too long.')

/**
 * The public half of an account.
 *
 * Everything here is printed under the articles this person writes and on
 * their author page — it is a byline, not a credential. All optional: an
 * account that never publishes anything needs none of it, and the API falls
 * back to the name for the slug and to an empty biography.
 */
const authorProfile = z.object({
  /** The address of the author page: /blog/author/<slug>. */
  slug: z
    .union([
      z.string().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only.').max(160),
      z.literal(''),
    ])
    .optional(),
  /** "Placement Lead", "AI Track Mentor" — printed beneath the name. */
  title: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
  /** Keyed by network: { linkedin, x, github }. */
  social: z.record(z.string().max(40), z.string().max(300)).optional(),
})

const base = z.object({
  name: z.string().min(1, 'Name is required.').max(120),
  /**
   * What this person signs in with.
   *
   * Lowercase, because the login form should not be case-sensitive about it and
   * storing one canonical form is simpler than collating on the way in. Empty
   * clears it, leaving the email address as the only identifier.
   */
  username: z
    .union([
      z
        .string()
        .regex(/^[a-z0-9._-]+$/, 'Use lowercase letters, numbers, dots, dashes or underscores.')
        .min(3, 'Usernames are at least 3 characters.')
        .max(60),
      z.literal(''),
    ])
    .optional(),
  email: z.email('Enter a valid email address.').max(190),
  role: z.enum(ROLES),
  avatar: mediaRef.nullish(),
  active: z.boolean(),
  author: authorProfile.optional(),
})

export const userSchema = base.extend({
  role: z.enum(ROLES).default('admin'),
  active: z.boolean().default(true),
  /**
   * Optional: the CMS form does not collect one.
   *
   * When it is absent the API generates a temporary password and returns it
   * once, so an admin can hand it over. Once a mailer exists this should
   * become an invitation link instead.
   */
  password: password.optional(),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const userPatchSchema = base.partial().extend({
  password: password.optional(),
})

export type UserInput = z.infer<typeof userSchema>
export type UserPatch = z.infer<typeof userPatchSchema>
