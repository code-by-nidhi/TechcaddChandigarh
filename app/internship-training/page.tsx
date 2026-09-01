import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection, FaqSection } from "@/components/sections/Home";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ButtonLink, Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { trainingFormats } from "@/data/programs";
import { featuredCourses } from "@/data/courses";
import { faqs } from "@/data/content";

export const metadata: Metadata = {
  title: `Internship Program in ${site.city} — Live Client Work`,
  description: `A supervised internship on real client projects: sprint planning, code review, deployment and a written experience letter. Open to students and freshers in ${site.city}.`,
  alternates: { canonical: `${site.url}/internship-training` },
};

const weeks = [
  { label: "Week 1", title: "Onboarding", body: "Repository access, local environment, coding standards and your first small ticket. You commit code in the first week." },
  { label: "Weeks 2–4", title: "Feature work", body: "Real tickets from the backlog with a mentor reviewing every pull request. Expect changes requested — that is the point." },
  { label: "Weeks 5–8", title: "Ownership", body: "You own a feature end to end: design, build, test, review, deploy. Daily stand-ups and sprint reviews with the team." },
  { label: "Final weeks", title: "Handover", body: "Documentation, a demo to the client, and a written experience letter describing what you actually contributed." },
];

export default function InternshipPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Internship Program" }]}
        eyebrow="Internship"
        title="An internship on real client work"
        body="Not a certificate for attendance. You join a live project with a backlog, deadlines and code review, and you leave with a letter describing what you actually built."
        meta={[
          { label: "Duration", value: "2 – 6 months" },
          { label: "Mode", value: "On campus or hybrid" },
          { label: "Output", value: "Experience letter" },
        ]}
      >
        <ButtonLink href="/contact#enquire" variant="onDark" size="lg">
          Apply for an internship
          <Icon name="arrow-right" className="size-4" />
        </ButtonLink>
      </PageHeader>

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div className="space-y-14">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Why this is different
                </h2>
                <div className="mt-5 space-y-4 leading-relaxed text-muted">
                  <p>
                    Most internship certificates in this region are issued for showing up. Employers
                    know that, which is why they discount them almost entirely. Ours describes the
                    specific work you contributed, and it is issued only if you contributed.
                  </p>
                  <p>
                    You work inside a real repository with real branches, real review comments and a
                    real deployment pipeline. The first pull request usually comes back with a dozen
                    comments. By the end it comes back with one or two, and that trajectory is the
                    thing worth talking about in an interview.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  How the internship runs
                </h2>
                <ol className="mt-8 space-y-3">
                  {weeks.map((week) => (
                    <li key={week.label} className="rounded-2xl border border-line bg-white p-6">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">
                          {week.label}
                        </span>
                        <h3 className="font-display text-lg font-bold tracking-tight">
                          {week.title}
                        </h3>
                      </div>
                      <p className="mt-3 leading-relaxed text-muted">{week.body}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  What you leave with
                </h2>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "An internship experience letter describing your contribution",
                    "Merged pull requests on a real repository",
                    "A deployed feature you can demonstrate",
                    "A reference from the mentor who reviewed your work",
                    "Sprint and stand-up experience",
                    "A portfolio entry that survives scrutiny",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-line bg-subtle p-5"
                    >
                      <Icon name="check" className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Which track can I intern on?
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  Internships run on the tracks where we have live client work. Availability shifts
                  with the project pipeline, so ask when you enquire.
                </p>
                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                  {featuredCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/${course.id}-course-in-${site.citySlug}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4 text-sm font-medium transition-colors hover:border-brand-600/30 hover:bg-brand-50/40"
                    >
                      {course.name}
                      <Icon
                        name="arrow-right"
                        className="size-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Training formats that include an internship
                </h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {trainingFormats
                    .filter((f) => ["4 Months", "6 Months", "9 Months", "Internship"].includes(f.label))
                    .map((format) => (
                      <Link
                        key={format.slug}
                        href={`/${format.slug}`}
                        className="card-hover rounded-xl border border-line bg-white p-5"
                      >
                        <p className="font-display font-bold tracking-tight">{format.label}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted">
                          {format.audience}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-line bg-white p-7 shadow-xl shadow-hero-950/5">
                <h2 className="font-display text-lg font-bold tracking-tight">
                  Apply for an internship
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Tell us your track and availability. Places depend on the current project
                  pipeline.
                </p>
                <div className="mt-6">
                  <EnquiryForm compact />
                </div>
              </div>
            </aside>
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-20">
        <Rail>
          <SectionHeading
            align="center"
            title="Placement support runs alongside"
            body="CV review, portfolio polish, mock interviews and drives with our hiring partners — included, and continuing after your program ends."
          />
          <div className="mt-10 text-center">
            <ButtonLink href="/placement" variant="secondary">
              How placement works
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          </div>
        </Rail>
      </section>

      <FaqSection items={faqs.slice(0, 6)} />
      <CtaSection />
    </>
  );
}
