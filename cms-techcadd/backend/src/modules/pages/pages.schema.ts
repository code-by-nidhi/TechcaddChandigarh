import { z } from 'zod'

import { mediaRef } from '../shared/mediaRef.js'

/**
 * A page is one of two things, and the `kind` says which.
 *
 * `custom` publishes a new URL at /pages/<slug> — a landing page, a policy, an
 * announcement. `override` carries replacement copy for a route the website
 * already has, so an editor can change the heading on /placement without a
 * deploy. They share every field that matters and an editor thinks of both as
 * "a page", which is why they are one module rather than two.
 */
export const PAGE_KINDS = ['custom', 'override'] as const

/**
 * The site routes an `override` may target.
 *
 * A closed list rather than free text: an override naming a route that does
 * not exist is a page an editor writes and never sees, with nothing to say why.
 * Adding a route here is the deliberate act of making it editable.
 *
 * Deliberately absent: `/about`, `/about/founder` and `/contact`. Those three
 * build their own full-screen heroes rather than rendering the shared page
 * header, so there is nothing for an override to replace — offering them would
 * be a form that saves and changes nothing on the page. Making them editable
 * means restructuring those heroes first, and then adding them here.
 */
export const OVERRIDABLE_ROUTES = [
  'about/mission-vision',
  'about/accreditations-awards',
  'placement',
  'gallery',
  'events',
  'blogs',
  'faq',
  'reviews',
  'branches',
  'college-partnerships',
  'internship-training',
  'certificate-programs',
  'after-12th-courses',
  'courses',
  'tools',
] as const

const base = z.object({
  title: z.string().min(1, 'A title is required.').max(200),
  /**
   * For a `custom` page, the last segment of /pages/<slug>. For an `override`,
   * the site path being replaced — which is why slashes are allowed.
   */
  slug: z
    .string()
    .min(1, 'A slug is required.')
    .max(200)
    .regex(
      /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/,
      'Use lowercase letters, numbers, hyphens and slashes.',
    ),
  kind: z.enum(PAGE_KINDS),
  excerpt: z.string().max(600).optional(),
  body: z.string().optional(),
  /** Page-header copy. Left empty on an override, the route keeps its own. */
  heroEyebrow: z.string().max(120).optional(),
  heroTitle: z.string().max(300).optional(),
  heroBody: z.string().max(1000).optional(),
  cover: mediaRef.nullish(),
  /** Whether this appears under Resources → Pages in the site nav. */
  showInNav: z.boolean(),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
  seo: z
    .object({
      metaTitle: z.string().max(200).optional(),
      metaDescription: z.string().max(300, 'Keep meta descriptions under 300 characters.').optional(),
    })
    .optional(),
})

/**
 * An override must name a route the site actually has.
 *
 * Checked here rather than in the repo so the message lands on the `slug`
 * field in the form, next to the input the editor has to change.
 */
const withKindRules = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((value: unknown, ctx: z.RefinementCtx) => {
    const page = value as { kind?: string; slug?: string }
    if (page.kind !== 'override' || page.slug === undefined) return

    if (!(OVERRIDABLE_ROUTES as readonly string[]).includes(page.slug)) {
      ctx.addIssue({
        code: 'custom',
        path: ['slug'],
        message: 'That route is not one the site allows overriding.',
      })
    }
  })

export const pageSchema = withKindRules(
  base.extend({
    kind: z.enum(PAGE_KINDS).default('custom'),
    showInNav: z.boolean().default(true),
    order: z.number().default(0),
    status: z.enum(['published', 'draft', 'review']).default('draft'),
  }),
)

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const pagePatchSchema = withKindRules(base.partial())

export type PageInput = z.infer<typeof pageSchema>
export type PagePatch = z.infer<typeof pagePatchSchema>
