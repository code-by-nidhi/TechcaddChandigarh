import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

import { assetUrl, withAssetUrls } from '../../http/assetUrl.js'
import { asyncHandler, notFound } from '../../http/errors.js'
import type { ListParams } from '../../http/listParams.js'
import { queryOne, type Row } from '../../db/pool.js'
import * as aiKnowledgeRepo from '../ai-knowledge/aiKnowledge.repo.js'
import * as blogsRepo from '../blogs/blogs.repo.js'
import * as commentsRepo from '../comments/comments.repo.js'
import { publicCommentSchema } from '../comments/comments.schema.js'
import * as categoriesRepo from '../categories/categories.repo.js'
import * as courseCategoriesRepo from '../course-categories/courseCategories.repo.js'
import * as coursesRepo from '../courses/courses.repo.js'
import * as enquiriesRepo from '../enquiries/enquiries.repo.js'
import * as eventsRepo from '../events/events.repo.js'
import * as faqsRepo from '../faqs/faqs.repo.js'
import * as galleryRepo from '../gallery/gallery.repo.js'
import * as newsletterRepo from '../newsletter/newsletter.repo.js'
import * as pagesRepo from '../pages/pages.repo.js'
import { subscribeSchema } from '../newsletter/newsletter.schema.js'
import * as reviewsRepo from '../reviews/reviews.repo.js'
import * as seoRepo from '../seo/seo.repo.js'
import * as testimonialsRepo from '../testimonials/testimonials.repo.js'
import { publicBlogRouter } from './blog.routes.js'
import { assertHuman } from './recaptcha.js'

/**
 * What the public website may read and write.
 *
 * Deliberately a separate router with no `requireAuth`: every other module is
 * behind a session, and mounting public access on those would be one forgotten
 * middleware away from exposing drafts and enquiry records.
 *
 * Two rules hold everywhere below:
 *   - `status: 'published'` is forced, never taken from the query string, so a
 *     crafted request cannot read a draft.
 *   - Nothing here accepts an id from the caller for anything but a lookup.
 */
export const publicRouter = Router()

/**
 * The blog answers on the paths the website already calls, so it lives in a
 * file of its own rather than being flattened in here — it is a contract with
 * an existing frontend, not another listing endpoint.
 */
publicRouter.use('/blog', publicBlogRouter)

/** Only what a marketing page renders — no internal notes or audit fields. */
const PUBLISHED = { status: 'published' } as const
const MAX_PAGE_SIZE = 100

/**
 * `filters` is typed wide so a caller can narrow the result further — by FAQ
 * category, or to featured rows only. `status` is set here rather than being
 * passed in, so no caller can widen it back to include drafts.
 */
function listParams(limit: number): ListParams {
  return {
    page: 1,
    pageSize: Math.min(limit, MAX_PAGE_SIZE),
    filters: { ...PUBLISHED },
    sort: undefined,
    search: undefined,
  }
}

const limitFrom = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, MAX_PAGE_SIZE) : fallback
}

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */

publicRouter.get(
  '/blogs',
  asyncHandler(async (req, res) => {
    const result = await blogsRepo.list(listParams(limitFrom(req.query.limit, 50)))
    res.json(withAssetUrls(req, { items: result.items, total: result.total }))
  }),
)

publicRouter.get(
  '/blogs/:slug',
  asyncHandler(async (req, res) => {
    const row = await queryOne<Row>(
      "SELECT id FROM blogs WHERE slug = ? AND status = 'published' LIMIT 1",
      [req.params.slug],
    )
    if (!row) throw notFound('Post')
    res.json(withAssetUrls(req, await blogsRepo.get(row.id as string)))
  }),
)

/**
 * FAQs, optionally narrowed.
 *
 * The website shows every question on the homepage help centre and a short
 * selection on the contact page, so both filters are worth having here: the
 * alternative is the contact page downloading all of them to render five.
 */
publicRouter.get(
  '/faqs',
  asyncHandler(async (req, res) => {
    const params = listParams(limitFrom(req.query.limit, 100))
    if (typeof req.query.category === 'string' && req.query.category) {
      params.filters.category = req.query.category
    }
    if (req.query.featured === 'true' || req.query.featured === '1') {
      params.filters.featured = '1'
    }

    const result = await faqsRepo.list(params)
    res.json({ items: result.items, total: result.total })
  }),
)

publicRouter.get(
  '/reviews',
  asyncHandler(async (req, res) => {
    const params = listParams(limitFrom(req.query.limit, 50))
    if (req.query.featured === 'true' || req.query.featured === '1') {
      params.filters.featured = '1'
    }

    const result = await reviewsRepo.list(params)
    res.json({ items: result.items, total: result.total })
  }),
)

/**
 * The video testimonial wall.
 *
 * Separate from `/reviews` because the site renders them differently: a review
 * is a quote and a star rating, a testimonial is a student on camera. Both are
 * published from the CMS and neither is derived from the other.
 */
publicRouter.get(
  '/testimonials',
  asyncHandler(async (req, res) => {
    const params = listParams(limitFrom(req.query.limit, 50))
    if (req.query.featured === 'true' || req.query.featured === '1') {
      params.filters.featured = '1'
    }
    // The wall can be narrowed to the ones that actually have a video, so a
    // video-only rail does not download the written ones to discard them.
    const result = await testimonialsRepo.list(params)
    const items =
      req.query.hasVideo === 'true' || req.query.hasVideo === '1'
        ? (result.items as { youtubeUrl?: string }[]).filter((item) => Boolean(item.youtubeUrl))
        : result.items

    res.json(withAssetUrls(req, { items, total: items.length }))
  }),
)

/**
 * Gallery albums, each with its images already attached.
 *
 * The whole gallery is one page on the site, so it is one request here rather
 * than one per album — the alternative is a page that fires a request per tile
 * group and renders in stages.
 */
publicRouter.get(
  '/gallery',
  asyncHandler(async (req, res) => {
    const params = listParams(limitFrom(req.query.limit, 50))
    if (typeof req.query.category === 'string' && req.query.category) {
      params.filters.category = req.query.category
    }

    const result = await galleryRepo.list(params)
    res.json(withAssetUrls(req, { items: result.items, total: result.total }))
  }),
)

publicRouter.get(
  '/events',
  asyncHandler(async (req, res) => {
    const params = listParams(limitFrom(req.query.limit, 50))
    if (typeof req.query.type === 'string' && req.query.type) {
      params.filters.type = req.query.type
    }
    // Newest first, which is what a calendar page leads with.
    params.sort = { field: 'date', dir: 'desc' }

    const result = await eventsRepo.list(params)
    res.json(withAssetUrls(req, { items: result.items, total: result.total }))
  }),
)

publicRouter.get(
  '/events/:slug',
  asyncHandler(async (req, res) => {
    const row = await queryOne<Row>(
      "SELECT id FROM events WHERE slug = ? AND status = 'published' LIMIT 1",
      [req.params.slug],
    )
    if (!row) throw notFound('Event')
    res.json(withAssetUrls(req, await eventsRepo.get(row.id as string)))
  }),
)

/**
 * Editor-authored pages.
 *
 * `kind` narrows to one of the two sorts: `custom` are the ones with their own
 * URL under /pages, `override` are replacement copy for routes the site
 * already has. The site asks for both separately — the nav lists the first,
 * every page checks the second — so neither has to filter the other out.
 */
publicRouter.get(
  '/pages',
  asyncHandler(async (req, res) => {
    const params = listParams(limitFrom(req.query.limit, 100))
    if (req.query.kind === 'custom' || req.query.kind === 'override') {
      params.filters.kind = req.query.kind
    }
    if (req.query.inNav === 'true' || req.query.inNav === '1') {
      params.filters.showInNav = '1'
    }

    const result = await pagesRepo.list(params)
    res.json(withAssetUrls(req, { items: result.items, total: result.total }))
  }),
)

/**
 * One page, addressed by kind and slug.
 *
 * Both travel as query parameters rather than path segments because an
 * override's slug is itself a path — `about/founder` — and a slug with a slash
 * in it cannot be a single route segment without double-encoding it at every
 * call site.
 */
publicRouter.get(
  '/page',
  asyncHandler(async (req, res) => {
    const kind = req.query.kind === 'override' ? 'override' : 'custom'
    const slug = typeof req.query.slug === 'string' ? req.query.slug : ''
    if (!slug) throw notFound('Page')

    const row = await queryOne<Row>(
      "SELECT id FROM pages WHERE kind = ? AND slug = ? AND status = 'published' LIMIT 1",
      [kind, slug],
    )
    if (!row) throw notFound('Page')
    res.json(withAssetUrls(req, await pagesRepo.get(row.id as string)))
  }),
)

/**
 * The whole course catalogue, in one request.
 *
 * The website derives roughly 150 URLs from this and needs all of it at build
 * time, so paging it would only mean the site making the same number of
 * requests in a loop. The cap is high for that reason, and the payload is
 * still small — a course is text.
 */
publicRouter.get(
  '/courses',
  asyncHandler(async (req, res) => {
    const params = listParams(limitFrom(req.query.limit, MAX_PAGE_SIZE))
    if (typeof req.query.category === 'string' && req.query.category) {
      params.filters.categoryId = req.query.category
    }
    if (req.query.featured === 'true' || req.query.featured === '1') {
      params.filters.featured = '1'
    }

    const result = await coursesRepo.list(params)
    res.json(withAssetUrls(req, { items: result.items, total: result.total }))
  }),
)

/**
 * One course, by the key its URLs are built from.
 *
 * Looked up on `course_key` rather than the UUID because that is the only
 * identifier the website has — it reads "python" out of the address bar, not a
 * database id.
 */
publicRouter.get(
  '/courses/:key',
  asyncHandler(async (req, res) => {
    const row = await queryOne<Row>(
      "SELECT id FROM courses WHERE course_key = ? AND status = 'published' LIMIT 1",
      [req.params.key],
    )
    if (!row) throw notFound('Course')
    res.json(withAssetUrls(req, await coursesRepo.get(row.id as string)))
  }),
)

/** The groups the courses page files everything under. */
publicRouter.get(
  '/course-categories',
  asyncHandler(async (req, res) => {
    const result = await courseCategoriesRepo.list(listParams(limitFrom(req.query.limit, 50)))
    res.json({ items: result.items, total: result.total })
  }),
)

publicRouter.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const result = await categoriesRepo.list(listParams(limitFrom(req.query.limit, 50)))
    res.json({ items: result.items, total: result.total })
  }),
)

/**
 * Site-wide facts the marketing pages print.
 *
 * Still a hand-picked list rather than the settings row itself. What is left
 * out is the point: `recaptcha_secret` lives in the same JSON column as the
 * analytics id below, and this endpoint has no session behind it. A field is
 * added here only once it is established that a visitor may read it — which is
 * true of everything a page prints, a logo, and robots.txt by definition.
 */
publicRouter.get(
  '/site',
  asyncHandler(async (req, res) => {
    const row = await queryOne<Row>(
      `SELECT s.site_name, s.tagline, s.contact_email, s.contact_phone, s.address,
              s.stats, s.social, s.robots_txt, s.integrations,
              l.url AS logo_url, l.alt AS logo_alt, l.width AS logo_width, l.height AS logo_height,
              f.url AS favicon_url, f.mime_type AS favicon_mime
         FROM settings s
         LEFT JOIN media l ON l.id = s.logo_id
         LEFT JOIN media f ON f.id = s.favicon_id
        WHERE s.id = 1
        LIMIT 1`,
    )

    const json = <T,>(value: unknown, fallback: T): T => {
      if (value === null || value === undefined) return fallback
      if (typeof value !== 'string') return value as T
      try {
        return JSON.parse(value) as T
      } catch {
        return fallback
      }
    }

    /**
     * Only the two integration fields a browser is allowed to see.
     *
     * Destructured by name rather than spread: the group is one JSON column, so
     * a spread would publish the reCAPTCHA secret stored beside them, and would
     * publish anything added to the group later without anyone noticing.
     */
    const { analyticsId, whatsappNumber, recaptchaSiteKey } = json<Record<string, string>>(
      row?.integrations,
      {},
    )

    res.json({
      siteName: row?.site_name ?? '',
      tagline: row?.tagline ?? undefined,
      contactEmail: row?.contact_email ?? undefined,
      contactPhone: row?.contact_phone ?? undefined,
      address: row?.address ?? undefined,
      stats: json<{ value: string; label: string }[]>(row?.stats, []),
      social: json<Record<string, string>>(row?.social, {}),
      // Dimensions travel with the logo so the site can reserve its space and
      // not shift the header while it loads.
      logo: row?.logo_url
        ? {
            url: assetUrl(req, row.logo_url),
            alt: (row.logo_alt as string) || '',
            width: row.logo_width ? Number(row.logo_width) : undefined,
            height: row.logo_height ? Number(row.logo_height) : undefined,
          }
        : undefined,
      favicon: row?.favicon_url
        ? { url: assetUrl(req, row.favicon_url), mimeType: (row.favicon_mime as string) || undefined }
        : undefined,
      analyticsId: analyticsId || undefined,
      whatsappNumber: whatsappNumber || undefined,
      // The public half of the pair. The secret beside it is never published.
      recaptchaSiteKey: recaptchaSiteKey || undefined,
      robotsTxt: (row?.robots_txt as string) || undefined,
    })
  }),
)

/* ------------------------------------------------------------------ */
/* Enquiries                                                            */
/* ------------------------------------------------------------------ */

/**
 * Anyone on the internet can reach this, so it carries its own limit.
 *
 * The website in front of it already rate-limits, but this endpoint must stand
 * on its own — it is reachable directly.
 */
const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many enquiries from this address. Try again shortly.' },
})

/**
 * What a public form may set.
 *
 * A narrow schema on purpose: `status`, `assigneeId` and `notes` belong to the
 * staff workflow, and letting a form set them would let anyone file an enquiry
 * as already-converted or assign work to a colleague.
 */
const publicEnquirySchema = z.object({
  studentName: z.string().min(1, 'Name is required.').max(120),
  phone: z.string().min(6, 'A contact number is required.').max(30),
  email: z.union([z.email('Enter a valid email address.'), z.literal('')]).optional(),
  courseName: z.string().max(200).default(''),
  message: z.string().max(2000).optional(),
  source: z.enum(['website', 'walk-in', 'phone', 'referral', 'social']).default('website'),
  // Recorded by the site: which form, which page, and who submitted it.
  formType: z.string().max(32).optional(),
  sourceUrl: z.string().max(500).optional(),
  ip: z.string().max(45).optional(),
  userAgent: z.string().max(255).optional(),
  /** reCAPTCHA v3. Only required once a key pair is configured in Settings. */
  captchaToken: z.string().max(4000).optional(),
})

const MAX_PER_PHONE_PER_DAY = 3
const MAX_PER_IP_PER_HOUR = 8

/**
 * Refuses a repeat submission.
 *
 * This check used to live on the website, against its own table. It has to run
 * wherever the enquiries actually are — otherwise the same number could be
 * submitted all day and every one would be recorded.
 */
async function isDuplicate(phone: string, ip?: string): Promise<boolean> {
  const byPhone = await queryOne<{ n: number }>(
    `SELECT COUNT(*) AS n FROM enquiries
      WHERE phone = ? AND created_at > NOW() - INTERVAL 1 DAY`,
    [phone],
  )
  if (Number(byPhone?.n ?? 0) >= MAX_PER_PHONE_PER_DAY) return true

  if (!ip) return false

  const byIp = await queryOne<{ n: number }>(
    `SELECT COUNT(*) AS n FROM enquiries
      WHERE ip = ? AND created_at > NOW() - INTERVAL 1 HOUR`,
    [ip],
  )
  return Number(byIp?.n ?? 0) >= MAX_PER_IP_PER_HOUR
}

publicRouter.post(
  '/enquiries',
  enquiryLimiter,
  asyncHandler(async (req, res) => {
    const input = publicEnquirySchema.parse(req.body)

    // Before anything is written, and before the duplicate lookup: a rejected
    // submission should cost one Google round trip, not a database query.
    await assertHuman(input.captchaToken, input.ip ?? req.ip)

    if (await isDuplicate(input.phone, input.ip)) {
      // 429 rather than an error: the enquiry did reach us, we are simply not
      // recording it again. The site shows a reassuring message.
      res.status(429).json({
        message: 'We already have your enquiry. A counsellor will call you shortly.',
      })
      return
    }

    const { captchaToken: _captchaToken, ...enquiry } = input

    await enquiriesRepo.create({
      ...enquiry,
      // Every public submission starts at the beginning of the pipeline.
      status: 'new',
      notes: [],
      assigneeId: undefined,
      followUpDate: undefined,
    })

    // Deliberately not the created record: an enquiry is not the submitter's to
    // read back, and the id is of no use to them.
    res.status(201).json({ ok: true })
  }),
)

/* ------------------------------------------------------------------ */
/* Newsletter                                                           */
/* ------------------------------------------------------------------ */

/** Reachable by anyone, so it carries its own limit — see the note above. */
const newsletterLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many attempts. Try again shortly.' },
})

/**
 * Subscribing is idempotent, and says so in the same words either way.
 *
 * A distinct "you are already subscribed" would confirm to a stranger that an
 * address is on the list, which is not ours to disclose. The outcome is still
 * returned so the website can word its confirmation naturally; it is not a
 * membership check, because every outcome ends with the address subscribed.
 */
publicRouter.post(
  '/newsletter/subscribe',
  newsletterLimiter,
  asyncHandler(async (req, res) => {
    const input = subscribeSchema.parse(req.body)
    await assertHuman(req.body?.captchaToken, req.ip)

    const outcome = await newsletterRepo.subscribe(input)

    res.status(outcome === 'subscribed' ? 201 : 200).json({
      status: outcome,
      message: "You're on the list. Look out for the next issue.",
    })
  }),
)

/* ------------------------------------------------------------------ */
/* Comments                                                             */
/* ------------------------------------------------------------------ */

/**
 * The approved comments on one post.
 *
 * Addressed by blog slug rather than id, because the slug is what the website
 * has on the page it is rendering — asking it to resolve an id first would be
 * an extra round trip for nothing.
 */
publicRouter.get(
  '/blog/posts/:slug/comments',
  asyncHandler(async (req, res) => {
    const row = await queryOne<Row>(
      "SELECT id FROM blogs WHERE slug = ? AND status = 'published' LIMIT 1",
      [req.params.slug],
    )
    // An empty thread rather than a 404: the post may simply have no comments,
    // and the site renders the form either way.
    if (!row) {
      res.json({ items: [], total: 0 })
      return
    }

    const items = await commentsRepo.publicThread(row.id as string)
    const total = items.reduce((sum, comment) => sum + 1 + comment.replies.length, 0)
    res.json({ items, total })
  }),
)

/** Reachable by anyone, so it carries its own limit — see the note above. */
const commentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many comments from this address. Try again shortly.' },
})

publicRouter.post(
  '/comments',
  commentLimiter,
  asyncHandler(async (req, res) => {
    const input = publicCommentSchema.parse(req.body)

    // Before anything is written: a rejected submission should cost one Google
    // round trip, not a database query.
    await assertHuman(input.captchaToken, req.ip)

    const post = await queryOne<Row>(
      "SELECT id FROM blogs WHERE slug = ? AND status = 'published' LIMIT 1",
      [input.blogSlug],
    )
    if (!post) throw notFound('Post')

    const blogId = post.id as string

    if (await commentsRepo.isDuplicate(blogId, input.body, req.ip)) {
      // 200, not an error: the comment did reach us, we are simply not
      // recording it twice. A double-click should not read as a failure.
      res.status(200).json({
        ok: true,
        duplicate: true,
        message: 'You have already posted that. It is waiting to be approved.',
      })
      return
    }

    await commentsRepo.submit(input, {
      blogId,
      ip: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
    })

    // Deliberately not the created record: a pending comment is not the
    // submitter's to read back, and the id is of no use to them.
    res.status(201).json({
      ok: true,
      message: 'Thanks — your comment will appear once it has been approved.',
    })
  }),
)

/* ------------------------------------------------------------------ */
/* Chatbot                                                              */
/* ------------------------------------------------------------------ */

/** Reachable by anyone, and each call costs a full-text search. */
const askLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many questions. Give it a moment.' },
})

/**
 * What the website chatbot answers a visitor from.
 *
 * Returns the matches rather than a composed reply: this API has no model
 * behind it, and pretending otherwise would put words in the institute's mouth
 * that no editor wrote. The site decides whether to show the best answer
 * verbatim or hand the set to a model.
 */
publicRouter.get(
  '/ask',
  askLimiter,
  asyncHandler(async (req, res) => {
    const question = typeof req.query.q === 'string' ? req.query.q : ''
    const matches = await aiKnowledgeRepo.search(question, limitFrom(req.query.limit, 3))

    res.json({
      question,
      items: matches.map(({ id, question: q, answer, category }) => ({
        id,
        question: q,
        answer,
        category,
      })),
    })

    // Counted after the response, and not awaited: a visitor should never wait
    // on a counter. Only the best match counts as served.
    if (matches[0]) void aiKnowledgeRepo.countHit(matches[0].id)
  }),
)

/* ------------------------------------------------------------------ */
/* SEO                                                                  */
/* ------------------------------------------------------------------ */

/**
 * The redirect rules and per-route meta overrides, for the website.
 *
 * One endpoint rather than two because the site fetches both at the same
 * moment — the middleware needs the rules and the page needs the meta — and
 * both are small enough to send whole rather than queried per request.
 */
publicRouter.get(
  '/seo',
  asyncHandler(async (req, res) => {
    const [redirects, meta, sitemap] = await Promise.all([
      seoRepo.activeRedirects(),
      seoRepo.metaByRoute(),
      seoRepo.getSitemapSettings(),
    ])
    res.json(withAssetUrls(req, { redirects, meta, sitemap }))
  }),
)

/** Counted when the site follows a rule, so dead ones can be found later. */
publicRouter.post(
  '/seo/redirect-hit',
  asyncHandler(async (req, res) => {
    const from = typeof req.body?.from === 'string' ? req.body.from : ''
    if (from) void seoRepo.countRedirectHit(from)
    res.status(202).json({ ok: true })
  }),
)
