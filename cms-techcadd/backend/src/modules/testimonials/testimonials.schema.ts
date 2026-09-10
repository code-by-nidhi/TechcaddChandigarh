import { z } from 'zod'

import { mediaRef } from '../shared/mediaRef.js'

/**
 * A testimonial is a student on camera; a review is a student in text.
 *
 * They stay separate modules because they render as different things on the
 * site — the review wall is a grid of quotes and stars, the testimonial wall
 * plays video. Everything below that a review also has is named identically,
 * so an editor moving between the two forms is not relearning the same field
 * under a new label.
 */

/**
 * Accepts the YouTube URL shapes people actually paste.
 *
 * Deliberately not a strict `youtube.com/watch?v=` check: the same video is
 * reachable as `youtu.be/<id>`, `/embed/<id>`, `/live/<id>` and `/shorts/<id>`,
 * and an editor who copies the address bar on a Short would otherwise be told
 * their working link is invalid. The id is extracted at render time; storing
 * the original means a link we cannot parse today still opens in a new tab.
 */
const optionalUrl = (message: string) =>
  z.union([z.url(message), z.literal('')]).optional()

/**
 * The shape, with no defaults attached.
 *
 * Defaults live only on the create schema below. `.partial()` does NOT strip a
 * `.default()` — so a patch of `{ fee }` would still parse as carrying
 * `agenda: []`, and the repository, seeing a value rather than `undefined`,
 * would wipe the schedule. That is not hypothetical: it happened.
 */
const base = z.object({
  authorName: z.string().min(1, 'A name is required.').max(120),
  /** The outcome the card leads with — "Placed as MERN Developer". */
  role: z.string().max(160),
  courseName: z.string().max(200).optional(),
  quote: z.string().min(1, 'The testimonial text is required.'),
  rating: z
    .number('Choose a rating.')
    .int('Ratings are whole stars.')
    .min(1, 'Choose a rating.')
    .max(5, 'Ratings run from 1 to 5.'),
  googleUrl: optionalUrl('Enter a full link, starting with https://'),
  youtubeUrl: optionalUrl('Enter a full YouTube link, starting with https://'),
  avatar: mediaRef.nullish(),
  featured: z.boolean(),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export const testimonialSchema = base.extend({
  role: z.string().max(160).default(''),
  rating: z
    .number('Choose a rating.')
    .int('Ratings are whole stars.')
    .min(1, 'Choose a rating.')
    .max(5, 'Ratings run from 1 to 5.')
    .default(5),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — a drag-reorder sends `{ order }` alone. */
export const testimonialPatchSchema = base.partial()

export type TestimonialInput = z.infer<typeof testimonialSchema>
export type TestimonialPatch = z.infer<typeof testimonialPatchSchema>
