import Link from "next/link";
import { Breadcrumbs, Icon } from "@/components/ui";
import { HeroReveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";
import type { Course } from "@/data/courses";
import type { Program } from "@/data/programs";
import { faqs } from "@/data/content";
import { courseSchema, faqPageSchema } from "@/lib/schema";
import {
  CertificationSection,
  ProjectsSection,
  GetStartedStrip,
} from "@/components/CourseDetailExtras";
import { CourseEnquirySection } from "@/components/CourseEnquirySection";
import {
  A12Overview,
  A12WhatYoullLearn,
  A12ToolsRow,
  A12Eligibility,
  A12WorthYear,
  A12WhyNow,
  A12WorkingLoop,
  A12WhyChoose,
  A12PopularPrograms,
} from "@/components/After12thSections";
import { A12CurriculumTabs, A12CareerRoles, A12Faq } from "@/components/After12thInteractive";

/**
 * A dedicated template for After 12th program pages, mirroring the reference
 * site's section-by-section structure — distinct enough from the regular
 * CourseTemplate (zigzag "what you'll learn", tabbed curriculum, expandable
 * career roles, a light FAQ) that reusing CourseTemplate would mean branching
 * nearly every section. Curriculum, tools, careers and certification content
 * all come from the same real `Course` the track maps to.
 */
export function After12thTemplate({
  course,
  program,
  slug,
}: {
  course: Course;
  program: Program;
  slug: string;
}) {
  const schema = courseSchema({
    name: program.title,
    description: program.summary,
    url: `${site.url}/${slug}`,
    priceInr: course.fee?.offer,
  });
  const faqSchema = faqPageSchema(faqs.slice(0, 6));

  return (
    <>
      {/* --------------------------------------- Hero --------------------------------------- */}
      <section className="hero-surface relative isolate overflow-hidden pt-24 pb-16 text-white lg:pt-28 lg:pb-20">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.12]"
        >
          <defs>
            <pattern id="a12-hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#a12-hero-grid)" />
        </svg>

        <HeroReveal className="rail relative">
          <div data-hero-item>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "After 12th Courses", href: "/after-12th-courses" },
                { label: `${program.track.name} Program` },
              ]}
              onDark
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-12">
            <div>
              <h1
                data-hero-item
                className="mt-6 max-w-2xl font-display text-4xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-5xl"
              >
                Best After 12th {program.duration.label}{" "}
                <span className="text-amber-400 underline decoration-2 underline-offset-4">
                  {program.track.name} Program
                </span>{" "}
                in {site.city}
              </h1>
              <p
                data-hero-item
                className="mt-6 max-w-xl leading-relaxed text-pretty text-brand-100/85 lg:text-lg"
              >
                {program.summary}
              </p>
            </div>

            <div
              data-hero-item
              className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-sm"
            >
              <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">
                Rated on Google
              </p>
              <p className="mt-2 flex items-center justify-center gap-1.5 font-display text-3xl font-extrabold text-[#00D4FF]">
                {site.stats.rating}
                <Icon name="star" className="size-6" />
              </p>
              <p className="mt-1 text-xs text-white/60">{site.stats.reviews} reviews</p>
            </div>
          </div>

          <div
            data-hero-item
            className="relative isolate mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm lg:p-9"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 left-8 size-9 rounded-full border-2 border-brand-300/60"
            />
            <h2 className="font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
              {program.track.name} Program Course in {site.city}
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
              Enrol in the {program.duration.label} {program.track.name} program after 12th at
              techcadd {site.city} ({site.stats.rating}★, {site.stats.reviews} reviews). Learn{" "}
              {course.tools.slice(0, 4).join(", ")} with a hands-on capstone project. No prior
              background required.
            </p>

            <p className="mt-6 text-sm font-bold text-white">Key Highlights:</p>
            <div className="mt-3 grid grid-cols-1 gap-x-12 gap-y-2.5 sm:grid-cols-2">
              {[
                { label: "Duration", value: program.duration.label },
                { label: "Mode", value: "Practical + Theory" },
                { label: "Eligibility", value: "12th Pass, Any Stream" },
                { label: "Includes", value: "Certificate + Placement Support" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 text-sm text-white/80">
                  <span className="size-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span className="font-semibold text-white">{item.label}:</span> {item.value}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact#enquire"
                className="inline-flex h-12 items-center justify-center rounded-full bg-amber-400 px-7 text-sm font-bold text-hero-950 transition-colors hover:bg-amber-300"
              >
                Enrol Now
              </Link>
              <a
                href={site.contact.phoneHref}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10"
              >
                Book a Free Demo
              </a>
            </div>
          </div>
        </HeroReveal>
      </section>

      {/* -------------------------------------- Body -------------------------------------- */}
      <section className="py-20 lg:py-28">
        <div className="rail">
          <A12Overview course={course} />
        </div>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <div className="rail">
          <A12WhatYoullLearn course={course} />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="rail">
          <A12CurriculumTabs course={course} program={program} />
        </div>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <div className="rail">
          <A12ToolsRow course={course} />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="rail">
          <A12Eligibility />
        </div>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <div className="rail">
          <A12WorthYear course={course} program={program} />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="rail">
          <A12WhyNow course={course} />
        </div>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <div className="rail">
          <CertificationSection course={course} />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="rail">
          <A12CareerRoles course={course} />
        </div>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <div className="rail">
          <ProjectsSection course={course} />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="rail">
          <A12WorkingLoop course={course} />
        </div>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <div className="rail">
          <A12WhyChoose />
        </div>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <div className="rail">
          <A12PopularPrograms program={program} />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="rail">
          <A12Faq course={course} program={program} />
        </div>
      </section>

      <CourseEnquirySection course={course} />

      <section className="py-20 lg:py-28">
        <div className="rail">
          <GetStartedStrip course={course} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
