import { z } from 'zod'

export const REVIEW_SOURCES = ['google', 'website', 'walk-in'] as const

/** Mirrors `frontend/src/features/reviews/reviewSchema.ts`. */
const base = z.object({
  authorName: z.string().min(1, 'A name is required.').max(120),
  rating: z
    .number('Choose a rating.')
    .int('Ratings are whole stars.')
    .min(1, 'Choose a rating.')
    .max(5, 'Ratings run from 1 to 5.'),
  quote: z.string().min(1, 'The review text is required.'),
  /** Month precision, as displayed — "March 2026". */
  reviewedOn: z.string().max(40).optional(),
  courseName: z.string().max(200).optional(),
  /**
   * The outcome the card leads with — "Placed as MERN Developer".
   *
   * Not derivable from the course: two students on the same track land in
   * different roles, and the role is the part a visitor is reading for.
   */
  badge: z.string().max(120).optional(),
  /** Shown first on the student wall. */
  featured: z.boolean(),
  source: z.enum(REVIEW_SOURCES),
  /**
   * The review's own page on Google, so a visitor can read it at the source.
   *
   * A plain URL check rather than a Google-domain one: the same review is
   * reachable as `google.com/maps/...`, `g.page/...`, `maps.app.goo.gl/...` and
   * `search.google.com/local/...`, and a host allow-list would reject a link
   * that works while an editor watched it work. Empty clears it.
   */
  googleUrl: z
    .union([
      z.url('Enter a full link, starting with https://'),
      z.literal(''),
    ])
    .optional(),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export const reviewSchema = base.extend({
  rating: z
    .number('Choose a rating.')
    .int('Ratings are whole stars.')
    .min(1, 'Choose a rating.')
    .max(5, 'Ratings run from 1 to 5.')
    .default(5),
  featured: z.boolean().default(false),
  source: z.enum(REVIEW_SOURCES).default('google'),
  order: z.number().default(0),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const reviewPatchSchema = base.partial()

export type ReviewInput = z.infer<typeof reviewSchema>
export type ReviewPatch = z.infer<typeof reviewPatchSchema>
