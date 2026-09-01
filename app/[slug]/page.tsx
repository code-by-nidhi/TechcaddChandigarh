import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CourseBody, courseHeaderMeta } from "@/components/CourseDetail";
import { CtaSection, FaqSection } from "@/components/sections/Home";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ButtonLink, Icon, Rail } from "@/components/ui";
import { allRootSlugs, resolveSlug, rupees } from "@/lib/routes";
import { site } from "@/data/site";
import { courseSlug } from "@/data/courses";
import { programsForTrack, trainingFormats } from "@/data/programs";
import { faqs } from "@/data/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return allRootSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveSlug(slug);
  if (!resolved) return {};

  const canonical = `${site.url}/${slug}`;

  switch (resolved.kind) {
    case "course": {
      const { course, variant } = resolved;
      const noun = variant === "training" ? "Training" : "Course";
      const title = `${course.name} ${noun} in ${site.city} — Syllabus, Duration & Fees`;
      return {
        title,
        description: `${course.summary} ${course.duration} at our ${site.city} centre, with live projects, an industry certificate and placement support.`,
        alternates: { canonical },
        openGraph: { title, description: course.summary, url: canonical },
      };
    }
    case "program": {
      const { program } = resolved;
      return {
        title: `${program.title} — Syllabus, Fees & Placement`,
        description: program.summary,
        alternates: { canonical },
      };
    }
    case "training-format": {
      const { format } = resolved;
      return {
        title: `${format.title} — Projects, Certificate & Placement`,
        description: format.summary,
        alternates: { canonical },
      };
    }
    case "after-12th": {
      const { entry } = resolved;
      return {
        title: `${entry.title} — ${entry.duration} Foundation-First Track`,
        description: entry.summary,
        alternates: { canonical },
      };
    }
  }
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = resolveSlug(slug);
  if (!resolved) notFound();

  /* ------------------------------- Course page ------------------------------- */
  if (resolved.kind === "course") {
    const { course, variant } = resolved;
    const noun = variant === "training" ? "Training" : "Course";
    const trackPrograms = programsForTrack(course.id).filter((p) => !p.after12th);

    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: `${course.name} ${noun} in ${site.city}`,
      description: course.summary,
      provider: {
        "@type": "EducationalOrganization",
        name: site.name,
        sameAs: site.url,
      },
      ...(course.fee
        ? {
            offers: {
              "@type": "Offer",
              price: course.fee.offer,
              priceCurrency: "INR",
              category: "Paid",
            },
          }
        : {}),
    };

    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: course.name },
          ]}
          eyebrow={`${noun} in ${site.city}`}
          title={`${course.name} ${noun} in ${site.city}`}
          body={course.summary}
          meta={courseHeaderMeta(course)}
        >
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/contact#enquire" variant="onDark" size="lg">
              Book a free demo
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
            <ButtonLink href="#syllabus" variant="onDarkGhost" size="lg">
              See syllabus
            </ButtonLink>
          </div>
        </PageHeader>

        <div id="syllabus" />

        <CourseBody
          course={course}
          extra={
            trackPrograms.length ? (
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Available as a certificate program
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  The same track runs at three depths. Pick the one that matches your timeline —
                  the syllabus below is the three-month core, and longer formats add advanced
                  modules, a live project and an internship.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {trackPrograms.map((program) => (
                    <Link
                      key={program.slug}
                      href={`/${program.slug}`}
                      className="card-hover rounded-2xl border border-line bg-white p-5"
                    >
                      <p className="font-display text-lg font-bold tracking-tight">
                        {program.duration.label}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-brand-600">
                        {program.duration.tier}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        {program.duration.hours} of classroom and lab time
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null
          }
        />

        <FaqSection items={faqs.slice(0, 6)} />
        <CtaSection />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </>
    );
  }

  /* ------------------------------- Program page ------------------------------- */
  if (resolved.kind === "program") {
    const { program } = resolved;
    const { duration } = program;

    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            {
              label: program.after12th ? "After 12th" : "Certificate Programs",
              href: program.after12th ? "/after-12th-courses" : "/certificate-programs",
            },
            { label: `${duration.label} ${program.track.name}` },
          ]}
          eyebrow={duration.tier}
          title={program.title}
          body={program.summary}
          meta={[
            { label: "Duration", value: duration.label },
            { label: "Contact hours", value: duration.hours },
            { label: "Award", value: duration.tier },
            { label: "Mode", value: "Classroom / online" },
          ]}
        >
          <ButtonLink href="/contact#enquire" variant="onDark" size="lg">
            Book a free demo
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        </PageHeader>

        <ProgramBody slug={slug} />

        <FaqSection items={faqs.slice(0, 6)} />
        <CtaSection />
      </>
    );
  }

  /* --------------------------- Training format page --------------------------- */
  if (resolved.kind === "training-format") {
    const { format } = resolved;
    const others = trainingFormats.filter((f) => f.slug !== format.slug);

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
      </>
    );
  }

  /* ------------------------------ After-12th page ------------------------------ */
  const { entry, course } = resolved;

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
    </>
  );
}

/* ------------------------- Program page body (shared) ------------------------- */

function ProgramBody({ slug }: { slug: string }) {
  const resolved = resolveSlug(slug);
  if (resolved?.kind !== "program") return null;
  const { program } = resolved;
  const { duration, track } = program;
  const course = resolveCourseForTrack(track.id);
  if (!course) return null;

  const siblings = programsForTrack(track.id).filter(
    (p) => p.after12th === program.after12th && p.slug !== program.slug,
  );

  return (
    <CourseBody
      course={course}
      duration={duration.label}
      syllabusTitle={`${duration.label} syllabus`}
      intro={
        <>
          <p>{program.summary}</p>
          <p>
            The {duration.label.toLowerCase()} format runs to roughly {duration.hours} of classroom
            and supervised lab time at our {site.city} centre, and leads to a{" "}
            {duration.tier.toLowerCase()}.
          </p>
        </>
      }
      extra={
        <>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              What the {duration.label.toLowerCase()} format includes
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {duration.includes.map((item) => (
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

          {siblings.length ? (
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Compare the other durations
              </h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {siblings.map((sibling) => (
                  <Link
                    key={sibling.slug}
                    href={`/${sibling.slug}`}
                    className="card-hover rounded-2xl border border-line bg-white p-5"
                  >
                    <p className="font-display text-lg font-bold tracking-tight">
                      {sibling.duration.label}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-brand-600">
                      {sibling.duration.tier} · {sibling.duration.hours}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      {sibling.duration.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </>
      }
    />
  );
}

function resolveCourseForTrack(trackId: string) {
  const slug = courseSlug(trackId);
  const resolved = resolveSlug(slug);
  return resolved?.kind === "course" ? resolved.course : null;
}
