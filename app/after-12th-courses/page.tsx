import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection, FaqSection } from "@/components/sections/Home";
import { Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { after12Courses, programDurations, programTracks } from "@/data/programs";
import { getCourse, getCategory } from "@/data/courses";
import { faqs } from "@/data/content";

export const metadata: Metadata = {
  title: `Courses After 12th in ${site.city} — IT, AI & Design Tracks`,
  description: `Foundation-first technology courses for school leavers in ${site.city}. No prior computer background needed. Compare durations, syllabus and fees across ${after12Courses.length} tracks.`,
  alternates: { canonical: `${site.url}/after-12th-courses` },
};

const reasons = [
  {
    icon: "clock",
    title: "Start earning sooner",
    body: "A six-month track plus an internship puts you in a junior role while a degree is still in its first year. Many students do both in parallel.",
  },
  {
    icon: "layers",
    title: "No background assumed",
    body: "Every after-12th track opens with three to four weeks of foundations before the professional syllabus begins.",
  },
  {
    icon: "briefcase",
    title: "A portfolio, not just marks",
    body: "You finish with projects you built and can explain. That is what a first employer actually looks at.",
  },
  {
    icon: "users",
    title: "Fits around a degree",
    body: "Evening and weekend batches exist precisely so you do not have to choose between this and college.",
  },
];

export default function After12Page() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "After 12th" }]}
        eyebrow="After 12th"
        title={`Technology courses after 12th in ${site.city}`}
        body="Foundation-first tracks built for students straight out of school. No prior programming, no assumed computer background — just a starting point and a clear route to a first job."
        meta={[
          { label: "Tracks", value: String(after12Courses.length) },
          { label: "Duration", value: "3 – 6 months" },
          { label: "Prerequisites", value: "None" },
        ]}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Why start now"
            title="Four reasons students do this straight after school"
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => (
              <div key={reason.title} className="rounded-2xl border border-line bg-white p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={reason.icon} className="size-5" />
                </span>
                <h3 className="mt-5 font-display font-bold tracking-tight">{reason.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{reason.body}</p>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="All tracks"
            title="Pick a direction"
            body="Each of these starts from zero. If you cannot decide, book free counselling and we will help you narrow it down."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {after12Courses.map((entry) => {
              const course = getCourse(entry.courseId)!;
              const category = getCategory(course.category);
              return (
                <Link
                  key={entry.slug}
                  href={`/${entry.slug}`}
                  className="card-hover flex flex-col rounded-2xl border border-line bg-white p-6"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon name={category.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
                    {course.name}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                    {course.summary}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-medium text-muted">
                      <Icon name="clock" className="size-3.5" />
                      {entry.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-brand-600">
                      Syllabus
                      <Icon name="arrow-right" className="size-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Rail>
      </section>

      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="Longer programs"
            title="After-12th certificate and diploma programs"
            body="If you want a longer, more structured route, the same tracks run as 3, 6 and 9 month after-12th programs with an internship built in."
          />
          <div className="mt-14 space-y-3">
            {programTracks.map((track) => (
              <div
                key={track.id}
                className="rounded-2xl border border-line bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-8"
              >
                <div className="min-w-0">
                  <h3 className="font-display font-bold tracking-tight">{track.name}</h3>
                  <p className="mt-1 text-sm text-muted">{track.blurb}</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-0 sm:w-72 sm:shrink-0">
                  {programDurations.map((duration) => (
                    <Link
                      key={duration.slug}
                      href={`/after-12th-${duration.slug}-${track.id}-program-in-${site.citySlug}`}
                      className="rounded-xl border border-line px-3 py-2.5 text-center text-xs font-semibold transition-colors hover:border-brand-600/40 hover:bg-brand-50"
                    >
                      {duration.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      <FaqSection items={faqs.slice(0, 6)} />
      <CtaSection />
    </>
  );
}
