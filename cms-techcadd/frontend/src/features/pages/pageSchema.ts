import { z } from 'zod'

import { seoBlockSchema } from '../../components/form/seoSchema'
import { pageBlockSchema } from '../../components/blocks/blockSchema'

/**
 * A page is one of two things.
 *
 * `custom` publishes a new URL at /pages/<slug>. `override` replaces copy on a
 * route the site already has, so a heading can change without a deploy.
 */
export const PAGE_KIND_OPTIONS = [
  { value: 'custom', label: 'New page (its own URL)' },
  { value: 'override', label: 'Existing page (replace its copy)' },
]

/**
 * The routes an override may target.
 *
 * Mirrors the closed list in `backend/src/modules/pages/pages.schema.ts`. A
 * dropdown rather than free text, because an override naming a route that does
 * not exist is a page an editor writes and never sees.
 *
 * `/about`, `/about/founder` and `/contact` are deliberately absent — they
 * build their own heroes rather than using the shared page header, so an
 * override would save and change nothing.
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

export const ROUTE_OPTIONS = OVERRIDABLE_ROUTES.map((value) => ({ value, label: `/${value}` }))

export const pageSchema = z.object({
  title: z.string().min(1, 'A title is required.').max(200),
  slug: z
    .string()
    .min(1, 'A slug is required.')
    .max(200)
    .regex(
      /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/,
      'Use lowercase letters, numbers, hyphens and slashes.',
    ),
  kind: z.enum(['custom', 'override']),
  excerpt: z.string().max(600).optional(),
  /**
   * The original single rich-text body.
   *
   * Still sent so a page written before blocks existed keeps its content; the
   * website renders it only when a page has no blocks.
   */
  body: z.string().optional(),
  blocks: z.array(pageBlockSchema),
  heroEyebrow: z.string().max(120).optional(),
  heroTitle: z.string().max(300).optional(),
  heroBody: z.string().max(1000).optional(),
  cover: z
    .object({
      id: z.string().min(1),
      url: z.string(),
      alt: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .nullish(),
  showInNav: z.boolean(),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
  seo: seoBlockSchema,
})

export type PageFormValues = z.infer<typeof pageSchema>

export function emptyPage(): PageFormValues {
  return {
    title: '',
    slug: '',
    kind: 'custom',
    excerpt: '',
    body: '',
    blocks: [],
    heroEyebrow: '',
    heroTitle: '',
    heroBody: '',
    cover: null,
    showInNav: true,
    order: 0,
    status: 'draft',
    seo: { keywords: [] },
  }
}
