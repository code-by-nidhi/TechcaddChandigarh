import { z } from 'zod'

/**
 * The seven groups the courses page files everything under.
 *
 * Separate from the blog's `categories` module on purpose: they are different
 * things with different shapes. A blog category has a description and a post
 * count; a course category has a short label for a filter pill, a marketing
 * blurb and an icon.
 */

/**
 * Icons the website already draws.
 *
 * A closed list rather than free text: the site renders these from its own
 * sprite, so a name it does not have produces an empty square that only shows
 * up on the live page. Adding one here means adding it to `components/ui/Icon`
 * first.
 */
export const CATEGORY_ICONS = [
  'sparkles',
  'code',
  'layers',
  'megaphone',
  'shield',
  'ruler',
  'monitor',
  'chart',
  'cloud',
  'target',
] as const

const base = z.object({
  /**
   * The site's own category id — "ai", "programming", "web".
   *
   * Referenced in URLs and stored on every course, so renaming the display
   * name never moves a page. Changing this does.
   */
  slug: z
    .string()
    .min(1, 'A key is required.')
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.'),
  name: z.string().min(1, 'A name is required.').max(120),
  /** The filter pill, where the full name does not fit. */
  shortName: z.string().min(1, 'A short label is required.').max(60),
  blurb: z.string().max(600).optional(),
  icon: z.enum(CATEGORY_ICONS),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export const courseCategorySchema = base.extend({
  icon: z.enum(CATEGORY_ICONS).default('sparkles'),
  order: z.number().default(0),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — a drag-reorder sends `{ order }` alone. */
export const courseCategoryPatchSchema = base.partial()

export type CourseCategoryInput = z.infer<typeof courseCategorySchema>
export type CourseCategoryPatch = z.infer<typeof courseCategoryPatchSchema>
