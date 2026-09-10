import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail } from "@/components/ui";
import { getCustomPages } from "@/lib/cms";
import { site } from "@/data/site";

/**
 * The index of editor-authored pages.
 *
 * Exists so the Resources menu can carry one "Pages" link instead of listing
 * every page inside the dropdown — a menu that grows a row per page stops being
 * a menu once there are a dozen of them.
 */

export const metadata: Metadata = {
  title: `Pages — Guides & Information`,
  description: `Guides, policies and information pages from techcadd ${site.city}.`,
  alternates: { canonical: `${site.url}/pages` },
};

export default async function PagesIndex() {
  // Every published page, not only the ones ticked into the nav: this is the
  // index, and a page deliberately kept out of the menu is still findable here.
  const pages = await getCustomPages();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pages" }]}
        eyebrow="Pages"
        title="Guides and information"
        body="Everything that does not fit on a course page — policies, guides and the answers we find ourselves repeating."
        meta={[{ label: "Pages", value: String(pages.length) }]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          {pages.length === 0 ? (
            <p className="text-center text-muted">
              Nothing published here yet. Try the{" "}
              <Link href="/blogs" className="font-medium text-brand-600">
                blog
              </Link>{" "}
              in the meantime.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <article
                  key={page.id}
                  className="card-hover group relative flex flex-col rounded-2xl border border-line bg-white p-6"
                >
                  <h2 className="font-display text-lg leading-snug font-bold tracking-tight wrap-anywhere">
                    <Link
                      href={`/pages/${page.slug}`}
                      className="before:absolute before:inset-0"
                    >
                      {page.title}
                    </Link>
                  </h2>
                  {page.excerpt ? (
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
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
