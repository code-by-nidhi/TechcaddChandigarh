import { z } from 'zod'

/** Mirrors `backend/src/modules/course-categories/courseCategories.schema.ts`. */
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

export const ICON_OPTIONS = CATEGORY_ICONS.map((value) => ({ value, label: value }))

export const courseCategorySchema = z.object({
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
  shortName: z.string().min(1, 'A short label is required.').max(60),
  blurb: z.string().max(600).optional(),
  icon: z.enum(CATEGORY_ICONS),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export type CourseCategoryFormValues = z.infer<typeof courseCategorySchema>

export function emptyCourseCategory(): CourseCategoryFormValues {
  return {
    slug: '',
    name: '',
    shortName: '',
    blurb: '',
    icon: 'sparkles',
    order: 0,
    status: 'draft',
  }
}
