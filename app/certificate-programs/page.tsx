import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection, FaqSection } from "@/components/sections/Home";
import { Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { programDurations, programTracks, trainingFormats } from "@/data/programs";
import { getCourse } from "@/data/courses";
import { faqs } from "@/data/content";

export const metadata: Metadata = {
  title: `Certificate Programs in ${site.city} — 3, 6 & 9 Month Tracks`,
  description: `Ten technology tracks at three depths: a 3-month certificate, a 6-month advanced certificate with internship, or a 9-month diploma. Compare syllabus, contact hours and what each includes.`,
  alternates: { canonical: `${site.url}/certificate-programs` },
};

export default function CertificateProgramsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Certificate Programs" }]}
        eyebrow="Certificate programs"
        title="Same tracks, three depths"
        body="Every technology track runs as a three-month certificate, a six-month advanced certificate with internship, or a nine-month diploma. The syllabus is cumulative — longer formats add advanced modules and client projects rather than repeating the basics."
        meta={[
          { label: "Tracks", value: String(programTracks.length) },
          { label: "Durations", value: "3, 6 & 9 months" },
          { label: "Awards", value: "Certificate to diploma" },
        ]}
      />

      {/* Duration comparison */}
      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="Compare formats"
            title="Which duration fits your timeline?"
            body="If you are unsure, six months is the one most students pick — it is the shortest format that includes the internship."
          />

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {programDurations.map((duration) => (
              <div
                key={duration.slug}
                className={
                  duration.months === 6
                    ? "hero-surface rounded-3xl p-8 text-white"
                    : "rounded-3xl border border-line bg-white p-8"
                }
              >
                {duration.months === 6 ? (
                  <span className="inline-flex rounded-full bg-accent-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-hero-950">
                    Most popular
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">
                    {duration.tier}
                  </span>
                )}
                <h3 className="mt-5 font-display text-3xl font-extrabold tracking-tight">
                  {duration.label}
                </h3>
                <p
                  className={`mt-1.5 text-sm ${duration.months === 6 ? "text-brand-100/70" : "text-muted"}`}
                >
                  {duration.hours} · {duration.tier}
                </p>
                <p
                  className={`mt-5 text-sm leading-relaxed ${duration.months === 6 ? "text-brand-100/80" : "text-muted"}`}
                >
                  {duration.summary}
                </p>
                <ul className="mt-7 space-y-2.5">
                  {duration.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <Icon
                        name="check"
                        className={`mt-0.5 size-4 shrink-0 ${duration.months === 6 ? "text-accent-400" : "text-emerald-600"}`}
                      />
                      <span className={duration.months === 6 ? "text-brand-100/85" : "text-muted"}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      {/* Track matrix */}
      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="All programs"
            title={`${programTracks.length} tracks × 3 durations`}
            body="Pick your technology, then your duration. Every combination has its own syllabus page."
          />

          <div className="mt-14 space-y-4">
            {programTracks.map((track) => {
              const course = getCourse(track.id);
              return (
                <div
                  key={track.id}
                  className="rounded-2xl border border-line bg-white p-6 lg:flex lg:items-center lg:justify-between lg:gap-8"
                >
                  <div className="min-w-0 lg:max-w-md">
                    <h3 className="font-display text-lg font-bold tracking-tight">{track.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{track.blurb}</p>
                    {course ? (
                      <Link
                        href={`/${track.id}-course-in-${site.citySlug}`}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600"
                      >
                        Full syllabus
                        <Icon name="arrow-right" className="size-3.5" />
                      </Link>
                    ) : null}
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:mt-0 lg:w-[26rem] lg:shrink-0">
                    {programDurations.map((duration) => (
                      <Link
                        key={duration.slug}
                        href={`/${duration.slug}-${track.id}-program-in-${site.citySlug}`}
                        className="group rounded-xl border border-line px-4 py-3 text-center transition-colors hover:border-brand-600/40 hover:bg-brand-50"
                      >
                        <span className="block font-display text-sm font-bold tracking-tight">
                          {duration.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-muted">{duration.tier}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Rail>
      </section>

      {/* Industrial training formats */}
      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="Industrial training"
            title="Shorter university formats"
            body="If your college requires a fixed training duration, these are built to match — with the attendance records, project file and certificate they ask for."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trainingFormats.map((format) => (
              <Link
                key={format.slug}
                href={`/${format.slug}`}
                className="card-hover rounded-2xl border border-line bg-white p-6"
              >
                <p className="font-display text-xl font-bold tracking-tight">{format.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{format.audience}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  Details
                  <Icon name="arrow-right" className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </Rail>
      </section>

      <FaqSection items={faqs.slice(0, 6)} />
      <CtaSection />
    </>
  );
}
