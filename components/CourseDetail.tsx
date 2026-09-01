import Link from "next/link";
import type { ReactNode } from "react";
import { getCategory, courseSlug, type Course, type CourseModule } from "@/data/courses";
import { site } from "@/data/site";
import { includedItems } from "@/data/content";
import { relatedCourses, rupees } from "@/lib/routes";
import { CourseCard } from "./CourseCard";
import { EnquiryForm } from "./EnquiryForm";
import { Badge, ButtonLink, Icon, Rail, SectionHeading, badgeTone } from "./ui";

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

/* ------------------------------- Full page body ------------------------------- */

export function CourseBody({
  course,
  duration,
  intro,
  extra,
  syllabusTitle,
}: {
  course: Course;
  duration?: string;
  intro?: ReactNode;
  extra?: ReactNode;
  syllabusTitle?: string;
}) {
  const category = getCategory(course.category);
  const related = relatedCourses(course);

  return (
    <>
      <section className="py-16 lg:py-20">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
            <div className="min-w-0 space-y-16">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  About this course
                </h2>
                <div className="mt-5 space-y-4 leading-relaxed text-muted">
                  {intro ?? (
                    <>
                      <p>{course.summary}</p>
                      <p>
                        This is a {course.level.toLowerCase()} track running over{" "}
                        {duration ?? course.duration} at our {site.city} centre. Batches are small
                        enough that a trainer can sit with you when something does not compile, and
                        every module ends with lab work rather than a quiz.
                      </p>
                      <p>
                        You finish with a portfolio you built yourself, an industry certificate, and
                        — on the six-month and nine-month formats — an internship letter for real
                        client work.
                      </p>
                    </>
                  )}
                </div>

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
              </div>

              {extra}

              <Syllabus modules={course.modules} title={syllabusTitle} />

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
                  Placement support includes CV and portfolio review, mock interviews and drives
                  with our {site.stats.partners} hiring partners. It continues after your course
                  finishes, until you are placed.
                </p>
              </div>

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
            </div>

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
          </div>
        </Rail>
      </section>

      {/* Enquiry */}
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
