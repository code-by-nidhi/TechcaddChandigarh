import type { ContentStatus } from './index'

/* ------------------------------------------------------------------ */
/* Shared                                                               */
/* ------------------------------------------------------------------ */

export interface BaseEntity {
  id: string
  /** ISO timestamp. */
  createdAt: string
  updatedAt: string
}

/**
 * A reference to an item in the media library.
 *
 * Image slots are typed `MediaRef | null` rather than just optional: absent
 * means "leave it alone" on a patch, and null means "remove it". `undefined`
 * cannot say the second, because JSON.stringify drops the key entirely.
 */
export interface MediaRef {
  id: string
  url: string
  alt: string
  width?: number
  height?: number
}

/** Embedded in every module that surfaces on the public site. */
export interface SeoFields {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogImage?: MediaRef | null
  canonicalUrl?: string
}

export type EnquirySource = 'website' | 'walk-in' | 'phone' | 'referral' | 'social'
/** The CMS has a single role: an admin can do everything. */
export type UserRole = 'admin'

/* ------------------------------------------------------------------ */
/* Categories                                                           */
/* ------------------------------------------------------------------ */

export interface Category extends BaseEntity {
  name: string
  slug: string
  /** Null at the root. Nesting is capped at two levels. */
  parentId?: string
  icon?: string
  accentColor?: string
  description?: string
  order: number
  status: ContentStatus
}

/* ------------------------------------------------------------------ */
/* Blogs                                                                */
/* ------------------------------------------------------------------ */

export interface Blog extends BaseEntity {
  title: string
  slug: string
  authorId?: string
  categoryId?: string
  tags: string[]
  coverImage?: MediaRef | null
  excerpt: string
  body: string
  publishDate?: string
  seo: SeoFields
  status: ContentStatus
  /** The one story the blog index leads with. At most one post holds it. */
  featured: boolean
  /** Feeds the "Trending" rail and the editor's picks row. */
  trending: boolean
  /** Derived from the body on save — read-only here. */
  readingTime: number
  /** Counted by the website when an article is opened. Read-only here. */
  views: number
}

/* ------------------------------------------------------------------ */
/* Faculty                                                              */
/* ------------------------------------------------------------------ */

export interface SocialLinks {
  linkedin?: string
  x?: string
  github?: string
  website?: string
}

/* ------------------------------------------------------------------ */
/* Enquiries                                                            */
/* ------------------------------------------------------------------ */

/** The counselling team's pipeline, in the order a lead moves through it. */
export type EnquiryStatus = 'new' | 'contacted' | 'follow-up' | 'converted' | 'closed'

export interface EnquiryNote {
  id: string
  author: string
  body: string
  createdAt: string
}

export interface EnquiryRecord extends BaseEntity {
  studentName: string
  phone: string
  email?: string
  courseName: string
  source: EnquirySource
  message?: string
  status: EnquiryStatus
  assigneeId?: string
  followUpDate?: string
  notes: EnquiryNote[]
}

/* ------------------------------------------------------------------ */
/* Media                                                                */
/* ------------------------------------------------------------------ */

export interface MediaItem extends BaseEntity {
  filename: string
  url: string
  mimeType: string
  /** Bytes. */
  size: number
  width?: number
  height?: number
  alt: string
  folder?: string
}

/* ------------------------------------------------------------------ */
/* Users                                                                */
/* ------------------------------------------------------------------ */

/**
 * The public half of an account — the byline printed under the articles this
 * person writes, and on their author page. Separate from the credential the
 * account also is, and entirely optional.
 */
export interface AuthorProfile {
  /** The address of the author page: /blog/author/<slug>. */
  slug?: string
  /** "Placement Lead", "AI Track Mentor" — printed beneath the name. */
  title?: string
  bio?: string
  social?: Record<string, string>
}

export interface User extends BaseEntity {
  name: string
  /** What this person signs in with. Lowercase; the email also still works. */
  username?: string
  email: string
  role: UserRole
  avatar?: MediaRef | null
  active: boolean
  author?: AuthorProfile
  /**
   * Mock-only credential digest. Real authentication hashes and verifies on
   * the server — never trust a password check that runs in the browser.
   */
  passwordHash?: string
}

/* ------------------------------------------------------------------ */
/* Site settings — a singleton, not a collection                        */
/* ------------------------------------------------------------------ */

export interface Integrations {
  whatsappNumber?: string
  analyticsId?: string
  /** Public by design — printed into the page for Google's script to read. */
  recaptchaSiteKey?: string
  /** Masked in the UI; revealed on demand. Never leaves the server. */
  recaptchaSecret?: string
}

/**
 * One headline figure, e.g. "15k+" / "Students Trained".
 *
 * The value is a string because the site prints "15k+" and "98%" — the suffix
 * carries as much meaning as the digits, and a number field would lose it.
 */
export interface SiteStat {
  value: string
  label: string
}

export interface SiteSettings {
  siteName: string
  tagline?: string
  logo?: MediaRef | null
  favicon?: MediaRef | null
  contactEmail?: string
  contactPhone?: string
  address?: string
  /** The headline figures the homepage and about page print. */
  stats: SiteStat[]
  social: SocialLinks
  /** Edited from the SEO module. */
  robotsTxt: string
  integrations: Integrations
  /** The signed-in user, filled in from the session rather than stored. */
  profile: { name: string; email: string }
}

/* ------------------------------------------------------------------ */
/* FAQs                                                                 */
/* ------------------------------------------------------------------ */

export interface Faq extends BaseEntity {
  question: string
  answer: string
  /** Free text: the site groups by whatever categories exist. */
  category: string
  order: number
  /** The homepage shows a short selection rather than every question. */
  featured: boolean
  status: ContentStatus
}

/* ------------------------------------------------------------------ */
/* Reviews                                                              */
/* ------------------------------------------------------------------ */

/** Only reviews genuinely left on Google may carry 'google' — the card shows the Google mark. */
export type ReviewSource = 'google' | 'website' | 'walk-in'

export interface Review extends BaseEntity {
  authorName: string
  /** Whole stars, 1–5. */
  rating: number
  quote: string
  /** Month precision, as displayed — "March 2026". */
  reviewedOn?: string
  courseName?: string
  /** The outcome the card leads with — "Placed as MERN Developer". */
  badge?: string
  /** Shown first on the student wall. */
  featured: boolean
  source: ReviewSource
  order: number
  status: ContentStatus
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                           */
/* ------------------------------------------------------------------ */

export type SubscriberStatus = 'active' | 'unsubscribed'

/**
 * Someone who asked to be mailed.
 *
 * There is no create form for these: a subscriber is a person who chose to
 * subscribe, and an address typed in by an administrator would be one nobody
 * consented to. The list is read, filtered and exported — not authored.
 */
export interface Subscriber extends BaseEntity {
  email: string
  status: SubscriberStatus
  /** Which form on the site it came from. Attribution, and nothing more. */
  source: string
  subscribedAt: string
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                         */
/* ------------------------------------------------------------------ */

/**
 * A student on camera.
 *
 * Kept separate from `Review` because the two render as different things: a
 * review is a quote and a star rating in a grid, a testimonial is a video the
 * visitor plays. Everything they share is named identically, so an editor
 * moving between the two forms is not relearning the same field.
 */
export interface Testimonial extends BaseEntity {
  authorName: string
  /** The outcome the card leads with — "Placed as MERN Developer". */
  role: string
  courseName?: string
  quote: string
  /** Whole stars, 1–5. */
  rating: number
  /** The review on Google, so a visitor can read it at the source. */
  googleUrl?: string
  /** Plays in a dialog on the page rather than sending the visitor to YouTube. */
  youtubeUrl?: string
  avatar?: MediaRef | null
  featured: boolean
  order: number
  status: ContentStatus
}

/* ------------------------------------------------------------------ */
/* Gallery                                                              */
/* ------------------------------------------------------------------ */

/** One tile, pointing at a file already in the media library. */
export interface GalleryImage {
  id?: string
  mediaId: string
  /** Overrides the library's alt text for this placement. */
  caption: string
  url?: string
  alt?: string
  width?: number
  height?: number
}

export interface GalleryAlbum extends BaseEntity {
  title: string
  slug: string
  description?: string
  /** The filter pills the gallery page renders: Campus, Classroom, Events… */
  category: string
  cover?: MediaRef | null
  /** The cover, or the first image when none was chosen. Read-only. */
  thumbnail?: { url: string; alt: string }
  images: GalleryImage[]
  imageCount?: number
  order: number
  status: ContentStatus
}

/* ------------------------------------------------------------------ */
/* Events                                                               */
/* ------------------------------------------------------------------ */

export type EventType = 'Summit' | 'Workshop' | 'Seminar' | 'Drive' | 'Webinar' | 'Other'

/**
 * One line of the schedule.
 *
 * `time` is free text: a one-day summit reads "09:30" and a four-day workshop
 * reads "Day 1", and both are what the editor means.
 */
export interface EventAgendaItem {
  id?: string
  time: string
  item: string
}

export interface CampusEvent extends BaseEntity {
  title: string
  slug: string
  /** `YYYY-MM-DD`. */
  date: string
  /** Set only on a multi-day event; the listing prints a range when present. */
  endDate?: string
  startTime?: string
  location: string
  type: EventType
  excerpt?: string
  body?: string
  cover?: MediaRef | null
  registerUrl?: string
  seats?: string
  fee?: string
  agenda: EventAgendaItem[]
  featured: boolean
  status: ContentStatus
  seo?: SeoFields
}

/* ------------------------------------------------------------------ */
/* Pages                                                                */
/* ------------------------------------------------------------------ */

/**
 * `custom` publishes a new URL at /pages/<slug>. `override` replaces copy on a
 * route the site already has, so a heading can change without a deploy.
 */
export type PageKind = 'custom' | 'override'

export interface Page extends BaseEntity {
  title: string
  slug: string
  kind: PageKind
  /** The address this record governs, resolved by the API. */
  path?: string
  excerpt?: string
  body?: string
  heroEyebrow?: string
  heroTitle?: string
  heroBody?: string
  cover?: MediaRef | null
  /** Whether it appears under Resources → Pages in the site nav. */
  showInNav: boolean
  order: number
  status: ContentStatus
  seo?: SeoFields
}

/* ------------------------------------------------------------------ */
/* Course categories                                                    */
/* ------------------------------------------------------------------ */

/**
 * One of the groups the courses page files everything under.
 *
 * Separate from `Category`, which belongs to the blog: a blog category has a
 * description and a post count, a course category has a short label for a
 * filter pill, a marketing blurb and an icon.
 */
export interface CourseCategory extends BaseEntity {
  /** The site's own category id — "ai", "programming". Referenced in URLs. */
  slug: string
  name: string
  /** The filter pill, where the full name does not fit. */
  shortName: string
  blurb?: string
  /** Names an icon in the site's own set, not an uploaded file. */
  icon: string
  order: number
  status: ContentStatus
  /** Read-only; the listing shows it and the delete confirmation needs it. */
  courseCount?: number
}

/* ------------------------------------------------------------------ */
/* Courses                                                              */
/* ------------------------------------------------------------------ */

export type CourseLevel =
  | 'Beginner'
  | 'Beginner to Advanced'
  | 'Intermediate'
  | 'Advanced'

/** One block of the syllabus, with the topics under it. */
export interface CourseModule {
  id?: string
  title: string
  topics: string[]
}

export interface Course extends BaseEntity {
  /**
   * The site's short id — "python", "mern-stack-development".
   *
   * Every URL for this course is derived from it, so changing it moves all of
   * them at once.
   */
  courseKey: string
  name: string
  /**
   * Nullable, not merely optional: absent means "leave it alone" on a patch
   * and `null` means "remove it", and `undefined` cannot say the second
   * because `JSON.stringify` drops the key entirely.
   */
  categoryId?: string | null
  /** Denormalised by the API so the listing needs no second request. */
  category?: { id: string; slug: string; name: string; shortName: string }
  duration: string
  level: CourseLevel
  summary?: string
  /** The ribbon on the card — "Hot", "New", "Trending". */
  badge?: string
  featured: boolean
  /** Publishes the second URL, `<key>-training-in-<city>`. */
  hasTraining: boolean
  heroImage?: MediaRef | null
  /** Both halves or neither. Absent means "fee on request". */
  fee?: { original: number; offer: number } | null
  tools: string[]
  modules: CourseModule[]
  outcomes: string[]
  careers: string[]
  order: number
  status: ContentStatus
  seo?: SeoFields
}
