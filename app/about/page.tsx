import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection, ProcessSection, TestimonialsSection } from "@/components/sections/Home";
import { ButtonLink, Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { differences, techGroups } from "@/data/content";
import { branches } from "@/data/branches";

export const metadata: Metadata = {
  title: `About ${site.name} — IT & AI Training Since ${site.founded}`,
  description: `How ${site.name} teaches: small batches, trainers who still write production code, live client projects and placement support. Training students and professionals since ${site.founded}.`,
  alternates: { canonical: `${site.url}/about` },
};

export default function AboutPage() {
  const years = new Date().getFullYear() - site.founded;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About us"
        title="Two decades of turning students into engineers"
        body={`Since ${site.founded} we have taught the tools companies are hiring for right now. ${years} years, ${site.stats.alumni} alumni and ${site.stats.partners} hiring partners later, the format has barely changed: small batches, a trainer in the room, and a live project you can actually talk about in an interview.`}
        meta={[
          { label: "Founded", value: String(site.founded) },
          { label: "Alumni", value: site.stats.alumni },
          { label: "Hiring partners", value: site.stats.partners },
          { label: "Centres", value: String(branches.length) },
        ]}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <div className="space-y-6 leading-relaxed text-muted">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Why we exist
              </h2>
              <p>
                techcadd started because the gap between what colleges taught and what employers
                asked for had become impossible to ignore. Students were graduating with good marks
                and no idea how to open a terminal, use version control or explain their own final
                year project.
              </p>
              <p>
                Our answer was unglamorous and has not changed: teach the actual tools, in a lab,
                with someone experienced sitting next to you, on work that has a deadline and a
                client attached to it. Everything else — the certificates, the placement drives, the
                marketing — follows from that or is decoration.
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                How we keep the syllabus current
              </h2>
              <p>
                We read the job descriptions our students apply to. When a requirement appears often
                enough, it becomes a module — not a webinar or an add-on. That is how agentic AI,
                retrieval-augmented generation and MLOps entered the syllabus within months of
                becoming real hiring requirements, and how technologies quietly leave when hiring
                stops asking for them.
              </p>
              <p>
                Every technical trainer here works on client projects alongside teaching. It keeps
                them honest and it means the answer to &ldquo;how is this actually done in a
                company&rdquo; is a demonstration rather than a guess.
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                What we will tell you honestly
              </h2>
              <p>
                Counselling is free and there is no obligation to enrol. If a course is wrong for
                you — too advanced, too long for your timeline, or simply not aligned with the job
                you want — we will say so. A student who enrols in the wrong track and drops out
                costs us more than the fee we did not take.
              </p>
            </div>

            <aside className="space-y-4">
              {differences.map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-subtle p-6">
                  <h3 className="font-display font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.body}</p>
                  {item.stat ? (
                    <p className="mt-4 text-xs font-semibold text-brand-600">{item.stat}</p>
                  ) : null}
                </div>
              ))}
            </aside>
          </div>
        </Rail>
      </section>

      <ProcessSection />

      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="Our centres"
            title={`${branches.length} campuses across the tricity`}
            body="Every centre runs the same syllabus and the same assessments. What differs is the specialisation each one has built up around the companies nearby."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <Link
                key={branch.slug}
                href={`/branches/${branch.slug}`}
                className="card-hover rounded-2xl border border-line bg-white p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold tracking-tight">{branch.name}</h3>
                  {branch.isHead ? (
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                      Head campus
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted">{branch.locality}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{branch.blurb}</p>
                <p className="mt-5 text-xs font-semibold text-brand-600">{branch.labs}</p>
              </Link>
            ))}
          </div>
        </Rail>
      </section>

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <SectionHeading
              eyebrow="What we teach"
              title={`${site.stats.technologies} technologies across nine disciplines`}
              body="The full list changes every quarter. This is what is in the labs today."
            />
            <div className="grid gap-8 sm:grid-cols-2">
              {techGroups.map((group) => (
                <div key={group.name}>
                  <h3 className="font-display text-sm font-bold tracking-tight">{group.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {group.items.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
            <ButtonLink href="/about/founder">
              Meet the founder
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/about/mission-vision" variant="secondary">
              Mission &amp; vision
            </ButtonLink>
            <ButtonLink href="/college-partnerships" variant="secondary">
              College partnerships
            </ButtonLink>
          </div>
        </Rail>
      </section>

      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
