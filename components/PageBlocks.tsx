import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Icon, Rail, SectionHeading, cx } from "@/components/ui";
import { CourseCard } from "@/components/CourseCard";
import { formatDate } from "@/data/blog";
import { getBlogPosts, getEvents, getReviews, type CmsPageBlock } from "@/lib/cms";
import { headingId } from "@/lib/headings";
import { featuredFrom, getCourses } from "@/lib/catalogue";

/**
 * Renders a CMS page built from blocks.
 *
 * Each block type gets its own component below, and the switch is the only
 * place that knows the full set — adding a type means adding a case here, a
 * member to the schema, and an entry in the CMS picker.
 *
 * The `recent` block is the reason this is a server component: it reads live
 * content at render time, so a page that says "latest posts" keeps saying it
 * without anyone editing the page again.
 */

/**
 * Where a block sits in the rail.
 *
 * `left` starts every block at the rail's left edge, under a left-aligned page
 * header; `center` centres the measure. One helper rather than a CSS override
 * on the wrapper: an `.mx-auto` descendant selector also catches the centred
 * paragraph *inside* the call-to-action panel and shunts it left, which is
 * exactly the misalignment this is meant to fix.
 */
type Align = "center" | "left";

const measure = (align: Align, width: string) => cx(width, align === "center" && "mx-auto");

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

function TextBlock({
  heading,
  anchor,
  body,
  align,
}: {
  heading?: string;
  /** Allocated by `headingsFromBlocks`, so it matches the index exactly. */
  anchor?: string;
  body: string;
  align: Align;
}) {
  return (
    <section className={measure(align, "max-w-3xl")}>
      {/*
        * The id matches what `headingsFromBlocks` allocated, so the index
        * above links here. `data-toc-target` carries the scroll offset that
        * keeps it clear of the fixed header.
        */}
      {heading ? (
        <h2
          id={anchor ?? headingId(heading)}
          data-toc-target
          className="font-display text-2xl font-bold tracking-tight text-balance wrap-anywhere"
        >
          {heading}
        </h2>
      ) : null}
      {/* Sanitised in `lib/cms.ts`, like every rich-text field from the CMS. */}
      <div
        className={cx("cms-prose", heading && "mt-5")}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Image                                                               */
/* ------------------------------------------------------------------ */

/** Three named widths, matching what the editor offers. */
const IMAGE_WIDTH = {
  inline: "max-w-3xl",
  wide: "max-w-5xl",
  full: "w-full",
} as const;

function ImageBlock({
  url,
  alt,
  caption,
  width,
  align,
}: {
  url: string;
  alt: string;
  caption?: string;
  width: "inline" | "wide" | "full";
  align: Align;
}) {
  // A block whose image was removed from the library renders nothing rather
  // than a broken frame with a caption under it.
  if (!url) return null;

  return (
    <figure className={measure(align, IMAGE_WIDTH[width])}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
        <Image
          src={url}
          // The caption doubles as alt text when the file has none — a picture
          // with a caption and no description is worse than one that reuses it.
          alt={alt || caption || ""}
          fill
          sizes={width === "full" ? "100vw" : "(min-width: 1024px) 60vw, 100vw"}
          className="object-cover"
        />
      </div>
      {caption ? (
        <figcaption
          className={cx("mt-3 text-sm text-muted wrap-anywhere", align === "center" && "text-center")}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Video                                                               */
/* ------------------------------------------------------------------ */

/**
 * The embed address for a pasted video link.
 *
 * Handles the shapes people actually paste — a watch URL, a youtu.be short
 * link, a Short, an already-embed URL, and Vimeo. Returns null for anything
 * else, and the block then renders a plain link rather than an empty frame:
 * an author who pasted something unusual should see their link, not a hole.
 */
function embedUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (host.endsWith("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
      const match = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/.exec(parsed.pathname);
      if (match?.[1]) return `https://www.youtube-nocookie.com/embed/${match[1]}`;
    }

    if (host.endsWith("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    // Not an address we can parse — the caller falls back to a link.
  }
  return null;
}

function VideoBlock({
  url,
  heading,
  anchor,
  caption,
  align,
}: {
  url: string;
  heading?: string;
  /** Allocated by `headingsFromBlocks`, so it matches the index exactly. */
  anchor?: string;
  caption?: string;
  align: Align;
}) {
  const embed = embedUrl(url);

  return (
    <section className={measure(align, "max-w-4xl")}>
      {heading ? (
        <h2
          id={anchor ?? headingId(heading)}
          data-toc-target
          className="mb-6 font-display text-2xl font-bold tracking-tight text-balance wrap-anywhere"
        >
          {heading}
        </h2>
      ) : null}

      {embed ? (
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black">
          <iframe
            src={embed}
            title={heading || caption || "Video"}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            // Lazy: an embed below the fold should not cost a player download
            // before the reader has scrolled to it.
            loading="lazy"
            className="absolute inset-0 size-full"
          />
        </div>
      ) : url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-4 text-sm font-medium transition-colors hover:border-brand-600/30"
        >
          <Icon name="play" className="size-4 text-brand-600" />
          Watch the video
        </a>
      ) : null}

      {caption ? (
        <p className={cx("mt-3 text-sm text-muted wrap-anywhere", align === "center" && "text-center")}>
          {caption}
        </p>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Call to action                                                      */
/* ------------------------------------------------------------------ */

function CtaBlock({
  heading,
  body,
  buttonLabel,
  buttonHref,
  tone,
  align,
}: {
  heading: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
  tone: "accent" | "soft";
  align: Align;
}) {
  const dark = tone === "accent";

  return (
    <section
      className={cx(
        measure(align, "max-w-4xl"),
        "rounded-3xl p-8 text-center lg:p-12",
        dark ? "hero-surface text-white" : "border border-line bg-subtle",
      )}
    >
      <h2
        className={cx(
          "font-display text-2xl font-bold tracking-tight text-balance wrap-anywhere lg:text-3xl",
          dark && "text-white",
        )}
      >
        {heading}
      </h2>

      {body ? (
        <p
          className={cx(
            "mx-auto mt-4 max-w-2xl leading-relaxed text-pretty wrap-anywhere",
            dark ? "text-brand-100/80" : "text-muted",
          )}
        >
          {body}
        </p>
      ) : null}

      <div className="mt-8 flex justify-center">
        {/*
          * An external destination has to be a plain anchor: `next/link`
          * prefetches and client-routes, neither of which applies off-site.
          */}
        {/^https?:\/\//i.test(buttonHref) ? (
          <a
            href={buttonHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {buttonLabel}
            <Icon name="arrow-right" className="size-4" />
          </a>
        ) : (
          <ButtonLink href={buttonHref}>
            {buttonLabel}
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Recent                                                              */
/* ------------------------------------------------------------------ */

/**
 * A rail of live content.
 *
 * Fetched at render rather than stored on the page, which is the whole point:
 * an editor picks "latest posts" once and the page keeps up on its own.
 */
async function RecentBlock({
  source,
  heading,
  count,
}: {
  source: "blogs" | "events" | "courses" | "reviews";
  heading?: string;
  count: number;
}) {
  if (source === "courses") {
    const courses = await getCourses();
    const featured = featuredFrom(courses).slice(0, count);
    if (featured.length === 0) return null;

    return (
      <section>
        {heading ? <SectionHeading title={heading} /> : null}
        <div className={cx("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", heading && "mt-10")}>
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    );
  }

  if (source === "events") {
    const events = (await getEvents()).slice(0, count);
    if (events.length === 0) return null;

    return (
      <section>
        {heading ? <SectionHeading title={heading} /> : null}
        <div className={cx("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", heading && "mt-10")}>
          {events.map((event) => (
            <article
              key={event.slug}
              className="card-hover relative flex flex-col rounded-2xl border border-line bg-white p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                {event.type}
              </span>
              <h3 className="mt-3 font-display leading-snug font-bold tracking-tight wrap-anywhere">
                <Link href={`/events/${event.slug}`} className="before:absolute before:inset-0">
                  {event.title}
                </Link>
              </h3>
              <p className="mt-2 text-xs text-muted">{formatDate(event.date)}</p>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
                {event.excerpt}
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (source === "reviews") {
    const reviews = (await getReviews({ limit: count })).slice(0, count);
    if (reviews.length === 0) return null;

    return (
      <section>
        {heading ? <SectionHeading title={heading} /> : null}
        <div className={cx("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", heading && "mt-10")}>
          {reviews.map((review) => (
            <figure
              key={`${review.name}-${review.quote.slice(0, 24)}`}
              className="flex flex-col rounded-2xl border border-line bg-white p-6"
            >
              <div className="flex items-center gap-1 text-accent-yellow">
                {Array.from({ length: review.rating ?? 5 }).map((_, i) => (
                  <Icon key={i} name="star" className="size-4" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
                {review.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-5">
                <span className="block text-sm font-semibold">{review.name}</span>
                <span className="block text-xs text-muted">{review.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  const posts = (await getBlogPosts()).slice(0, count);
  if (posts.length === 0) return null;

  return (
    <section>
      {heading ? <SectionHeading title={heading} /> : null}
      <div className={cx("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", heading && "mt-10")}>
        {posts.map((post) => (
          <article
            key={post.slug}
            className="card-hover group relative flex flex-col rounded-2xl border border-line bg-white p-6"
          >
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                {post.category}
              </span>
              <span>{formatDate(post.date)}</span>
            </div>
            <h3 className="mt-5 font-display text-lg leading-snug font-bold tracking-tight wrap-anywhere">
              <Link href={`/blogs/${post.slug}`} className="before:absolute before:inset-0">
                {post.title}
              </Link>
            </h3>
            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export async function PageBlocks({
  blocks,
  /**
   * `align="left"` drops the centring so blocks sit under a left-aligned hero.
   *
   * Blog articles read as one column starting at the hero's left edge; a
   * standalone page centres its measure. Same blocks, two containers.
   */
  align = "center",
  bare = false,
}: {
  blocks: (CmsPageBlock & { headingAnchor?: string })[];
  align?: Align;
  /** Skip the `Rail` when the caller already provides one. */
  bare?: boolean;
}) {
  if (blocks.length === 0) return null;

  const inner = (
    <div className="space-y-16 lg:space-y-20">
        {blocks.map((block) => {
          switch (block.type) {
            case "text":
              return (
                <TextBlock
                  key={block.id}
                  heading={block.heading}
                  anchor={block.headingAnchor}
                  body={block.body}
                  align={align}
                />
              );
            case "image":
              return (
                <ImageBlock
                  key={block.id}
                  url={block.image.url}
                  alt={block.image.alt}
                  caption={block.caption}
                  width={block.width}
                  align={align}
                />
              );
            case "video":
              return (
                <VideoBlock
                  key={block.id}
                  url={block.url}
                  heading={block.heading}
                  anchor={block.headingAnchor}
                  caption={block.caption}
                  align={align}
                />
              );
            case "cta":
              return (
                <CtaBlock
                  key={block.id}
                  heading={block.heading}
                  body={block.body}
                  buttonLabel={block.buttonLabel}
                  buttonHref={block.buttonHref}
                  tone={block.tone}
                  align={align}
                />
              );
            case "recent":
              return (
                <RecentBlock
                  key={block.id}
                  source={block.source}
                  heading={block.heading}
                  count={block.count}
                />
              );
          }
        })}
    </div>
  );

  return bare ? inner : <Rail>{inner}</Rail>;
}
