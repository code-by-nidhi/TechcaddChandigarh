import { z } from 'zod'

/**
 * Mirrors `backend/src/modules/testimonials/testimonials.schema.ts`.
 *
 * Kept in step by hand rather than shared: the two run in different builds, and
 * the server must validate independently of whatever the browser sent.
 */
export const testimonialSchema = z.object({
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
  /**
   * The review on Google, so a visitor can read it at the source.
   *
   * Any full URL rather than only google.com — the same review is reachable as
   * a Maps link, a `g.page` short link or a `maps.app.goo.gl` one, and
   * refusing those would reject links an editor has just watched work.
   */
  googleUrl: z.union([z.url('Enter a full link, starting with https://'), z.literal('')]).optional(),
  /**
   * Accepts every YouTube shape people paste — watch, youtu.be, embed, shorts,
   * live. The id is pulled out at render time; a link we cannot parse still
   * opens in a new tab rather than being rejected here.
   */
  youtubeUrl: z
    .union([z.url('Enter a full YouTube link, starting with https://'), z.literal('')])
    .optional(),
  avatar:  z
    .object({
      id: z.string().min(1),
      url: z.string(),
      alt: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .nullish(),
  featured: z.boolean(),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export type TestimonialFormValues = z.infer<typeof testimonialSchema>

export function emptyTestimonial(): TestimonialFormValues {
  return {
    authorName: '',
    role: '',
    courseName: '',
    quote: '',
    rating: 5,
    googleUrl: '',
    youtubeUrl: '',
    avatar: null,
    featured: false,
    order: 0,
    status: 'draft',
  }
}

/**
 * The video id inside any YouTube URL, or null.
 *
 * Used for the thumbnail in the admin list and by the site's player dialog.
 * Returns null rather than throwing on an address it does not recognise, so an
 * unusual link degrades to "no preview" instead of breaking the row.
 */
export function youtubeId(url?: string | null): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') return parsed.pathname.slice(1).split('/')[0] || null

    if (host.endsWith('youtube.com')) {
      const v = parsed.searchParams.get('v')
      if (v) return v
      // /embed/<id>, /shorts/<id>, /live/<id> all put the id in the same place.
      const match = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/.exec(parsed.pathname)
      if (match) return match[1] ?? null
    }
  } catch {
    // Not a URL we can parse. The caller shows the link without a preview.
  }
  return null
}
