/**
 * The website's read side of the CMS.
 *
 * Every marketing page below used to import a static array out of `data/`.
 * This module puts the CMS in front of them, so an editor can change a post,
 * an FAQ, a review or the phone number without a redeploy.
 *
 * Three rules hold for everything in this file:
 *
 *   - **A CMS failure is never a page failure.** Every getter catches and logs
 *     once rather than throwing. A marketing site that 500s because a content
 *     API is restarting is worse than one rendering a section short.
 *   - **Blogs, FAQs and reviews are the CMS's alone.** These three are what an
 *     editor actually manages day to day, so they have no static fallback: an
 *     empty CMS, an unset `CMS_API_URL` and an API that will not answer all
 *     produce an empty list, and the page says it has nothing to show. The
 *     alternative — quietly serving copy out of `data/` — puts an article an
 *     editor deleted back on the site and gives them no way to tell whether
 *     what they are looking at came from their save or from the repo.
 *   - **Nothing reaches a page in CMS shape.** Each getter maps the API
 *     response onto the type the components already render, so adopting the
 *     CMS did not mean rewriting the presentation layer.
 *
 * Events and the site settings keep their static defaults: they are structural
 * copy the site cannot render a sensible page without, not an editorial feed.
 *
 * Server-only: these calls carry no session, but they are cached per-tag by
 * Next's data cache, which does not exist in the browser.
 */

import { type BlogPost } from "@/data/blog";
import { events as staticEvents, type CampusEvent } from "@/data/events";
import { type Faq, type Testimonial } from "@/data/content";
import { site as staticSite } from "@/data/site";
import { sanitizeHtml } from "@/lib/sanitize";

/* ------------------------------------------------------------------ */
/* Transport                                                           */
/* ------------------------------------------------------------------ */

/**
 * Where the CMS is. Unset means "no CMS" rather than "broken CMS": a developer
 * cloning this repo gets a working site from the static data with no services
 * to start, and production opts in by setting the variable.
 */
const BASE = (process.env.CMS_API_URL ?? "").replace(/\/+$/, "");

/** Everything the website may read lives under the public router. */
const PUBLIC = BASE ? `${BASE}/api/public` : "";

export const cmsEnabled = Boolean(BASE);

/**
 * One tag for the whole CMS.
 *
 * The API's revalidate hook does not say what changed — it fires after any
 * successful mutation — so a finer-grained set of tags could not be
 * invalidated accurately and would leave some pages stale after a save. One
 * tag is honest about what we actually know.
 */
export const CMS_TAG = "cms";

/** How long a page may serve CMS content before checking again, absent a webhook ping. */
const REVALIDATE_SECONDS = Number(process.env.CMS_REVALIDATE_SECONDS ?? 300);

/** Long enough for a cold API to answer, short enough not to hang a render. */
const TIMEOUT_MS = 8000;

/**
 * Logs a given failure once per process.
 *
 * Without this, a CMS that is down produces one line per getter per render,
 * which buries everything else in the log during exactly the incident you
 * would want to read the log during.
 */
const warned = new Set<string>();

function warnOnce(key: string, error: unknown) {
  if (warned.has(key)) return;
  warned.add(key);
  const reason = error instanceof Error ? error.message : String(error);
  console.warn(`[cms] ${key} unavailable (${reason}) - falling back to static content.`);
}

async function cmsFetch<T>(
  path: string,
  search?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${PUBLIC}${path}`);
  for (const [key, value] of Object.entries(search ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS, tags: [CMS_TAG] },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${path}`);
  }
  return (await response.json()) as T;
}

/**
 * Runs a CMS read, or returns the static fallback.
 *
 * `fallback` is a thunk so an expensive default is not built on the happy
 * path, and so it is only evaluated when it is actually needed.
 */
async function orStatic<T>(key: string, read: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!cmsEnabled) return fallback();
  try {
    return await read();
  } catch (error) {
    warnOnce(key, error);
    return fallback();
  }
}

/**
 * Runs a read for one of the CMS-only modules, or returns nothing.
 *
 * The blog, the FAQs and the reviews have no copy in `data/` standing behind
 * them any more, so every way of failing to get content collapses to the same
 * answer: an empty list. The page renders its "nothing published yet" state,
 * which is true whether the CMS is empty, unset or unreachable — and is a far
 * better thing to show an editor than content they cannot find in their CMS.
 */
async function orNothing<T>(key: string, read: () => Promise<T[]>): Promise<T[]> {
  if (!cmsEnabled) return [];
  try {
    return await read();
  } catch (error) {
    warnOnce(key, error);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

/** The article shape `/api/public/blog/*` returns. */
interface CmsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  readingTime: number;
  publishedAt: string | null;
  category: { id: string; name: string; slug: string };
  author: { id: string; name: string; slug: string; avatar: string; role: string };
}

interface CmsArticleDetail extends CmsArticle {
  /** Rich text from the CMS editor. Rendered only when there are no blocks. */
  content: string;
  blocks: CmsPageBlock[];
  seo?: { title?: string; description?: string };
}

/**
 * A CMS article as the site's own `BlogPost`.
 *
 * `sections` is left empty and the body travels as `html`: the static posts
 * were authored as structured sections, while the CMS stores one rich-text
 * document. The post page renders whichever of the two is present, so both
 * kinds of post coexist rather than one having to be converted to the other.
 */
function toPost(article: CmsArticle, html?: string, blocks?: CmsPageBlock[]): BlogPost {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt ?? "",
    category: article.category?.name ?? "General",
    // The site sorts and formats on an ISO date; the API omits it only for a
    // post with no publish date set, which then sorts last rather than
    // crashing the formatter.
    date: article.publishedAt ?? "",
    readTime: `${Math.max(1, Math.round(article.readingTime ?? 1))} min read`,
    author: article.author?.name ?? "techcadd Faculty",
    sections: [],
    // Sanitised here rather than at the point of render, so no page can render
    // a CMS body without it having been through the allowlist.
    html: html === undefined ? undefined : sanitizeHtml(html),
    // Text blocks carry editor HTML into the same `dangerouslySetInnerHTML`
    // the body does, so they go through the same allowlist.
    blocks: (blocks ?? []).map((block) =>
      block.type === "text" ? { ...block, body: sanitizeHtml(block.body ?? "") } : block,
    ),
    coverImage: article.featuredImage || undefined,
  };
}

const byNewest = (a: BlogPost, b: BlogPost) => b.date.localeCompare(a.date);

export async function getBlogPosts(limit = 50): Promise<BlogPost[]> {
  return orNothing("blog listing", async () => {
    const { data } = await cmsFetch<{ data: CmsArticle[] }>("/blog/posts", {
      limit,
      sort: "latest",
    });
    // Sorted again on our side: `sort=latest` is the API's ordering, and the
    // listing page relies on newest-first to pick its lead article.
    return data.map((article) => toPost(article)).sort(byNewest);
  });
}

export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  return (await getBlogPosts(Math.max(limit, 3))).slice(0, limit);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!cmsEnabled) return null;
  try {
    const article = await cmsFetch<CmsArticleDetail>(`/blog/posts/${encodeURIComponent(slug)}`);
    return toPost(article, article.content, article.blocks);
  } catch {
    // Deliberately not warned: a 404 here is the ordinary case for any slug
    // somebody guessed or an old link, and the caller turns null into the
    // site's own 404 page.
    return null;
  }
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  return orNothing("related posts", async () => {
    const data = await cmsFetch<CmsArticle[]>(`/blog/posts/${encodeURIComponent(slug)}/related`, {
      limit,
    });
    return data.map((article) => toPost(article));
  });
}

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

interface CmsFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  featured: boolean;
}

export async function getFaqs(
  options: { limit?: number; featured?: boolean } = {},
): Promise<Faq[]> {
  const { limit = 100, featured } = options;

  return orNothing("faqs", async () => {
    const { items } = await cmsFetch<{ items: CmsFaq[] }>("/faqs", {
      limit,
      featured: featured ? "true" : undefined,
    });
    // The category travels with the question — the FAQ page groups by it, and
    // dropping it here was why every question landed in one flat list.
    return items.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    }));
  });
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

interface CmsReview {
  id: string;
  authorName: string;
  rating: number;
  quote: string;
  reviewedOn?: string;
  courseName?: string;
  badge?: string;
  featured: boolean;
  source: string;
  googleUrl?: string;
}

/**
 * "Harleen Kaur" becomes "HK".
 *
 * The card renders initials in an avatar circle. The CMS has no field for them
 * because there is no version of this an editor should have to type.
 */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function toTestimonial(review: CmsReview): Testimonial {
  return {
    name: review.authorName,
    // `badge` is the outcome the card leads with ("Placed as MERN Developer"),
    // which is what the old static `role` field held. The review month is a
    // reasonable second choice; a blank line is not.
    role: review.badge || review.reviewedOn || "Student",
    course: review.courseName || `techcadd student`,
    initials: initialsOf(review.authorName),
    quote: review.quote,
    rating: review.rating,
    googleUrl: review.googleUrl,
  };
}

export async function getReviews(
  options: { limit?: number; featured?: boolean } = {},
): Promise<Testimonial[]> {
  const { limit = 50, featured } = options;

  return orNothing("reviews", async () => {
    const { items } = await cmsFetch<{ items: CmsReview[] }>("/reviews", {
      limit,
      featured: featured ? "true" : undefined,
    });
    return items.map(toTestimonial);
  });
}

/* ------------------------------------------------------------------ */
/* Comments                                                            */
/* ------------------------------------------------------------------ */

/**
 * An approved comment on a blog post.
 *
 * Only approved ones ever reach here — the API filters on status, so the site
 * has no way to render a pending or spam comment even by mistake. The author's
 * email is never included in the public response.
 */
export interface CmsComment {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  replies: CmsComment[];
}

export async function getComments(
  slug: string,
): Promise<{ items: CmsComment[]; total: number }> {
  return orStatic(
    "comments",
    () =>
      cmsFetch<{ items: CmsComment[]; total: number }>(
        `/blog/posts/${encodeURIComponent(slug)}/comments`,
      ),
    // No static fallback: comments only exist in the CMS, and an empty thread
    // is the honest answer when it cannot be reached.
    () => ({ items: [], total: 0 }),
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

/**
 * A student on camera.
 *
 * Distinct from a review on purpose: the review wall is quotes and stars, the
 * testimonial wall plays video. A testimonial with no `youtubeUrl` still
 * renders — as a written card — so an editor can publish the words before the
 * film exists.
 */
export interface CmsTestimonial {
  id: string;
  authorName: string;
  role: string;
  courseName?: string;
  quote: string;
  rating: number;
  googleUrl?: string;
  youtubeUrl?: string;
  avatar?: { id: string; url: string; alt: string };
  featured: boolean;
}

export async function getTestimonials(
  options: { limit?: number; featured?: boolean; hasVideo?: boolean } = {},
): Promise<CmsTestimonial[]> {
  const { limit = 50, featured, hasVideo } = options;

  return orStatic(
    "testimonials",
    async () => {
      const { items } = await cmsFetch<{ items: CmsTestimonial[] }>("/testimonials", {
        limit,
        featured: featured ? "true" : undefined,
        hasVideo: hasVideo ? "true" : undefined,
      });
      return items;
    },
    // No static fallback: testimonials are a CMS-only module, and the written
    // wall in `data/content.ts` is what `getReviews` already serves. Rendering
    // those twice under two headings would look like a bug.
    () => [],
  );
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export interface CmsGalleryImage {
  id: string;
  caption: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CmsAlbum {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail?: { url: string; alt: string };
  images: CmsGalleryImage[];
  imageCount: number;
}

/**
 * Albums with at least one photo in them.
 *
 * An empty album is one an editor has created and not filled yet; showing it
 * would put an empty group heading on the page. Filtered here rather than in
 * the API so the CMS list still shows the editor their unfinished album.
 */
export async function getAlbums(limit = 50): Promise<CmsAlbum[]> {
  return orStatic(
    "gallery",
    async () => {
      const { items } = await cmsFetch<{ items: CmsAlbum[] }>("/gallery", { limit });
      return items.filter((album) => album.images.length > 0);
    },
    () => [],
  );
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

interface CmsEvent {
  id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  startTime?: string;
  location: string;
  type: string;
  excerpt: string;
  body: string;
  cover?: { id: string; url: string; alt: string };
  photos: { id: string; url: string; alt: string; caption?: string }[];
  agenda: { id?: string; time: string; item: string }[];
  featured: boolean;
}

/**
 * A CMS event as the site's own `CampusEvent`.
 *
 * `body` is left empty and the rich text travels as `html`, the same split the
 * blog uses: the static events are authored as paragraph arrays and a CMS one
 * is a single document. The event page renders whichever it is given.
 */
function toEvent(event: CmsEvent): CampusEvent {
  return {
    slug: event.slug,
    title: event.title,
    date: event.date,
    location: event.location,
    type: (event.type as CampusEvent["type"]) ?? "Workshop",
    excerpt: event.excerpt ?? "",
    body: [],
    agenda: event.agenda.map((slot) => ({ time: slot.time, item: slot.item })),
    html: sanitizeHtml(event.body ?? ""),
    endDate: event.endDate,
    startTime: event.startTime,
    photos: event.photos ?? [],
    coverImage: event.cover?.url,
  };
}

export async function getEvents(limit = 50): Promise<CampusEvent[]> {
  return orStatic(
    "events",
    async () => {
      const { items } = await cmsFetch<{ items: CmsEvent[] }>("/events", { limit });
      if (items.length === 0) return staticEvents;
      return items.map(toEvent);
    },
    () => staticEvents,
  );
}

export async function getEvent(slug: string): Promise<CampusEvent | null> {
  const fallback = () => staticEvents.find((event) => event.slug === slug) ?? null;

  if (!cmsEnabled) return fallback();
  try {
    return toEvent(await cmsFetch<CmsEvent>(`/events/${encodeURIComponent(slug)}`));
  } catch {
    // A 404 is the ordinary case for a static event the CMS has never heard
    // of, not a fault worth logging.
    return fallback();
  }
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

/**
 * One block of a CMS page.
 *
 * Mirrors the API's discriminated union, so the renderer's switch is
 * exhaustive and a new type cannot be forgotten — TypeScript reports the
 * missing case rather than the page silently skipping it.
 */
export type CmsPageBlock =
  | { id: string; type: "text"; heading?: string; body: string }
  | {
      id: string;
      type: "image";
      image: { id: string; url: string; alt: string };
      caption?: string;
      width: "inline" | "wide" | "full";
    }
  | { id: string; type: "video"; url: string; heading?: string; caption?: string }
  | {
      id: string;
      type: "cta";
      heading: string;
      body?: string;
      buttonLabel: string;
      buttonHref: string;
      tone: "accent" | "soft";
    }
  | {
      id: string;
      type: "recent";
      source: "blogs" | "events" | "courses" | "reviews";
      heading?: string;
      count: number;
    };

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  kind: "custom" | "override";
  path: string;
  excerpt: string;
  /** The pre-blocks single body. Rendered only when `blocks` is empty. */
  body: string;
  blocks: CmsPageBlock[];
  heroEyebrow?: string;
  heroTitle?: string;
  heroBody?: string;
  cover?: { id: string; url: string; alt: string };
  showInNav: boolean;
  order: number;
  seo?: { metaTitle?: string; metaDescription?: string };
}

/**
 * Sanitised on the way out, like every other rich-text field from the CMS.
 *
 * Both the legacy body and every text block go through the allowlist — a block
 * body is the same editor output reaching the same `dangerouslySetInnerHTML`,
 * so missing one would leave exactly the hole the sanitiser exists to close.
 */
function toPage(page: CmsPage): CmsPage {
  return {
    ...page,
    body: sanitizeHtml(page.body ?? ""),
    blocks: (page.blocks ?? []).map((block) =>
      block.type === "text" ? { ...block, body: sanitizeHtml(block.body ?? "") } : block,
    ),
  };
}

/** The editor-authored pages with URLs of their own. */
export async function getCustomPages(options: { inNav?: boolean } = {}): Promise<CmsPage[]> {
  return orStatic(
    "pages",
    async () => {
      const { items } = await cmsFetch<{ items: CmsPage[] }>("/pages", {
        kind: "custom",
        inNav: options.inNav ? "true" : undefined,
        limit: 100,
      });
      return items.map(toPage);
    },
    () => [],
  );
}

export async function getCustomPage(slug: string): Promise<CmsPage | null> {
  if (!cmsEnabled) return null;
  try {
    return toPage(await cmsFetch<CmsPage>("/page", { kind: "custom", slug }));
  } catch {
    return null;
  }
}

/**
 * Replacement heading copy for a route the site already has.
 *
 * Every overridable page calls this and merges the result over its own
 * hard-coded copy, so a route with no override behaves exactly as it did
 * before this existed. Returns null far more often than not, which is why it
 * never warns.
 */
export async function getPageOverride(route: string): Promise<CmsPage | null> {
  if (!cmsEnabled) return null;
  try {
    return toPage(await cmsFetch<CmsPage>("/page", { kind: "override", slug: route }));
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

interface CmsSite {
  siteName: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  stats: { value: string; label: string }[];
  social: Record<string, string>;
  logo?: { url: string; alt: string; width?: number; height?: number };
  favicon?: { url: string; mimeType?: string };
  whatsappNumber?: string;
}

/**
 * The static config, made writable and widened.
 *
 * `data/site.ts` is declared `as const`, which types every field as the exact
 * string it happens to hold today — `"4.9"`, not `string`. That is what makes
 * it a good source of literal copy, and exactly what stops a value the CMS
 * returns from being assignable to it. Both the `readonly` and the literal
 * narrowing are undone here, once, rather than cast away at each assignment.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T;

type Mutable<T> = T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : Widen<T>;

export type SiteConfig = Mutable<typeof staticSite> & {
  logo?: { url: string; alt: string; width?: number; height?: number };
};

/**
 * The site config, with anything the CMS has set layered over the defaults.
 *
 * Overlaid field by field rather than replaced wholesale, and only where the
 * CMS actually holds a value: a settings row with a blank phone number must
 * not wipe the number off every page, and the CMS has no opinion at all about
 * things like `citySlug` or the founding year.
 */
export async function getSite(): Promise<SiteConfig> {
  const base = structuredClone(staticSite) as SiteConfig;

  return orStatic(
    "site settings",
    async () => {
      const cms = await cmsFetch<CmsSite>("/site");

      if (cms.siteName) base.name = cms.siteName;
      if (cms.tagline) base.tagline = cms.tagline;
      if (cms.contactEmail) base.contact.email = cms.contactEmail;

      if (cms.contactPhone) {
        base.contact.phone = cms.contactPhone;
        // The dialable forms are derived rather than stored: an editor types a
        // number once, and a `tel:` link that disagrees with the number
        // printed beside it is a support call nobody can diagnose.
        const digits = cms.contactPhone.replace(/\D/g, "");
        if (digits) {
          const national = digits.length > 10 ? digits : `91${digits}`;
          base.contact.phoneHref = `tel:+${national}`;
          const whatsapp = cms.whatsappNumber?.replace(/\D/g, "") || national;
          base.contact.whatsapp = `https://wa.me/${whatsapp}`;
        }
      } else if (cms.whatsappNumber) {
        const digits = cms.whatsappNumber.replace(/\D/g, "");
        if (digits) base.contact.whatsapp = `https://wa.me/${digits}`;
      }

      // Only a full URL replaces the default. The settings row stores these as
      // free text, and a handle typed on its own ("techcadd") would otherwise
      // become href="techcadd" and resolve against the current page.
      for (const [network, value] of Object.entries(cms.social ?? {})) {
        if (network in base.social && /^https?:\/\/\S+$/i.test(value ?? "")) {
          base.social[network as keyof SiteConfig["social"]] = value;
        }
      }

      // Stats arrive as free-text label/value pairs, so they are matched on
      // the label rather than by position — an editor reordering them in the
      // CMS must not swap the alumni count with the placement rate.
      for (const stat of cms.stats ?? []) {
        if (!stat?.value || !stat?.label) continue;
        const key = stat.label.toLowerCase();
        if (key.includes("rating")) base.stats.rating = stat.value;
        else if (key.includes("review")) base.stats.reviews = stat.value;
        else if (key.includes("alumni") || key.includes("student")) base.stats.alumni = stat.value;
        else if (key.includes("partner") || key.includes("recruit")) base.stats.partners = stat.value;
        else if (key.includes("technolog") || key.includes("tool")) base.stats.technologies = stat.value;
        else if (key.includes("placement")) base.stats.placement = stat.value;
      }

      if (cms.logo?.url) base.logo = cms.logo;

      return base;
    },
    () => base,
  );
}
