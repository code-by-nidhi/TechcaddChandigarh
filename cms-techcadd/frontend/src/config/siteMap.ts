/**
 * Where each kind of content ends up on the public website.
 *
 * An editor filling in a form cannot tell, from the form alone, whether they
 * are writing something that appears on the homepage, on a page of its own, or
 * nowhere at all until a developer wires it up. That gap is where "I saved it
 * and nothing happened" comes from, so it is answered here in one place and
 * shown on every form.
 *
 * Keeping it as data rather than prose in each form means a module that is not
 * yet connected has to say so explicitly, instead of quietly omitting the note.
 */

/** The public site. Set VITE_SITE_URL when it is not on the usual dev port. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'http://localhost:3000'
).replace(/\/$/, '')

export interface Placement {
  /** Where this content shows up, in a sentence an editor can act on. */
  where: string
  /**
   * The public URL of one record, when it has a page of its own.
   *
   * Undefined means the content appears inside other pages rather than at its
   * own address — a review has no URL, a blog post does.
   */
  url?: (record: Record<string, unknown>) => string | undefined
  /**
   * The page on the website where this module's content is rendered.
   *
   * What "View on site" opens from a list. Separate from `url` because most
   * modules have no per-record address: a review, an FAQ and a testimonial all
   * appear *inside* a page, and the useful thing to open is that page.
   *
   * Undefined means nothing on the site renders this module as a page — the
   * media library, the audit log, the team list.
   */
  indexUrl?: string
  /**
   * Set when nothing on the website reads this yet.
   *
   * The honest alternative to leaving the module out of this map, which would
   * read as "no note needed" rather than "this goes nowhere".
   */
  notLive?: string
}

const slugUrl = (prefix: string) => (record: Record<string, unknown>) => {
  const slug = record.slug
  return typeof slug === 'string' && slug ? `${SITE_URL}${prefix}${slug}` : undefined
}

export const SITE_MAP: Record<string, Placement> = {
  blogs: {
    indexUrl: `${SITE_URL}/blogs`,
    where:
      'The blog index at /blogs and a page of its own, plus the blog rail on the homepage. The newest post leads the index with the large panel at the top.',
    url: slugUrl('/blogs/'),
  },
  courses: {
    indexUrl: `${SITE_URL}/courses`,
    where:
      'The course catalogue at /courses, filed under its category, and a page of its own at /<key>-course-in-chandigarh. Switching on industrial training publishes a second page at /<key>-training-in-chandigarh. Featured courses also lead the homepage and the branch pages.',
    url: (record) => {
      const key = record.courseKey
      return typeof key === 'string' && key ? `${SITE_URL}/${key}-course-in-chandigarh` : undefined
    },
  },
  'course-categories': {
    indexUrl: `${SITE_URL}/courses`,
    where:
      'The filter row and the section headings on /courses, and the carousel on the homepage. The short label is what the filter pill shows; the icon is drawn from the website’s own set.',
  },
  categories: {
    indexUrl: `${SITE_URL}/blogs`,
    where:
      'The heading a post is filed under, shown on its card and in its breadcrumb. Only categories with a published post in them are used.',
  },
  faqs: {
    indexUrl: `${SITE_URL}/faq`,
    where:
      'The FAQ section on the homepage and every course page, and the full list at /faq. The first six are what the homepage shows.',
  },
  reviews: {
    indexUrl: `${SITE_URL}/reviews`,
    where:
      'The student wall at /reviews and the reviews band on the homepage. Featured reviews are shown first, the outcome line is what each card leads with, and a Google link makes the card clickable through to the review itself.',
  },
  testimonials: {
    indexUrl: `${SITE_URL}/reviews`,
    where:
      'The video testimonial wall at /reviews, above the written reviews. A YouTube link gives the card a play button that opens the video in a dialog on the page — the visitor is never sent to YouTube. Without one it renders as a written testimonial.',
  },
  events: {
    indexUrl: `${SITE_URL}/events`,
    where:
      'The calendar at /events and a page of its own, and listed under Resources → Events in the site menu. Past events stay published as an archive rather than disappearing.',
    url: slugUrl('/events/'),
  },
  gallery: {
    indexUrl: `${SITE_URL}/gallery`,
    where:
      'The gallery at /gallery, grouped under the filter pill you choose. Albums with no photos in them are not shown.',
  },
  pages: {
    where:
      'A new page publishes at its own address under /pages and is listed under Resources → Pages when you leave that switch on. Replacing an existing page instead changes the heading copy on the route you picked, and publishes nothing new.',
    url: (record) => {
      const slug = record.slug
      if (typeof slug !== 'string' || !slug) return undefined
      return record.kind === 'override' ? `${SITE_URL}/${slug}` : `${SITE_URL}/pages/${slug}`
    },
  },
  settings: {
    indexUrl: `${SITE_URL}/`,
    where:
      'Site-wide. The phone number, email and address are what the footer and the whole contact page print; the social links are the footer icon row, where a network left blank is simply not shown; the headline figures are the statistics band on the About page; the logo replaces the wordmark in the header and footer and the favicon becomes the browser tab icon; the WhatsApp number is what every lead button on the site opens; and robots.txt is served verbatim to search engines. Only the reCAPTCHA secret goes nowhere — see the note on the field itself.',
  },
  enquiries: {
    indexUrl: `${SITE_URL}/contact`,
    where:
      'Received from the website — the Book Demo modal and the course enquiry form. Nothing here is published back to it.',
  },
  newsletter: {
    indexUrl: `${SITE_URL}/blogs`,
    where:
      'Collected by the subscribe form at the foot of the blog. Nothing here is published back to the site.',
  },
  media: {
    where: 'Used by whatever content references it — an article cover, an author photo.',
  },

  /**
   * A comment's home is the post it was left on, so that is what "View on
   * site" opens — there is no page of comments.
   */
  comments: {
    indexUrl: `${SITE_URL}/blogs`,
    where:
      'Under the blog post it was left on, once approved. Pending and spam comments are never sent to the website.',
    url: (record) => {
      const slug = record.blogSlug
      return typeof slug === 'string' && slug ? `${SITE_URL}/blogs/${slug}` : undefined
    },
    notLive:
      'The API is ready and comments are being stored, but the website does not render a comment list or a comment form yet. Nothing here reaches a visitor until that is built.',
  },

  'ai-knowledge': {
    where:
      'Answers the website chatbot gives visitors. The alternate phrasings are what decide whether an entry is ever found.',
    notLive:
      'The API is ready — /api/public/ask returns matches — but the website has no chat widget yet, so nothing here reaches a visitor.',
  },

  /* Tools for running the CMS. None of them render anything on the website. */
  team: {
    where:
      'Who can sign in here. The byline and photo appear on the blog posts each person writes; the account itself is never shown.',
    indexUrl: `${SITE_URL}/blogs`,
  },
  contributions: {
    where: 'A report on work done in the CMS. Nothing here is published.',
  },
  activity: {
    where: 'A record of changes made in the CMS. Nothing here is published.',
  },
  seo: {
    indexUrl: `${SITE_URL}/`,
    where:
      'Redirects apply site-wide, meta overrides replace what search engines read for one route, and the sitemap settings decide what goes into sitemap.xml.',
    notLive:
      'Stored and editable, but the website does not follow these redirects or read these meta overrides yet — that wiring is still to be done.',
  },
}
