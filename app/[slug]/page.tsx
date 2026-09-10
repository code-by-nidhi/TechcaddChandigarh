import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CourseTemplate } from "@/components/CourseTemplate";
import { CourseBody } from "@/components/CourseDetail";
import { CtaSection, FaqSection } from "@/components/sections/Home";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ButtonLink, Icon, Rail } from "@/components/ui";
import { allRootSlugs, resolveSlug, rupees } from "@/lib/routes";
import { site } from "@/data/site";
import { courseSlug } from "@/data/courses";
import { findCourse, getCourses } from "@/lib/catalogue";
import { trainingFormats } from "@/data/programs";
import { faqs } from "@/data/content";
import { courseSchema, faqPageSchema } from "@/lib/schema";

export const dynamicParams = false;

export async function generateStaticParams() {
  // Built from the resolved catalogue, so a course added in the CMS gets its
  // course page — and its training page, if it has one — without a code change.
  return allRootSlugs(await getCourses()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveSlug(slug, await getCourses());
  if (!resolved) return {};

  const canonical = `${site.url}/${slug}`;

  switch (resolved.kind) {
    case "course": {
      const { course, variant } = resolved;
      const noun = variant === "training" ? "Training" : "Course";
      const title = `${course.name} ${noun} in ${site.city} — Syllabus, Duration & Fees`;
      const description = `${course.summary} ${course.duration} at our ${site.city} centre, with live projects, an industry certificate and placement support.`;
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description: course.summary, url: canonical },
        twitter: { card: "summary_large_image", title, description: course.summary },
      };
    }
    case "program": {
      const { program } = resolved;
      const title = `${program.title} — Syllabus, Fees & Placement`;
      return {
        title,
        description: program.summary,
        alternates: { canonical },
        openGraph: { title, description: program.summary, url: canonical },
        twitter: { card: "summary_large_image", title, description: program.summary },
      };
    }
    case "training-format": {
      const { format } = resolved;
      const title = `${format.title} — Projects, Certificate & Placement`;
      return {
        title,
        description: format.summary,
        alternates: { canonical },
        openGraph: { title, description: format.summary, url: canonical },
        twitter: { card: "summary_large_image", title, description: format.summary },
      };
    }
    case "after-12th": {
      const { entry } = resolved;
      const title = `${entry.title} — ${entry.duration} Foundation-First Track`;
      return {
        title,
        description: entry.summary,
        alternates: { canonical },
        openGraph: { title, description: entry.summary, url: canonical },
        twitter: { card: "summary_large_image", title, description: entry.summary },
      };
    }
  }
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = resolveSlug(slug, await getCourses());
  if (!resolved) notFound();

  /* ------------------------------- Course page ------------------------------- */
  if (resolved.kind === "course") {
    const { course, variant } = resolved;
    return <CourseTemplate course={course} slug={slug} variant={variant} />;
  }

  /* ------------------------------- Program page ------------------------------- */
  // Certificate Program pages render through the exact same CourseTemplate as
  // course pages — `program.track.id` matches a real Course id, so the whole
  // page (overview, highlights, tools, certification, curriculum, compare,
  // FAQ, enquiry form) is identical; only the hero title/duration/badge and
  // breadcrumb reflect the program specifically.
  if (resolved.kind === "program") {
    const { program } = resolved;
    const course = findCourse(await getCourses(), program.track.id);
    if (!course) notFound();

    return <CourseTemplate course={course} slug={slug} program={program} />;
  }

  /* --------------------------- Training format page --------------------------- */
  if (resolved.kind === "training-format") {
    const { format } = resolved;
    const others = trainingFormats.filter((f) => f.slug !== format.slug);
    const schema = courseSchema({
      name: format.title,
      description: format.summary,
      url: `${site.url}/${slug}`,
    });
    const faqSchema = faqPageSchema(faqs.slice(0, 6));

    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Industrial Training", href: `/industrial-training-in-${site.citySlug}` },
            { label: format.label },
          ]}
          eyebrow="Industrial training"
          title={format.title}
          body={format.summary}
          meta={[
            { label: "Format", value: format.label },
            { label: "For", value: format.audience.split(",")[0] },
            { label: "Certificate", value: "University accepted" },
          ]}
        >
          <ButtonLink href="/contact#enquire" variant="onDark" size="lg">
            Reserve a seat
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        </PageHeader>

        <section className="py-16 lg:py-20">
          <Rail>
            <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
              <div className="space-y-14">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    Who this is for
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted">{format.audience}.</p>
                  <p className="mt-4 leading-relaxed text-muted">{format.summary}</p>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    What is included
                  </h2>
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {format.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 rounded-xl border border-line bg-white p-5"
                      >
                        <Icon name="check" className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    Choose your technology
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted">
                    Every training format runs across all our tracks. Pick the technology first,
                    then the duration.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {[
                      "full-stack-development",
                      "artificial-intelligence",
                      "data-analytics",
                      "python",
                      "digital-marketing",
                      "cyber-security",
                      "cloud-computing",
                      "flutter-app-development",
                    ].map((id) => (
                      <Link
                        key={id}
                        href={`/${courseSlug(id)}`}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4 text-sm font-medium transition-colors hover:border-brand-600/30 hover:bg-brand-50/40"
                      >
                        {id
                          .split("-")
                          .map((w) => w[0].toUpperCase() + w.slice(1))
                          .join(" ")}
                        <Icon
                          name="arrow-right"
                          className="size-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600"
                        />
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">Other formats</h2>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {others.map((other) => (
                      <Link
                        key={other.slug}
                        href={`/${other.slug}`}
                        className="card-hover rounded-xl border border-line bg-white p-5"
                      >
                        <p className="font-display font-bold tracking-tight">{other.label}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted">
                          {other.audience}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl border border-line bg-white p-7 shadow-xl shadow-hero-950/5">
                  <h2 className="font-display text-lg font-bold tracking-tight">
                    Reserve your seat
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    Batches fill before every semester break.
                  </p>
                  <div className="mt-6">
                    <EnquiryForm compact />
                  </div>
                </div>
              </aside>
            </div>
          </Rail>
        </section>

        <FaqSection items={faqs.slice(0, 6)} />
        <CtaSection />
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

  /* ------------------------------ After-12th page ------------------------------ */
  const { entry, course } = resolved;
  const afterCourseSchema = courseSchema({
    name: entry.title,
    description: entry.summary,
    url: `${site.url}/${slug}`,
    priceInr: course.fee?.offer,
  });
  const afterFaqSchema = faqPageSchema(faqs.slice(0, 6));

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "After 12th", href: "/after-12th-courses" },
          { label: course.name },
        ]}
        eyebrow="After 12th"
        title={entry.title}
        body={entry.summary}
        meta={[
          { label: "Duration", value: entry.duration },
          { label: "Prerequisites", value: "None" },
          { label: "Mode", value: "Classroom / online" },
          ...(course.fee ? [{ label: "Fee from", value: rupees(course.fee.offer) }] : []),
        ]}
      >
        <ButtonLink href="/contact#enquire" variant="onDark" size="lg">
          Book a free demo
          <Icon name="arrow-right" className="size-4" />
        </ButtonLink>
      </PageHeader>

      <CourseBody
        course={course}
        duration={entry.duration}
        syllabusTitle="Syllabus after foundations"
        intro={
          <>
            <p>{entry.summary}</p>
            <p>
              School leavers usually arrive with no programming background at all, so this track
              opens with three to four weeks of foundations — computer fundamentals, problem
              solving and the basics of writing code — before the professional syllabus starts.
            </p>
            <p>
              You can take this alongside a degree or as a full-time track. Many students use it as
              the year between school and their first job, and finish with a portfolio that gets
              them hired directly.
            </p>
          </>
        }
        extra={
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Foundation modules first
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Computer fundamentals and file management",
                "Problem solving and logic building",
                "Programming basics in Python",
                "Version control with Git and GitHub",
                "Communication and technical writing",
                "Study habits for self-directed learning",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-line bg-subtle p-5"
                >
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-brand-600" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <FaqSection items={faqs.slice(0, 6)} />
      <CtaSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(afterCourseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(afterFaqSchema) }}
      />
    </>
  );
}

