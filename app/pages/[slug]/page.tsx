import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Rail } from "@/components/ui";
import { getCustomPage, getCustomPages } from "@/lib/cms";
import { site } from "@/data/site";

/**
 * Pages written in the CMS, each at its own address.
 *
 * Deliberately under `/pages/` rather than at the root: the root namespace is
 * already the site's SEO slugs (`/python-course-in-chandigarh`), resolved by
 * `lib/routes.ts` against the course catalogue. An editor-authored page landing
 * there could shadow a course URL, and the collision would only surface as a
 * course page quietly disappearing.
 */

/**
 * A page published after the last build must still resolve, so unknown slugs
 * render on demand. `getCustomPage` returns null for one the CMS does not
 * have, and that is what produces the 404.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getCustomPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) return {};

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.excerpt || undefined,
    alternates: { canonical: `${site.url}/pages/${page.slug}` },
    openGraph: {
      type: "article",
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || page.excerpt || undefined,
      url: `${site.url}/pages/${page.slug}`,
    },
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) notFound();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: page.title }]}
        eyebrow={page.heroEyebrow}
        // The heading falls back to the title, so an editor who fills in only
        // the title still gets a banner rather than an empty one.
        title={page.heroTitle || page.title}
        body={page.heroBody || page.excerpt}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          {/* Sanitised in `lib/cms.ts`, like every rich-text field from the CMS. */}
          <div
            className="cms-prose mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
