import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { branches, serviceAreas } from "@/data/branches";

export const metadata: Metadata = {
  title: `Our Centres — techcadd Branches Across the Tricity`,
  description: `${branches.length} techcadd centres across Chandigarh, Mohali, Panchkula, Zirakpur, Kharar and Ambala. Same syllabus, same assessments, local batch timings.`,
  alternates: { canonical: `${site.url}/branches` },
};

export default function BranchesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Branches" }]}
        eyebrow="Our centres"
        title={`${branches.length} campuses across the tricity`}
        body="Every centre runs the same syllabus, the same assessments and the same placement process. What differs is the specialisation each one has built around the companies nearby."
        meta={[
          { label: "Centres", value: String(branches.length) },
          { label: "Localities served", value: String(serviceAreas.length) },
          { label: "Head campus", value: site.city },
        ]}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-4 lg:grid-cols-2">
            {branches.map((branch) => (
              <article
                key={branch.slug}
                className="card-hover relative flex flex-col rounded-2xl border border-line bg-white p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      <Link href={`/branches/${branch.slug}`} className="before:absolute before:inset-0">
                        {branch.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-muted">{branch.locality}</p>
                  </div>
                  {branch.isHead ? (
                    <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700">
                      Head campus
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 flex-1 leading-relaxed text-muted">{branch.blurb}</p>

                <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
                  <div className="flex gap-2.5">
                    <Icon name="map-pin" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    <dd className="text-muted">{branch.address}</dd>
                  </div>
                  <div className="flex gap-2.5">
                    <Icon name="phone" className="size-4 shrink-0 text-brand-600" />
                    <dd className="text-muted">{branch.phone}</dd>
                  </div>
                  <div className="flex gap-2.5">
                    <Icon name="monitor" className="size-4 shrink-0 text-brand-600" />
                    <dd className="text-muted">{branch.labs}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="Areas we serve"
            title="Find your nearest centre"
            body="If you are outside the tricity core, these are the localities we regularly train students from, and the campus closest to each."
          />
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/computer-training-in/${area.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 transition-colors hover:border-brand-600/30 hover:bg-brand-50/40"
              >
                <span className="min-w-0">
                  <span className="block font-medium">{area.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted">{area.note}</span>
                </span>
                <Icon
                  name="arrow-right"
                  className="size-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600"
                />
              </Link>
            ))}
          </div>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
