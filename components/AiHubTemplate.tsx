import Link from "next/link";
import { Breadcrumbs, ButtonLink, Icon, Rail } from "@/components/ui";
import { HeroReveal } from "@/components/motion/Reveal";
import { CourseHeroIllustration } from "@/components/CourseHeroIllustration";
import { CourseCard } from "@/components/CourseCard";
import { CourseEnquirySection } from "@/components/CourseEnquirySection";
import {
  CourseOverview,
  IndustryTrainingSection,
  EligibilitySection,
  CaseForCourse,
  IndustryLeadersSection,
  ToolchainPanel,
  CertificationSection,
  CareerFaqSection,
  WhyTechcaddSection,
  ComparisonTable,
  CourseTestimonials,
  GetStartedStrip,
} from "@/components/CourseDetailExtras";
import { CourseFaqSection } from "@/components/CourseFaqSection";
import { site } from "@/data/site";
import { includedItems } from "@/data/content";
import { getCourse, type Course } from "@/data/courses";

const FEATURE_CHIPS = [
  "Live client projects",
  "Practitioner trainers",
  "Placement support",
  "Certificate + internship",
];

/**
 * Builds a real (non-fabricated) stand-in `Course` for a hub page: every
 * field is aggregated from the real courses it lists — no invented
 * curriculum, tools or careers. `modules` stays empty on purpose, since a
 * collection of courses has no single syllabus; every section below that
 * would need one (staged syllabus, projects, "how it's built") is left out
 * of this template rather than fed fake module data.
 */
function buildHubCourse(
  id: string,
  name: string,
  summary: string,
  courseIds: string[],
  heroImage?: string,
): Course {
  const list = courseIds.map((cid) => getCourse(cid)).filter((c): c is Course => Boolean(c));
  const tools = Array.from(new Set(list.flatMap((c) => c.tools)));
  const careers = Array.from(new Set(list.flatMap((c) => c.careers)));
  const outcomes = Array.from(new Set(list.flatMap((c) => c.outcomes))).slice(0, 8);

  return {
    id,
    name,
    category: "ai",
    duration: "Varies by course",
    level: "Beginner to Advanced",
    summary,
    heroImage,
    tools,
    modules: [],
    outcomes,
    careers,
  };
}

export function AiHubTemplate({
  slug,
  eyebrow,
  title,
  summary,
  breadcrumbLabel,
  courseIds,
  heroImage,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  breadcrumbLabel: string;
  courseIds: string[];
  heroImage?: string;
}) {
  const hub = buildHubCourse(slug, title, summary, courseIds, heroImage);
  const listedCourses = courseIds
    .map((id) => getCourse(id))
    .filter((c): c is Course => Boolean(c));

  return (
    <>
      {/* --------------------------------------- Hero --------------------------------------- */}
      <section className="hero-surface relative isolate overflow-hidden pt-24 pb-16 text-white lg:pt-28 lg:pb-20">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.12]"
        >
          <defs>
            <pattern id="ai-hub-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ai-hub-grid)" />
        </svg>

        <HeroReveal className="rail relative">
          <div data-hero-item>
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: breadcrumbLabel }]}
              onDark
            />
          </div>

          <div data-hero-item className="mt-8 flex flex-wrap items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-brand-600 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)]">
              <Icon name="sparkles" className="size-5" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-semibold text-amber-300">
              <Icon name="sparkles" className="size-3.5" />
              {eyebrow}
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10">
            <div>
              <h1
                data-hero-item
                className="mt-6 max-w-2xl font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              >
                {title}
              </h1>
              <p
                data-hero-item
                className="mt-6 max-w-xl leading-relaxed text-pretty text-brand-100/85 lg:text-lg"
              >
                {summary}
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
              <CourseHeroIllustration course={hub} />
            </div>
          </div>

          <div
            data-hero-item
            className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4"
          >
            {[
              { label: "Programmes", value: `${listedCourses.length} courses` },
              { label: "Mode", value: "Classroom, Weekend & 1-on-1" },
              { label: "Eligibility", value: "12th Pass Onward" },
              { label: "Includes", value: "Certificate + Placement Support" },
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

      {/* ------------------------------------- Overview ------------------------------------- */}
      <section className="py-16 lg:py-20">
        <Rail>
          <CourseOverview
            course={hub}
            showExtras
            intro={
              <>
                <p>{summary}</p>
                <p>
                  Every one of these {listedCourses.length} programmes runs with supervised lab
                  hours, a live client project and placement support — what differs between them
                  is the technology and the depth. Pick the one closest to where you already are,
                  or talk to a counsellor if you are not sure which to start with.
                </p>
              </>
            }
          />
        </Rail>
      </section>

      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <IndustryTrainingSection course={hub} />
        </Rail>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <Rail>
          <EligibilitySection course={hub} />
        </Rail>
      </section>

      <section className="bg-[#F7F8FC] py-20 lg:py-28">
        <Rail>
          <CaseForCourse course={hub} />
        </Rail>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <Rail>
          <IndustryLeadersSection course={hub} />
        </Rail>
      </section>

      {/* ----------------------------- The programmes themselves ---------------------------- */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold tracking-wide text-brand-600 uppercase">
              Featured programmes
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {listedCourses.length} courses inside this collection
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Every card below opens that course's own page — full syllabus, tools, fees and
              certification.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Rail>
      </section>

      <section className="py-20 lg:py-28">
        <Rail>
          <ToolchainPanel course={hub} />
        </Rail>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <Rail>
          <CertificationSection course={hub} />
        </Rail>
      </section>

      <section className="bg-subtle py-20 lg:py-28">
        <Rail className="space-y-16">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              What you will be able to do
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {hub.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-3 rounded-xl border border-line bg-white p-5"
                >
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span className="text-sm leading-relaxed">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Roles this prepares you for
            </h2>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {hub.careers.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium"
                >
                  <Icon name="briefcase" className="size-4 text-brand-600" />
                  {role}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Placement support includes CV and portfolio review, mock interviews and drives with
              our {site.stats.partners} hiring partners. It continues after your course finishes,
              until you are placed.
            </p>
          </div>
        </Rail>
      </section>

      <section className="py-20 lg:py-28">
        <Rail>
          <CareerFaqSection course={hub} />
        </Rail>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <Rail>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              Included in this program
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {includedItems.map((item) => (
                <li key={item.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="font-display text-sm font-bold tracking-tight text-white">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Rail>
      </section>

      <section className="py-20 lg:py-28">
        <Rail>
          <WhyTechcaddSection />
        </Rail>
      </section>

      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <ComparisonTable course={hub} />
        </Rail>
      </section>

      <section className="py-20 lg:py-28">
        <Rail>
          <CourseTestimonials course={hub} />
        </Rail>
      </section>

      <section className="hero-surface py-20 lg:py-28">
        <Rail>
          <CourseFaqSection course={hub} />
        </Rail>
      </section>

      <section className="py-20 lg:py-28">
        <Rail>
          <GetStartedStrip course={hub} />
        </Rail>
      </section>

      <CourseEnquirySection course={hub} />

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">All AI courses</h2>
              <p className="mt-3 max-w-xl text-muted">
                Browse the full AI &amp; Data track, or talk to a counsellor about which one fits.
              </p>
            </div>
            <ButtonLink href="/courses#ai" variant="secondary">
              All courses
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          </div>
        </Rail>
      </section>
    </>
  );
}
