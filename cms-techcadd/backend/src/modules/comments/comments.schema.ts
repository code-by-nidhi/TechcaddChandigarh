import { z } from 'zod'

export const COMMENT_STATUSES = ['pending', 'approved', 'spam'] as const

/**
 * What a moderator may change.
 *
 * Deliberately narrow: the text and the author are what the visitor wrote, and
 * a CMS that lets staff silently rewrite someone's comment under their own name
 * is not moderation. Status is the decision; the body is evidence.
 */
export const commentPatchSchema = z.object({
  status: z.enum(COMMENT_STATUSES),
})

/**
 * What the public form may send.
 *
 * `status` is absent on purpose — it is forced to 'pending' by the endpoint, so
 * a crafted request cannot publish itself.
 */
export const publicCommentSchema = z.object({
  blogSlug: z.string().min(1).max(200),
  parentId: z.string().max(36).optional(),
  authorName: z.string().min(1, 'Your name is required.').max(120),
  email: z.union([z.email('Enter a valid email address.'), z.literal('')]).optional(),
  body: z
    .string()
    .min(2, 'Write a comment first.')
    // Long enough for a real question about a course, short enough that the
    // moderation queue does not become a reading task.
    .max(2000, 'Keep comments under 2000 characters.'),
  /** reCAPTCHA v3, verified only once a key pair is configured in Settings. */
  captchaToken: z.string().max(4000).optional(),
})

export type CommentPatch = z.infer<typeof commentPatchSchema>
export type PublicCommentInput = z.infer<typeof publicCommentSchema>
