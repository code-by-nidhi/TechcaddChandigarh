import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail } from "@/components/ui";
import { blogBySlug, blogPosts, formatDate } from "@/data/blog";
import { site } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ post: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ post: string }>;
}): Promise<Metadata> {
  const { post: slug } = await params;
  const post = blogBySlug.get(slug);
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
  const post = blogBySlug.get(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

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
          <div className="mx-auto max-w-3xl">
            {post.sections.map((section, i) => (
              <section key={i} className={i > 0 ? "mt-12" : ""}>
                {section.heading ? (
                  <h2 className="font-display text-2xl font-bold tracking-tight text-balance">
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

            <div className="mt-14 rounded-2xl border border-line bg-subtle p-7">
              <h2 className="font-display text-lg font-bold tracking-tight">
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
        </Rail>
      </article>

      <section className="bg-subtle py-16 lg:py-20">
        <Rail>
          <h2 className="font-display text-2xl font-bold tracking-tight">Read next</h2>
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
                <h3 className="mt-5 font-display leading-snug font-bold tracking-tight">
                  <Link href={`/blogs/${item.slug}`} className="before:absolute before:inset-0">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
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
