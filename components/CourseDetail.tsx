import Link from "next/link";
import type { ReactNode } from "react";
import { getCategory, courseSlug, type Course, type CourseModule } from "@/data/courses";
import { site } from "@/data/site";
import { includedItems } from "@/data/content";
import { relatedCourses, rupees } from "@/lib/routes";
import { CourseCard } from "./CourseCard";
import { CourseFaqSection } from "./CourseFaqSection";
import { EnquiryForm } from "./EnquiryForm";
import { SyllabusLadderSection } from "./SyllabusLadderSection";
import {
  Badge,
  ButtonLink,
  cx,
  Icon,
  joinNatural,
  Rail,
  SectionHeading,
  badgeTone,
  variantIndex,
} from "./ui";
import {
  OverviewNetworkGraphic,
  IndustryTrainingSection,
  ToolchainPanel,
  CertificationSection,
  EligibilitySection,
  CaseForCourse,
  IndustryLeadersSection,
  ProjectsSection,
  WorkingLoopSection,
  HowItIsBuiltSection,
  CareerFaqSection,
  WhyTechcaddSection,
  ComparisonTable,
  CourseTestimonials,
  GetStartedStrip,
} from "./CourseDetailExtras";

/* ------------------------------- Syllabus list ------------------------------- */

export function Syllabus({ modules, title = "Syllabus" }: { modules: CourseModule[]; title?: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      <ol className="mt-8 space-y-3">
        {modules.map((module, i) => (
          <li key={module.title} className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-sm font-bold text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-lg font-bold tracking-tight">{module.title}</h3>
            </div>
            <ul className="mt-4 grid gap-2 pl-9 sm:grid-cols-2">
              {module.topics.map((topic) => (
                <li key={topic} className="flex items-start gap-2 text-sm text-muted">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  {topic}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* --------------------------------- Sidebar --------------------------------- */

export function EnrolCard({ course, duration }: { course: Course; duration?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-7 shadow-xl shadow-hero-950/5">
      {course.fee ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Course fee</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold tracking-tight">
              {rupees(course.fee.offer)}
            </span>
            <span className="text-lg text-muted line-through">{rupees(course.fee.original)}</span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-emerald-600">
            Save {rupees(course.fee.original - course.fee.offer)} · EMI available
          </p>
        </>
      ) : (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Course fee</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight">
            Ask for current pricing
          </p>
          <p className="mt-1.5 text-sm text-muted">Fees vary by duration and batch format.</p>
        </>
      )}

      <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
        <Row label="Duration" value={duration ?? course.duration} />
        <Row label="Level" value={course.level} />
        <Row label="Mode" value="Classroom or online" />
        <Row label="Batches" value="Morning, evening & weekend" />
        <Row label="Certificate" value="Industry certificate" />
      </dl>

      <div className="mt-7 grid gap-2.5">
        <ButtonLink href="/contact#enquire" size="lg">
          Book a free demo
          <Icon name="arrow-right" className="size-4" />
        </ButtonLink>
        <a
          href={site.contact.phoneHref}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line text-sm font-medium transition-colors hover:border-brand-600/30 hover:bg-brand-50"
        >
          <Icon name="phone" className="size-4" />
          {site.contact.phone}
        </a>
      </div>

      <p className="mt-5 text-center text-xs text-muted">
        Free counselling · No registration fee
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

/* ------------------------------- Course overview copy ------------------------------- */

/**
 * Builds the SEO-rich middle paragraph of "Course overview" from the course's
 * own modules and tools, so every one of the 44 course pages gets a genuinely
 * technical, keyword-dense paragraph without hand-writing 44 of them — and it
 * can never drift out of sync with the real curriculum data. The connecting
 * phrases rotate per course so 44 pages don't all read as one template with
 * the nouns swapped.
 */
function courseCurriculumArc(course: Course): ReactNode {
  const modules = course.modules;
  const first = modules[0];
  const rest = modules.slice(1);
  const firstTopics = first ? joinNatural(first.topics.slice(0, 2)).toLowerCase() : null;
  const laterTopics = rest.flatMap((m) => m.topics).slice(0, 5);
  const tools = course.tools.slice(0, 6);
  const v = variantIndex(course.id, 3);

  const openers = [
    <>The early stretch covers {firstTopics}, so nothing later depends on guesswork. </>,
    <>Weeks one and two are spent on {firstTopics}, before anything else gets layered on. </>,
    <>You start with {firstTopics} — the part most self-taught learners skip and later regret. </>,
  ];
  const bridges = [
    <>From there you move through {joinNatural(laterTopics).toLowerCase()}, in the order a working project actually needs them. </>,
    <>The programme then builds through {joinNatural(laterTopics).toLowerCase()}, each stage assuming the last one stuck. </>,
    <>Next comes {joinNatural(laterTopics).toLowerCase()}, taught in the sequence a real brief would demand them. </>,
  ];
  const toolTails = [
    ", the same tools used on live client work rather than a classroom-only sandbox.",
    ", the exact stack our trainers use on paid client projects, not a simplified teaching version.",
    ", chosen because employers around " + site.city + " actually ask for them by name.",
  ];

  return (
    <p>
      {firstTopics ? openers[v] : null}
      {laterTopics.length ? bridges[v] : null}
      {tools.length ? (
        <>
          Along the way you work hands-on in{" "}
          {tools.map((tool, i) => (
            <span key={tool}>
              {i > 0 ? (i === tools.length - 1 ? " and " : ", ") : ""}
              <strong>{tool}</strong>
            </span>
          ))}
          {toolTails[v]}
        </>
      ) : null}
    </p>
  );
}

function defaultCourseOverview(course: Course, duration?: string): ReactNode {
  const careers = joinNatural(course.careers.slice(0, 3));
  const v = variantIndex(course.id, 3);
  const closers = [
    <>
      Sessions are hands-on: you attempt real work under a trainer&rsquo;s eye and fix what does
      not land the same week. Batches stay small enough for that, running{" "}
      {duration ?? course.duration} at our {site.city} centre.
    </>,
    <>
      Every session is practical rather than lecture-first — you build, a trainer reviews it, and
      you correct it before the next class. The full track runs {duration ?? course.duration} out
      of our {site.city} centre, in batches small enough for that kind of attention.
    </>,
    <>
      Nothing here is watch-only: each session ends with work a trainer has actually looked at, not
      a recorded video you can skip. The programme runs {duration ?? course.duration} at our{" "}
      {site.city} centre, in small batches by design.
    </>,
  ];
  return (
    <>
      <p>{course.summary}</p>
      {courseCurriculumArc(course)}
      <p>
        {closers[v]} Each module ends in something you have built and a trainer has reviewed, so
        you finish with a portfolio, an industry certificate and — on the six-month and nine-month
        formats — an internship letter, aimed at {careers} roles.
      </p>
    </>
  );
}

/* ------------------------------- Full page body ------------------------------- */

export function CourseBody({
  course,
  duration,
  intro,
  extra,
  syllabusTitle,
  showExtras,
}: {
  course: Course;
  duration?: string;
  intro?: ReactNode;
  extra?: ReactNode;
  syllabusTitle?: string;
  /** Renders the full course-page template (stats, eligibility, projects,
   * staged syllabus, comparison table, etc.) — only for plain course pages,
   * not the program/training-format/after-12th variants that share this
   * same body. */
  showExtras?: boolean;
}) {
  const category = getCategory(course.category);
  const related = relatedCourses(course);

  const outcomesBlock = (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">
        What you will be able to do
      </h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {course.outcomes.map((outcome) => (
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
  );

  const careersBlock = (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">
        Roles this prepares you for
      </h2>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {course.careers.map((role) => (
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
        Placement support includes CV and portfolio review, mock interviews and drives with our{" "}
        {site.stats.partners} hiring partners. It continues after your course finishes, until you
        are placed.
      </p>
    </div>
  );

  const includedBlock = (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">
        Included in this program
      </h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {includedItems.map((item) => (
          <li key={item.title} className="rounded-xl border border-line bg-subtle p-5">
            <p className="font-display text-sm font-bold tracking-tight">{item.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <section className="py-16 lg:py-20">
        <Rail>
          <div
            className={cx(
              "grid gap-12",
              showExtras ? "" : "lg:grid-cols-[1.7fr_1fr] lg:gap-16",
            )}
          >
            <div className="min-w-0 space-y-16">
              <div className={cx(showExtras ? "mx-auto max-w-3xl" : "")}>
                <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-wide text-muted uppercase">
                  Overview
                </span>
                <h2 className="mt-6 flex items-center gap-3 font-display text-2xl font-bold tracking-tight">
                  Course overview
                  <span
                    aria-hidden="true"
                    className="inline-block size-6 shrink-0 rounded-full border-2 border-brand-500"
                  />
                </h2>
                <div className="mt-5 max-w-3xl space-y-4 text-justify leading-relaxed text-muted">
                  {intro ?? defaultCourseOverview(course, duration)}
                </div>

                {showExtras ? null : (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {course.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-lg border border-line bg-subtle px-3 py-1.5 text-sm font-medium text-muted"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}

                {showExtras ? (
                  <div className="mt-10">
                    <OverviewNetworkGraphic />
                  </div>
                ) : null}
              </div>

              {extra}

              {showExtras ? null : (
                <Syllabus modules={course.modules} title={syllabusTitle} />
              )}
              {showExtras ? null : outcomesBlock}
              {showExtras ? null : careersBlock}
              {showExtras ? null : includedBlock}
            </div>

            {showExtras ? null : (
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <EnrolCard course={course} duration={duration} />

                <div className="mt-6 rounded-2xl border border-line bg-subtle p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Track
                  </p>
                  <Link
                    href={`/courses#${category.id}`}
                    className="mt-3 flex items-center gap-3 text-sm font-medium transition-colors hover:text-brand-600"
                  >
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white text-brand-600">
                      <Icon name={category.icon} className="size-4" />
                    </span>
                    {category.name}
                  </Link>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{category.blurb}</p>
                </div>
              </aside>
            )}
          </div>
        </Rail>
      </section>

      {showExtras ? (
        <>
          <section className="bg-subtle py-20 lg:py-28">
            <Rail>
              <IndustryTrainingSection course={course} />
            </Rail>
          </section>

          <section className="hero-surface py-20 lg:py-28">
            <Rail>
              <EligibilitySection course={course} />
            </Rail>
          </section>

          <section className="bg-[#F7F8FC] py-20 lg:py-28">
            <Rail>
              <CaseForCourse course={course} />
            </Rail>
          </section>

          <section className="hero-surface py-20 lg:py-28">
            <Rail>
              <IndustryLeadersSection course={course} />
            </Rail>
          </section>

          <section className="bg-subtle py-20 lg:py-28">
            <Rail>
              <WorkingLoopSection course={course} />
            </Rail>
          </section>

          <section className="py-20 lg:py-28">
            <Rail>
              <ToolchainPanel course={course} />
            </Rail>
          </section>

          <section className="hero-surface py-20 lg:py-28">
            <Rail>
              <CertificationSection course={course} />
            </Rail>
          </section>

          <section className="bg-subtle py-20 lg:py-28">
            <Rail className="space-y-16">
              {outcomesBlock}
              {careersBlock}
            </Rail>
          </section>

          <section className="py-20 lg:py-28">
            <Rail>
              <CareerFaqSection course={course} />
            </Rail>
          </section>

          <section className="hero-surface py-20 lg:py-28">
            <Rail>
              <ProjectsSection course={course} />
            </Rail>
          </section>

          <section className="py-20 lg:py-28">
            <Rail>{includedBlock}</Rail>
          </section>

          <section className="hero-surface py-20 lg:py-28">
            <Rail>
              <WhyTechcaddSection />
            </Rail>
          </section>

          <section className="py-20 lg:py-28">
            <Rail>
              <ComparisonTable course={course} />
            </Rail>
          </section>

          <section className="py-20 lg:py-28">
            <Rail>
              <CourseTestimonials course={course} />
            </Rail>
          </section>

          <section className="hero-surface py-20 lg:py-28">
            <Rail>
              <CourseFaqSection course={course} duration={duration} />
            </Rail>
          </section>

          <section className="py-20 lg:py-28">
            <Rail>
              <HowItIsBuiltSection course={course} />
            </Rail>
          </section>

          <section className="hero-surface py-20 lg:py-28">
            <Rail>
              <SyllabusLadderSection course={course} />
            </Rail>
          </section>

          <section className="py-20 lg:py-28">
            <Rail>
              <GetStartedStrip course={course} />
            </Rail>
          </section>
        </>
      ) : null}

      {/* Related */}
      {related.length ? (
        <section className="py-16 lg:py-20">
          <Rail>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                title="Related courses"
                body={`Other courses in the ${category.short} track.`}
              />
              <ButtonLink href="/courses" variant="secondary">
                All courses
                <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <CourseCard key={item.id} course={item} />
              ))}
            </div>
          </Rail>
        </section>
      ) : null}

      {/* Enquiry — course-template pages render their own CourseEnquirySection instead, right before the footer */}
      {showExtras ? null : (
        <section className="bg-subtle py-16 lg:py-20">
          <Rail>
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
              <SectionHeading
                eyebrow="Enquire"
                title={`Talk to a counsellor about ${course.name}`}
                body="Tell us your background and what you want to do next. We will tell you honestly whether this course is the right fit — and which duration suits your timeline."
              />
              <div className="rounded-2xl border border-line bg-white p-7 lg:p-8">
                <EnquiryForm />
              </div>
            </div>
          </Rail>
        </section>
      )}
    </>
  );
}

/* --------------------------- Header meta for courses --------------------------- */

export function courseHeaderMeta(course: Course, duration?: string) {
  return [
    { label: "Duration", value: duration ?? course.duration },
    { label: "Level", value: course.level },
    { label: "Mode", value: "Classroom / online" },
    ...(course.fee ? [{ label: "Fee", value: rupees(course.fee.offer) }] : []),
  ];
}

export function CourseBadgeRow({ course }: { course: Course }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {course.badge ? <Badge tone={badgeTone(course.badge)}>{course.badge}</Badge> : null}
      <Link
        href={`/${courseSlug(course.id)}`}
        className="text-xs font-medium text-brand-200 hover:text-white"
      >
        {getCategory(course.category).short}
      </Link>
    </div>
  );
}
