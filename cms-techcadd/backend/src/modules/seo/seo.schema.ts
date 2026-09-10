import { z } from 'zod'

import { mediaRef } from '../shared/mediaRef.js'

/**
 * A site path, normalised.
 *
 * Stored with a leading slash and no origin, so a rule written while the site
 * was on a staging domain still applies in production. Trailing slashes are
 * stripped because `/courses` and `/courses/` are the same page and a rule that
 * matched only one of them would look broken half the time.
 */
const sitePath = z
  .string()
  .min(1, 'A path is required.')
  .max(500)
  .transform((value) => {
    const trimmed = value.trim()
    const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
    return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash
  })

/* ------------------------------------------------------------------ */
/* Redirects                                                           */
/* ------------------------------------------------------------------ */

const redirectBase = z.object({
  from: sitePath,
  /** Allowed to be absolute — a redirect off-site is a legitimate thing to want. */
  to: z
    .string()
    .min(1, 'A destination is required.')
    .max(500)
    .transform((value) => {
      const trimmed = value.trim()
      if (/^https?:\/\//i.test(trimmed)) return trimmed
      return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
    }),
  /**
   * 301 moves the ranking, 302 does not.
   *
   * Only these two: 307 and 308 exist but differ only in how they treat a POST
   * body, which no redirect on a marketing site has.
   */
  statusCode: z.union([z.literal(301), z.literal(302)]),
  active: z.boolean(),
  note: z.string().max(255).optional(),
})

export const redirectSchema = redirectBase
  .extend({
    statusCode: z.union([z.literal(301), z.literal(302)]).default(301),
    active: z.boolean().default(true),
  })
  .superRefine((value, ctx) => {
    // A rule pointing at itself is an infinite loop the browser gives up on
    // after a few hops, and the page simply stops working.
    if (value.from === value.to) {
      ctx.addIssue({
        code: 'custom',
        path: ['to'],
        message: 'A redirect cannot point at itself.',
      })
    }
  })

export const redirectPatchSchema = redirectBase.partial()

export type RedirectInput = z.infer<typeof redirectSchema>
export type RedirectPatch = z.infer<typeof redirectPatchSchema>

/* ------------------------------------------------------------------ */
/* Per-route meta                                                      */
/* ------------------------------------------------------------------ */

const metaBase = z.object({
  route: sitePath,
  /**
   * The two caps match where Google truncates.
   *
   * Enforced rather than warned: a title that renders cut off in the results is
   * worse than one an editor had to shorten.
   */
  metaTitle: z.string().max(60, 'Keep meta titles under 60 characters.').optional(),
  metaDescription: z
    .string()
    .max(160, 'Keep meta descriptions under 160 characters.')
    .optional(),
  ogImage: mediaRef.nullish(),
  canonicalUrl: z.union([z.url('Enter a full URL.'), z.literal('')]).optional(),
  noindex: z.boolean(),
})

export const seoMetaSchema = metaBase.extend({
  noindex: z.boolean().default(false),
})

export const seoMetaPatchSchema = metaBase.partial()

export type SeoMetaInput = z.infer<typeof seoMetaSchema>
export type SeoMetaPatch = z.infer<typeof seoMetaPatchSchema>

/* ------------------------------------------------------------------ */
/* Sitemap                                                             */
/* ------------------------------------------------------------------ */

/**
 * Which sections go into sitemap.xml, and how they are weighted.
 *
 * One record, stored as JSON on the settings row — see the note in migration
 * 020. `changeFrequency` and `priority` are hints search engines are free to
 * ignore, which is why nothing here is worth a table.
 */
export const sitemapSectionSchema = z.object({
  key: z.string().min(1).max(40),
  include: z.boolean(),
  priority: z.number().min(0).max(1),
  changeFrequency: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']),
})

export const sitemapSettingsSchema = z.object({
  sections: z.array(sitemapSectionSchema),
})

export type SitemapSettings = z.infer<typeof sitemapSettingsSchema>

/** The sections the site actually publishes, and sensible defaults for each. */
export const DEFAULT_SITEMAP_SECTIONS: z.infer<typeof sitemapSectionSchema>[] = [
  { key: 'home', include: true, priority: 1, changeFrequency: 'weekly' },
  { key: 'courses', include: true, priority: 0.9, changeFrequency: 'weekly' },
  { key: 'programs', include: true, priority: 0.8, changeFrequency: 'monthly' },
  { key: 'blogs', include: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'events', include: true, priority: 0.5, changeFrequency: 'weekly' },
  { key: 'branches', include: true, priority: 0.8, changeFrequency: 'monthly' },
  { key: 'serviceAreas', include: true, priority: 0.6, changeFrequency: 'monthly' },
  { key: 'pages', include: true, priority: 0.5, changeFrequency: 'monthly' },
  { key: 'tools', include: true, priority: 0.6, changeFrequency: 'monthly' },
  { key: 'legal', include: true, priority: 0.3, changeFrequency: 'yearly' },
]
