import { z } from 'zod'

import { seoBlockSchema } from '../../components/form/seoSchema'

export const COURSE_LEVELS = [
  'Beginner',
  'Beginner to Advanced',
  'Intermediate',
  'Advanced',
] as const

export const LEVEL_OPTIONS = COURSE_LEVELS.map((value) => ({ value, label: value }))

/**
 * The ribbons the website's card component knows how to draw.
 *
 * Offered as a select rather than free text: the site styles exactly these
 * three, and anything else is dropped on the way in rather than rendered as an
 * unstyled box.
 */
export const BADGE_OPTIONS = [
  { value: '', label: 'No badge' },
  { value: 'Hot', label: 'Hot' },
  { value: 'New', label: 'New' },
  { value: 'Trending', label: 'Trending' },
]

const courseModuleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Give the module a title.').max(200),
  topics: z.array(z.string().min(1).max(300)),
})

/**
 * What it costs.
 *
 * Both halves or neither. A struck-through original with no offer beside it
 * reads as a mistake, and an offer with no original has nothing to be an offer
 * against. Absent means "fee on request", which is a real state.
 */
const feeSchema = z
  .object({
    original: z.number().int().nonnegative(),
    offer: z.number().int().nonnegative(),
  })
  .refine((fee) => fee.offer <= fee.original, {
    message: 'The offer price cannot be higher than the original.',
    path: ['offer'],
  })
  .nullish()

/** Mirrors `backend/src/modules/courses/courses.schema.ts`. */
export const courseSchema = z.object({
  /**
   * The site's short id — "python", "mern-stack-development".
   *
   * Every URL for this course is derived from it: the course page, the
   * training page, the after-12th pages. Changing it moves all of them, which
   * is why it is set deliberately rather than derived from the name.
   */
  courseKey: z
    .string()
    .min(1, 'A course key is required.')
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.'),
  name: z.string().min(1, 'A name is required.').max(160),
  categoryId: z.string().nullish(),
  duration: z.string().max(60),
  level: z.enum(COURSE_LEVELS),
  summary: z.string().max(1000).optional(),
  badge: z.string().max(40).optional(),
  featured: z.boolean(),
  hasTraining: z.boolean(),
  heroImage: z
    .object({
      id: z.string().min(1),
      url: z.string(),
      alt: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .nullish(),
  fee: feeSchema,
  tools: z.array(z.string().min(1).max(80)),
  modules: z.array(courseModuleSchema),
  outcomes: z.array(z.string().min(1).max(300)),
  careers: z.array(z.string().min(1).max(300)),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
  seo: seoBlockSchema,
})

export type CourseFormValues = z.infer<typeof courseSchema>

export function emptyCourse(): CourseFormValues {
  return {
    courseKey: '',
    name: '',
    categoryId: null,
    duration: '',
    level: 'Beginner to Advanced',
    summary: '',
    badge: '',
    featured: false,
    hasTraining: false,
    heroImage: null,
    fee: null,
    tools: [],
    modules: [],
    outcomes: [],
    careers: [],
    order: 0,
    status: 'draft',
    seo: { keywords: [] },
  }
}
