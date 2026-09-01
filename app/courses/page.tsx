import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CourseCard } from "@/components/CourseCard";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail } from "@/components/ui";
import { courseCategories, courses, coursesByCategory } from "@/data/courses";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `All Courses in ${site.city} — IT, AI, Development & Marketing`,
  description: `Browse every course we run in ${site.city}: artificial intelligence, full-stack development, data science, cyber security, digital marketing, CAD and office skills. Each with syllabus, duration and fees.`,
  alternates: { canonical: `${site.url}/courses` },
};

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Courses" }]}
        eyebrow="Course catalogue"
        title={`Every course we run in ${site.city}`}
        body={`${courses.length} courses across ${courseCategories.length} tracks. Every one runs with supervised lab hours, a live project and placement support — what differs between them is the technology and the depth.`}
        meta={[
          { label: "Courses", value: String(courses.length) },
          { label: "Tracks", value: String(courseCategories.length) },
          { label: "Formats", value: "3, 6 & 9 months" },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          {/* Jump links — anchors rather than query params, so the page stays static */}
          <nav aria-label="Jump to a track" className="flex flex-wrap gap-2">
            {courseCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-brand-600/30 hover:text-brand-600"
              >
                <Icon name={category.icon} className="size-4" />
                {category.short}
                <span className="text-xs text-muted/70">{coursesByCategory(category.id).length}</span>
              </a>
            ))}
          </nav>

          <div className="mt-14 space-y-16">
            {courseCategories.map((category) => {
              const list = coursesByCategory(category.id);
              if (!list.length) return null;

              return (
                <div key={category.id} id={category.id} className="scroll-mt-24">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        <Icon name={category.icon} className="size-5" />
                      </span>
                      <div>
                        <h2 className="font-display text-xl font-bold tracking-tight">
                          {category.name}
                        </h2>
                        <p className="text-sm text-muted">
                          {list.length} course{list.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <p className="max-w-md text-sm text-muted">{category.blurb}</p>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 rounded-3xl border border-line bg-subtle p-8 lg:p-10">
            <h2 className="font-display text-xl font-bold tracking-tight">
              Still deciding between two tracks?
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Free counselling exists precisely for this. Tell us your background and the job you
              want, and we will tell you which of the two fits — including when the answer is
              neither.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/tools/career-track-finder"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Try the track finder
                <Icon name="arrow-right" className="size-4" />
              </Link>
              <Link
                href="/contact#enquire"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-medium transition-colors hover:border-brand-600/30"
              >
                Talk to a counsellor
              </Link>
            </div>
          </div>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
