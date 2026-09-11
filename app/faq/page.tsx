import type { Metadata } from "next";
import { CmsPageHeader } from "@/components/CmsPageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Accordion } from "@/components/Accordion";
import { EmptyState } from "@/components/EmptyState";
import { Rail, SectionHeading } from "@/components/ui";
import { getFaqs } from "@/lib/cms";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `FAQs — Fees, Batches, Certificates & Placement`,
  description: `Answers to the questions we get every week about course duration, fees, EMI, batch timings, certificates, internships and placement support at techcadd ${site.city}.`,
  alternates: { canonical: `${site.url}/faq` },
};

/**
 * Questions grouped under the heading each is filed under.
 *
 * Insertion order, not alphabetical: the CMS returns them ordered by category
 * and then by the position an editor set, and re-sorting here would throw that
 * away. Anything with no category — every hard-coded question below, and any
 * CMS entry an editor left blank — collects under one general heading rather
 * than vanishing.
 */
function groupByCategory(items: { question: string; answer: string; category?: string }[]) {
  const groups = new Map<string, { question: string; answer: string }[]>();

  for (const faq of items) {
    const key = faq.category?.trim() || "More questions";
    groups.set(key, [...(groups.get(key) ?? []), faq]);
  }

  return [...groups.entries()].map(([category, questions]) => ({ category, questions }));
}

export default async function FaqPage() {
  // Every question on this page is managed in the CMS. The page used to append
  // a hard-coded list of its own, which meant an editor could not remove or
  // correct half of what the page said — and made an empty CMS invisible.
  const allFaqs = await getFaqs();
  const groups = groupByCategory(allFaqs);

  // Google rejects an FAQPage with no questions in it, so the block is only
  // emitted when there is something to describe.
  const schema =
    allFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: allFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      <CmsPageHeader
        route="faq"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
        eyebrow="FAQs"
        title="Questions we get every week"
        body="Fees, batch timings, certificates, internships and placement — answered plainly. If yours is not here, call us; counselling is free and there is no obligation to enrol."
        meta={[
          ...(allFaqs.length > 0
            ? [{ label: "Questions", value: String(allFaqs.length) }]
            : []),
          { label: "Phone", value: site.contact.phone },
        ]}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionHeading
                title="Still unsure?"
                body="The fastest way to get a straight answer is a phone call. Most enquiries are resolved in five minutes."
              />
              <div className="mt-8 space-y-3">
                <a
                  href={site.contact.phoneHref}
                  className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 text-sm font-medium transition-colors hover:border-brand-600/30"
                >
                  {site.contact.phone}
                  <span className="text-xs text-muted">{site.contact.hours}</span>
                </a>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 text-sm font-medium transition-colors hover:border-brand-600/30"
                >
                  {site.contact.email}
                  <span className="text-xs text-muted">1 working day</span>
                </a>
              </div>
            </div>

            <div className="space-y-12">
              {allFaqs.length === 0 ? (
                <EmptyState
                  icon="quote"
                  title="No questions published yet"
                  body="Nothing has been added to the FAQ so far. The panel on the left is not a placeholder — call or email and you will get the same answer a page here would have given you, usually within five minutes."
                />
              ) : null}

              {groups.map((group) => (
                <div key={group.category}>
                  {/*
                    * The heading is dropped when everything is in one group —
                    * a single "More questions" heading over the whole page is
                    * a label, not a grouping.
                    */}
                  {groups.length > 1 ? (
                    <h2 className="mb-5 font-display text-lg font-bold tracking-tight">
                      {group.category}
                      <span className="ml-2 text-sm font-normal text-muted">
                        {group.questions.length}
                      </span>
                    </h2>
                  ) : null}
                  <Accordion items={group.questions} />
                </div>
              ))}
            </div>
          </div>
        </Rail>
      </section>

      <CtaSection />
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
    </>
  );
}
