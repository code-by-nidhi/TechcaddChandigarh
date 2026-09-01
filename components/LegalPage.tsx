import { PageHeader } from "./PageHeader";
import { Rail } from "./ui";
import { site } from "@/data/site";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

/**
 * Shared shell for the four policy pages. The copy in each page is a starting
 * draft — have it reviewed before launch so it reflects the centre's actual
 * practice, particularly the refund windows.
 */
export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
        eyebrow="Legal"
        title={title}
        body={intro}
        meta={[
          { label: "Last updated", value: updated },
          { label: "Applies to", value: `${site.url.replace("https://", "")}` },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="mx-auto max-w-3xl">
            <nav aria-label="On this page" className="rounded-2xl border border-line bg-subtle p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">
                On this page
              </p>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                {sections.map((section, i) => (
                  <li key={section.heading}>
                    <a
                      href={`#section-${i + 1}`}
                      className="text-sm text-muted transition-colors hover:text-brand-600"
                    >
                      {i + 1}. {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-12 space-y-12">
              {sections.map((section, i) => (
                <section key={section.heading} id={`section-${i + 1}`} className="scroll-mt-24">
                  <h2 className="font-display text-xl font-bold tracking-tight">
                    {i + 1}. {section.heading}
                  </h2>
                  {section.paragraphs?.map((paragraph, j) => (
                    <p key={j} className="mt-4 leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets ? (
                    <ul className="mt-4 space-y-2.5">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 leading-relaxed text-muted">
                          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-600" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="mt-14 rounded-2xl border border-line bg-subtle p-7">
              <h2 className="font-display font-bold tracking-tight">Questions about this policy?</h2>
              <p className="mt-2 leading-relaxed text-muted">
                Write to{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-medium text-brand-600 hover:underline"
                >
                  {site.contact.email}
                </a>{" "}
                or call{" "}
                <a href={site.contact.phoneHref} className="font-medium text-brand-600 hover:underline">
                  {site.contact.phone}
                </a>
                . You can also visit us at {site.address.line1}, {site.address.city}.
              </p>
            </div>
          </div>
        </Rail>
      </section>
    </>
  );
}
