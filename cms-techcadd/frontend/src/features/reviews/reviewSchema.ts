import { z } from 'zod'

export const reviewSchema = z.object({
  authorName: z.string().min(1, 'A name is required.').max(120),
  rating: z
    .number('Choose a rating.')
    .int('Ratings are whole stars.')
    .min(1, 'Choose a rating.')
    .max(5, 'Ratings run from 1 to 5.'),
  quote: z.string().min(1, 'The review text is required.'),
  reviewedOn: z.string().max(40).optional(),
  courseName: z.string().max(200).optional(),
  /**
   * The outcome the card leads with — "Placed as MERN Developer".
   *
   * Not the course: two students on the same track land different roles, and
   * the role is what a visitor reads the card for.
   */
  badge: z.string().max(120).optional(),
  /** Shown first on the student wall. */
  featured: z.boolean(),
  source: z.enum(['google', 'website', 'walk-in']),
  /**
   * A link to the review on Google, so a visitor can read it at the source.
   *
   * Any full URL is accepted rather than only google.com: the same review is
   * reachable as a Maps link, a `g.page` short link or a `maps.app.goo.gl` one,
   * and refusing those would reject links an editor has just watched work.
   */
  googleUrl: z
    .union([z.url('Enter a full link, starting with https://'), z.literal('')])
    .optional(),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

export function emptyReview(): ReviewFormValues {
  return {
    authorName: '',
    rating: 5,
    quote: '',
    reviewedOn: '',
    courseName: '',
    badge: '',
    featured: false,
    source: 'google',
    googleUrl: '',
    order: 0,
    status: 'draft',
  }
}

export const SOURCE_OPTIONS = [
  { value: 'google', label: 'Google' },
  { value: 'website', label: 'Website' },
  { value: 'walk-in', label: 'Walk-in' },
]
