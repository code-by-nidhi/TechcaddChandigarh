import Link from "next/link";
import { CourseBody } from "@/components/CourseDetail";
import { CourseEnquirySection } from "@/components/CourseEnquirySection";
import { CourseHeroIllustration } from "@/components/CourseHeroIllustration";
import { Breadcrumbs, ButtonLink, Icon } from "@/components/ui";
import { HeroReveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";
import { getCategory, type Course } from "@/data/courses";
import { programsForTrack, type Program } from "@/data/programs";
import { faqs } from "@/data/content";
import { courseSchema, faqPageSchema } from "@/lib/schema";

const FEATURE_CHIPS = [
  "Live client projects",
  "Practitioner trainers",
  "Placement support",
  "Certificate + internship",
];

/**
 * The single template every course page renders through — hero, background,
 * CTAs, highlights, curriculum, tools, projects, certification, placement,
 * FAQ, enquiry form and schema are all defined once here. A course page is
 * never anything but `<CourseTemplate course={course} slug={slug} />`; only
 * the `course` data (and the course/training `variant`) changes per page.
 *
 * Certificate Program pages render through this exact same template — a
 * `program` (whose `track.id` matches a real `Course.id`) only swaps the
 * hero title, breadcrumb, duration and badge; every section below the hero
 * is identical to the course page for that same track.
 */
export function CourseTemplate({
  course,
  slug,
  variant = "course",
  program,
}: {
  course: Course;
  slug: string;
  variant?: "course" | "training";
  program?: Program;
}) {
  const noun = variant === "training" ? "Training" : "Course";
  const trackPrograms = programsForTrack(course.id).filter(
    (p) => !p.after12th && p.slug !== slug,
  );
  const category = getCategory(course.category);

  const heroTitle = program ? program.title : `Best ${course.name} ${noun} in ${site.city}`;
  const heroSummary = program ? program.summary : course.summary;
  const heroDuration = program ? program.duration.label : course.duration;
  const heroBadge = program
    ? program.duration.tier
    : course.badge
      ? `${course.badge} Track`
      : "Industry-Ready Curriculum";
  const heroIncludes = program
    ? program.duration.includes.some((i) => /internship/i.test(i))
      ? "Internship Letter"
      : "Industry Certificate"
    : "Internship Letter";
  const breadcrumbItems = program
    ? [
        { label: "Home", href: "/" },
        {
          label: program.after12th ? "After 12th" : "Certificate Programs",
          href: program.after12th ? "/after-12th-courses" : "/certificate-programs",
        },
        { label: `${program.duration.label} ${program.track.name}` },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Courses", href: "/courses" },
        { label: course.name },
      ];

  const schema = courseSchema({
    name: heroTitle,
    description: heroSummary,
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
            <pattern id="course-hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#course-hero-grid)" />
        </svg>

        <HeroReveal className="rail relative">
          <div data-hero-item>
            <Breadcrumbs items={breadcrumbItems} onDark />
          </div>

          <div data-hero-item className="mt-8 flex flex-wrap items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-brand-600 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)]">
              <Icon name={category.icon} className="size-5" />
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
              {course.name}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-semibold text-amber-300">
              <Icon name="sparkles" className="size-3.5" />
              {heroBadge}
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10">
            <div>
              <h1
                data-hero-item
                className="mt-6 max-w-2xl font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              >
                {heroTitle}
              </h1>
              <p
                data-hero-item
                className="mt-6 max-w-xl leading-relaxed text-pretty text-brand-100/85 lg:text-lg"
              >
                {heroSummary}
              </p>

              <div data-hero-item className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact#enquire"
                  className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-6 text-sm font-semibold text-hero-950 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Book a free demo class
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-colors duration-300 group-hover:bg-brand-700">
                    <Icon name="arrow-right" className="size-4" />
                  </span>
                </Link>
                <a
                  href={site.contact.phoneHref}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/50 hover:bg-white/10"
                >
                  Talk to a counsellor
                </a>
              </div>

              <ul data-hero-item className="mt-6 flex flex-wrap gap-2.5">
                {FEATURE_CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pr-4 pl-2 text-xs font-semibold"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-amber-400 text-hero-950">
                      <Icon name="sparkles" className="size-3" />
                    </span>
                    {chip}
                  </li>
                ))}
              </ul>
            </div>

            <div data-hero-item>
              <CourseHeroIllustration course={course} />
            </div>
          </div>

          <div
            data-hero-item
            className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4"
          >
            {[
              { label: "Duration", value: heroDuration },
              { label: "Mode", value: "Classroom, Weekend & 1-on-1" },
              { label: "Eligibility", value: "12th Pass Onward" },
              { label: "Includes", value: heroIncludes },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] font-bold tracking-widest text-brand-200/70 uppercase">
                  {item.label}
                </p>
                <p className="mt-1.5 font-display text-base font-bold tracking-tight">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div data-hero-item className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                value: site.stats.alumni,
                label: "Students trained",
                sub: `since ${site.founded}`,
              },
              {
                value: `${site.stats.rating}★`,
                label: "Google rating",
                sub: `${site.stats.reviews} reviews`,
              },
              { value: "100%", label: "Practical training", sub: "live client work" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl font-extrabold tracking-tight text-[#00D4FF]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{stat.label}</p>
                <p className="text-xs text-brand-100/60">{stat.sub}</p>
              </div>
            ))}
          </div>
        </HeroReveal>
      </section>

      <div id="syllabus" />

      <CourseBody
        course={course}
        duration={program?.duration.label}
        showExtras
        extra={
          trackPrograms.length ? (
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {program ? "Other durations for this track" : "Available as a certificate program"}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                {program
                  ? "The same track runs at other depths too. Pick whichever timeline matches yours — each format adds its own advanced modules, live projects and placement support."
                  : "The same track runs at three depths. Pick the one that matches your timeline — the syllabus below is the three-month core, and longer formats add advanced modules, a live project and an internship."}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {trackPrograms.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="card-hover rounded-2xl border border-line bg-white p-5"
                  >
                    <p className="font-display text-lg font-bold tracking-tight">
                      {p.duration.label}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-brand-600">{p.duration.tier}</p>
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      {p.duration.hours} of classroom and lab time
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null
        }
      />

      <CourseEnquirySection course={course} />
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
