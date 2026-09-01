import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail } from "@/components/ui";
import { blogPosts, formatDate } from "@/data/blog";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Blog — Course Guides & Career Notes from ${site.city}`,
  description: `Course guides, career scope and honest takes on what is changing in IT, AI and digital marketing — written by the trainers who teach it.`,
  alternates: { canonical: `${site.url}/blogs` },
};

export default function BlogsPage() {
  const [lead, ...rest] = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blogs" }]}
        eyebrow="Blog"
        title="Notes from the classroom and the codebase"
        body="Course guides, career scope and honest assessments of what is actually changing — written by the people teaching it, not a content agency."
        meta={[
          { label: "Articles", value: String(blogPosts.length) },
          { label: "Written by", value: "techcadd trainers" },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
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
              <h2 className="mt-5 font-display text-2xl leading-snug font-bold tracking-tight text-balance lg:text-3xl">
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
              <p className="mt-5 font-display text-lg font-bold leading-snug text-white">
                Latest article
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-100/70">
                Written by the trainers who teach the course it covers.
              </p>
            </div>
          </article>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
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
                <h2 className="mt-5 font-display text-lg leading-snug font-bold tracking-tight">
                  <Link href={`/blogs/${post.slug}`} className="before:absolute before:inset-0">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
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
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
