import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail } from "@/components/ui";
import { getCustomPages } from "@/lib/cms";
import { site } from "@/data/site";

/**
 * The index behind Resources → Pages.
 *
 * The menu shows the first six and links here for the rest, so this route has
 * to exist for that link to go anywhere — it was the one gap left when the
 * Pages module was wired up.
 *
 * Lists every published page, including the ones an editor kept out of the
 * menu: "not in the navigation" is a decision about menu clutter, not about
 * whether the page is findable.
 */

export const metadata: Metadata = {
  title: "Pages",
  description: `Guides, policies and reference pages from techcadd ${site.city}.`,
  alternates: { canonical: `${site.url}/pages` },
};

export default async function PagesIndex() {
  const pages = await getCustomPages();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pages" }]}
        eyebrow="Pages"
        title="Guides, policies and reference"
        body="Everything that does not belong on a course page or in the blog — written and kept current by the team here."
        meta={[{ label: "Pages", value: String(pages.length) }]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          {pages.length === 0 ? (
            <p className="text-muted">
              There is nothing here yet. Try the{" "}
              <Link href="/blogs" className="font-medium text-brand-600 hover:underline">
                blog
              </Link>{" "}
              or{" "}
              <Link href="/faq" className="font-medium text-brand-600 hover:underline">
                the FAQs
              </Link>
              .
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <article
                  key={page.id}
                  className="card-hover group relative flex flex-col rounded-2xl border border-line bg-white p-6"
                >
                  <h2 className="font-display text-lg leading-snug font-bold tracking-tight">
                    <Link
                      href={`/pages/${page.slug}`}
                      className="before:absolute before:inset-0"
                    >
                      {page.title}
                    </Link>
                  </h2>
                  {page.excerpt ? (
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                      {page.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-6 flex items-center justify-end border-t border-line pt-5">
                    <Icon
                      name="arrow-right"
                      className="size-4 text-brand-600 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </article>
              ))}
            </div>
          )}
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
