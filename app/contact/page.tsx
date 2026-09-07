import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SupportDesks } from "@/components/sections/SupportDesks";
import { CareerStartSection } from "@/components/sections/CareerStartSection";
import { TrainingHighlights } from "@/components/sections/TrainingHighlights";
import { LocationContact } from "@/components/sections/LocationContact";
import { Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { branches } from "@/data/branches";

export const metadata: Metadata = {
  title: `Contact — Book a Free Demo Class in ${site.city}`,
  description: `Call ${site.contact.phone}, email ${site.contact.email}, or visit our ${site.city} campus. Free career counselling with no obligation to enrol.`,
  alternates: { canonical: `${site.url}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title="Talk to a counsellor before you decide anything"
        body="Career counselling is free and there is no obligation to enrol. Tell us your background and what you want to do next — if a course is wrong for you, we will say so."
        meta={[
          { label: "Phone", value: site.contact.phone },
          { label: "Hours", value: site.contact.hours },
          { label: "Centres", value: String(branches.length) },
        ]}
      />

      <SupportDesks />

      <CareerStartSection />

      <TrainingHighlights />

      <LocationContact />

      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="All centres"
            title="Prefer a campus closer to you?"
            body="Every centre runs the same syllabus and the same placement process."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <Link
                key={branch.slug}
                href={`/branches/${branch.slug}`}
                className="group card-hover rounded-2xl border border-line bg-white p-6 transition-colors duration-300 hover:border-brand-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon name="map-pin" className="size-4.5" />
                  </span>
                  {branch.isHead ? (
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                      Head
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 font-display font-bold tracking-tight">{branch.name}</h3>
                <p className="mt-2.5 text-sm text-muted">{branch.address}</p>
                <p className="mt-4 text-sm font-medium text-brand-600">{branch.phone}</p>
              </Link>
            ))}
          </div>
        </Rail>
      </section>
    </>
  );
}
