import { z } from 'zod'

import { mediaRef } from '../shared/mediaRef.js'

export const COURSE_LEVELS = [
  'Beginner',
  'Beginner to Advanced',
  'Intermediate',
  'Advanced',
] as const

/**
 * One block of the syllabus, with the topics under it.
 *
 * Nested rather than two flat lists because that is how the site renders it —
 * a module heading with its topics beneath — and because an editor reordering
 * a module expects its topics to travel with it.
 */
const courseModuleSchema = z.object({
  id: z.string().max(64).optional(),
  title: z.string().min(1, 'Give the module a title.').max(200),
  topics: z.array(z.string().min(1).max(300)).default([]),
})

/**
 * What it costs.
 *
 * Both halves or neither: a course showing a struck-through original with no
 * offer beside it reads as a mistake, and an offer with no original has
 * nothing to be an offer against. `null` is "fee on request", which is a real
 * state and different from zero.
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

const base = z.object({
  /**
   * The site's short id — "python", "mern-stack-development".
   *
   * Every URL for this course is derived from it: `/python-course-in-
   * chandigarh`, `/python-training-in-chandigarh`, the after-12th pages.
   * Changing it moves all of them at once, which is why it is a field an
   * editor sets deliberately rather than one derived from the name.
   */
  courseKey: z
    .string()
    .min(1, 'A course key is required.')
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.'),
  name: z.string().min(1, 'A name is required.').max(160),
  categoryId: z.string().max(36).nullish(),
  /** Free text, as displayed: "3 months", "45 days". */
  duration: z.string().max(60).default(''),
  level: z.enum(COURSE_LEVELS),
  summary: z.string().max(1000).optional(),
  /** The ribbon on the card — "Most popular", "New". Empty for most courses. */
  badge: z.string().max(40).optional(),
  featured: z.boolean(),
  /**
   * Publishes the second URL, `<key>-training-in-<city>`.
   *
   * Only the tracks that genuinely run as industrial training as well as a
   * course — switching it on for one that does not publishes a page promising
   * something the centre does not offer.
   */
  hasTraining: z.boolean(),
  heroImage: mediaRef.nullish(),
  fee: feeSchema,
  tools: z.array(z.string().min(1).max(80)).default([]),
  modules: z.array(courseModuleSchema).default([]),
  /** What a student can do afterwards. */
  outcomes: z.array(z.string().min(1).max(300)).default([]),
  /** The roles this track leads to. */
  careers: z.array(z.string().min(1).max(300)).default([]),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
  seo: z
    .object({
      metaTitle: z.string().max(200).optional(),
      metaDescription: z.string().max(300, 'Keep meta descriptions under 300 characters.').optional(),
    })
    .optional(),
})

export const courseSchema = base.extend({
  duration: z.string().max(60).default(''),
  level: z.enum(COURSE_LEVELS).default('Beginner to Advanced'),
  featured: z.boolean().default(false),
  hasTraining: z.boolean().default(false),
  tools: z.array(z.string().min(1).max(80)).default([]),
  modules: z.array(courseModuleSchema).default([]),
  outcomes: z.array(z.string().min(1).max(300)).default([]),
  careers: z.array(z.string().min(1).max(300)).default([]),
  order: z.number().default(0),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const coursePatchSchema = base.partial()

export type CourseInput = z.infer<typeof courseSchema>
export type CoursePatch = z.infer<typeof coursePatchSchema>
export type CourseModuleInput = z.infer<typeof courseModuleSchema>
