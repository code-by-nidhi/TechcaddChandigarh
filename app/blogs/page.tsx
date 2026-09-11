import type { Metadata } from "next";
import Link from "next/link";
import { CmsPageHeader } from "@/components/CmsPageHeader";
import { CtaSection } from "@/components/sections/Home";
import { EmptyState } from "@/components/EmptyState";
import { ButtonLink, Icon, Rail } from "@/components/ui";
import { formatDate } from "@/data/blog";
import { getBlogPosts } from "@/lib/cms";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Blog — Course Guides & Career Notes from ${site.city}`,
  description: `Course guides, career scope and honest takes on what is changing in IT, AI and digital marketing — written by the trainers who teach it.`,
  alternates: { canonical: `${site.url}/blogs` },
};

export default async function BlogsPage() {
  // Newest-first, and from the CMS alone — an empty list means nothing is
  // published rather than that something went wrong fetching it.
  const posts = await getBlogPosts();
  const [lead, ...rest] = posts;

  /*
   * An index of the topics on the page, so a reader looking for one subject
   * does not scroll the whole archive. Built from the posts themselves rather
   * than a fixed list — a category with nothing in it would be a link to an
   * empty anchor.
   *
   * A `Map` keeps first-seen order, which is newest-first, so the topic with
   * the most recent writing leads.
   */
  const byCategory = new Map<string, typeof posts>();
  // `rest`, not `posts` — the newest article already has the lead panel above,
  // and listing it again in its topic would print it twice on one page.
  for (const post of rest) {
    byCategory.set(post.category, [...(byCategory.get(post.category) ?? []), post]);
  }
  const categories = [...byCategory.entries()].map(([name, items]) => ({
    name,
    count: items.length,
    id: `topic-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`,
    items,
  }));

  return (
    <>
      <CmsPageHeader
        route="blogs"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blogs" }]}
        eyebrow="Blog"
        title="Notes from the classroom and the codebase"
        body="Course guides, career scope and honest assessments of what is actually changing — written by the people teaching it, not a content agency."
        // The article count is dropped when there are none: "Articles 0" beside
        // the heading announces the gap twice, and the panel below says it
        // better.
        meta={[
          ...(posts.length > 0 ? [{ label: "Articles", value: String(posts.length) }] : []),
          { label: "Written by", value: "techcadd trainers" },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          {/*
            * Nothing published yet. Returned early rather than wrapped around
            * the markup below, which destructures `posts` into a lead article
            * and would have nothing to put in it.
            */}
          {!lead ? (
            <EmptyState
              icon="list"
              title="No articles published yet"
              body="There is nothing on the blog at the moment. New course guides and career notes are written by the trainers themselves and go up here as they land — check back shortly, or ask us directly in the meantime."
              action={
                <ButtonLink href="/contact" variant="primary">
                  Talk to a counsellor
                  <Icon name="arrow-right" className="size-4" />
                </ButtonLink>
              }
            />
          ) : (
          <>
          {/* Lead article */}
          <article className="card-hover relative grid gap-8 rounded-3xl border border-line bg-white p-8 lg:grid-cols-[1.4fr_1fr] lg:p-10">
            <div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                  {lead.category}
                </span>
                <span>{formatDate(lead.date)}</span>
                <span>·</span>
                <span>{lead.readTime}</span>
              </div>
              <h2 className="mt-5 font-display text-2xl leading-snug font-bold tracking-tight text-balance lg:text-3xl wrap-anywhere">
                <Link href={`/blogs/${lead.slug}`} className="before:absolute before:inset-0">
                  {lead.title}
                </Link>
              </h2>
              <p className="mt-4 leading-relaxed text-muted">{lead.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                Read article
                <Icon name="arrow-right" className="size-4" />
              </span>
            </div>
            <div className="hero-surface hidden rounded-2xl p-8 lg:block">
              <Icon name="sparkles" className="size-8 text-accent-400" />
              <p className="mt-5 font-display text-lg font-bold leading-snug text-white wrap-anywhere">
                Latest article
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-100/70">
                Written by the trainers who teach the course it covers.
              </p>
            </div>
          </article>

          {/*
            * The topic index. Anchors rather than a filter: no JavaScript, every
            * post stays on one page and reachable by search, and a shared link
            * still lands on the right section.
            */}
          {categories.length > 1 ? (
            <nav aria-label="Topics" className="mt-10 flex flex-wrap gap-2">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-brand-600/30 hover:text-brand-600"
                >
                  {category.name}
                  <span className="text-xs text-muted">{category.count}</span>
                </a>
              ))}
            </nav>
          ) : null}

          {categories.map((category) => (
            <section key={category.id} id={category.id} data-toc-target className="mt-14">
              <h2 className="font-display text-xl font-bold tracking-tight wrap-anywhere">
                {category.name}
                <span className="ml-2 text-sm font-normal text-muted">{category.count}</span>
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((post) => (
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
                <h2 className="mt-5 font-display text-lg leading-snug font-bold tracking-tight wrap-anywhere">
                  <Link href={`/blogs/${post.slug}`} className="before:absolute before:inset-0">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
                  {post.excerpt}
                </p>
                <span className="mt-6 flex items-center justify-between border-t border-line pt-5 text-xs text-muted">
                  {post.readTime}
                  <Icon
                    name="arrow-right"
                    className="size-4 text-brand-600 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </article>
                ))}
              </div>
            </section>
          ))}
          </>
          )}
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
