import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail, cx } from "@/components/ui";
import { formatDate } from "@/data/blog";
import { PageBlocks } from "@/components/PageBlocks";
import { TableOfContents, hasIndex } from "@/components/TableOfContents";
import { headingId, headingsFromBlocks, withHeadingIds } from "@/lib/headings";
import { BlogComments } from "@/components/BlogComments";
import { getBlogPost, getBlogPosts, getComments, getRelatedPosts } from "@/lib/cms";
import { site } from "@/data/site";

/**
 * A post published in the CMS after the last build must still resolve, so
 * unknown slugs are rendered on demand rather than 404ed. `getBlogPost`
 * returns null for a slug neither the CMS nor the static set knows, and that
 * is what still produces a 404.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ post: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ post: string }>;
}): Promise<Metadata> {
  const { post: slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${site.url}/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      url: `${site.url}/blogs/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ post: string }> }) {
  const { post: slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const [related, comments] = await Promise.all([
    getRelatedPosts(post.slug, 3),
    getComments(post.slug),
  ]);

  /*
   * The article's own headings, with ids injected so the index can link to
   * them. Done here rather than in the renderer because the index and the
   * markup have to agree on every id, including the suffixes that make
   * repeated headings unique.
   *
   * Static posts carry their headings as structured sections, so those are
   * read straight off the data rather than out of HTML.
   */
  const fromBlocks = post.blocks?.length ? headingsFromBlocks(post.blocks) : null;
  const fromHtml = !fromBlocks && post.html ? withHeadingIds(post.html) : null;
  const headings =
    fromBlocks?.headings ??
    fromHtml?.headings ??
    post.sections
      .filter((section) => section.heading)
      .map((section) => ({
        id: headingId(section.heading as string),
        text: section.heading as string,
        level: 2 as const,
      }));

  /** Drives both the sidebar and whether the grid reserves a column for it. */
  const showIndex = hasIndex(headings);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blogs/${post.slug}`,
  };

  return (
    <>
      <PageHeader
        // Centred to match the article column below it.
        align="center"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blogs", href: "/blogs" },
          { label: post.category },
        ]}
        eyebrow={post.category}
        title={post.title}
        body={post.excerpt}
        meta={[
          { label: "Published", value: formatDate(post.date) },
          { label: "Read time", value: post.readTime },
          { label: "Author", value: post.author },
        ]}
      />

      <article className="py-16 lg:py-20">
        <Rail>
          {/*
            * Index on the left, article on the right, the pair centred.
            *
            * The index is `sticky` so it stays in view while the article
            * scrolls past it — a contents list that scrolls away with the text
            * stops being navigation after the first screen.
            *
            * One column below `lg`: there is no room for a sidebar on a phone,
            * so the index stacks above the article instead of being hidden —
            * it is most useful on the narrow screen that shows least at once.
            */}
          <div className={cx(
                "mx-auto grid gap-10 lg:gap-14",
                // Without an index there is no left column to make room for,
                // so the content keeps the plain centred measure.
                showIndex
                  ? "max-w-5xl lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
                  : "max-w-3xl",
              )}>
            <TableOfContents
              headings={headings}
              className="lg:sticky lg:top-24 lg:self-start"
            />

            <div className="min-w-0 max-w-3xl">
              {/*
                * Blocks first, then the single rich-text body, then the
                * structured sections the static posts use. A post written
                * before the block builder renders exactly as it did.
                */}

            {fromBlocks ? (
              <PageBlocks blocks={fromBlocks.blocks} bare />
            ) : fromHtml ? (
              <div
                className="cms-prose"
                dangerouslySetInnerHTML={{ __html: fromHtml.html }}
              />
            ) : null}

            {post.sections.map((section, i) => (
              <section key={i} className={i > 0 ? "mt-12" : ""}>
                {section.heading ? (
                  <h2
                    id={headingId(section.heading)}
                    data-toc-target
                    className="font-display text-2xl font-bold tracking-tight text-balance wrap-anywhere"
                  >
                    {section.heading}
                  </h2>
                ) : null}
                <div className={section.heading ? "mt-5 space-y-5" : "space-y-5"}>
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j} className="leading-relaxed text-pretty text-muted lg:text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-6 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <Icon name="check" className="mt-1 size-4 shrink-0 text-brand-600" />
                        <span className="leading-relaxed text-muted">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <BlogComments
              blogSlug={post.slug}
              comments={comments.items}
              total={comments.total}
            />

            <div className="mt-14 rounded-2xl border border-line bg-subtle p-7">
              <h2 className="font-display text-lg font-bold tracking-tight wrap-anywhere">
                Want to talk this through?
              </h2>
              <p className="mt-2 leading-relaxed text-muted">
                Career counselling is free, and there is no obligation to enrol. Call us or book a
                demo class and sit through a full session before deciding anything.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact#enquire"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Book a free demo
                  <Icon name="arrow-right" className="size-4" />
                </Link>
                <a
                  href={site.contact.phoneHref}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-medium transition-colors hover:border-brand-600/30"
                >
                  <Icon name="phone" className="size-4" />
                  {site.contact.phone}
                </a>
              </div>
            </div>
            </div>
          </div>
        </Rail>
      </article>

      <section className="bg-subtle py-16 lg:py-20">
        <Rail>
          <h2 className="font-display text-2xl font-bold tracking-tight wrap-anywhere">Read next</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {related.map((item) => (
              <article
                key={item.slug}
                className="card-hover group relative flex flex-col rounded-2xl border border-line bg-white p-6"
              >
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                    {item.category}
                  </span>
                  <span>{formatDate(item.date)}</span>
                </div>
                <h3 className="mt-5 font-display leading-snug font-bold tracking-tight wrap-anywhere">
                  <Link href={`/blogs/${item.slug}`} className="before:absolute before:inset-0">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
                  {item.excerpt}
                </p>
              </article>
            ))}
          </div>
        </Rail>
      </section>

      <CtaSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
