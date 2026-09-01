import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection, TestimonialsSection } from "@/components/sections/Home";
import { Icon, Rail, SectionHeading, Stat } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Placement Support — How It Actually Works`,
  description: `CV review, portfolio polish, mock interviews, aptitude practice and drives with ${site.stats.partners} hiring partners. Support continues after your course until you are placed.`,
  alternates: { canonical: `${site.url}/placement` },
};

const stages = [
  {
    icon: "briefcase",
    title: "Portfolio and CV review",
    body: "Starts in the second half of your course, not at the end. We rewrite CVs that read like a list of technologies into ones that describe what you built and what happened as a result.",
  },
  {
    icon: "users",
    title: "Mock interviews",
    body: "Technical and HR rounds with trainers who conduct real interviews for client teams. You get recorded feedback on the answers that did not land.",
  },
  {
    icon: "target",
    title: "Aptitude and communication",
    body: "Practice for the screening tests that filter candidates before anyone reads a CV, plus communication coaching for students who freeze in the HR round.",
  },
  {
    icon: "award",
    title: "Placement drives",
    body: `On-campus drives with our ${site.stats.partners} hiring partners, quarterly at the head campus and open to students and alumni from every centre.`,
  },
];

const honest = [
  {
    q: "Do you guarantee a job?",
    a: "No, and be sceptical of anyone who does. What we guarantee is the support: reviews, mock interviews, drives and referrals, continuing after your course ends until you are placed.",
  },
  {
    q: "What decides whether a student gets placed?",
    a: "Consistently: attendance, project work and whether they can explain their own code. Students who complete the live project and turn up to mock interviews are placed at a much higher rate than those who skip both.",
  },
  {
    q: "How long does it usually take?",
    a: "Most students who finish the six-month format and participate in drives are placed within two to four months of completing. Longer for those changing field entirely, faster for those with a degree in a related area.",
  },
];

export default function PlacementPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Placement Support" }]}
        eyebrow="Placement"
        title="How placement support actually works"
        body="No guarantees, because nobody can honestly make one. What we do promise is that the support keeps running after your course ends, and that the people preparing you conduct real interviews for a living."
        meta={[
          { label: "Hiring partners", value: site.stats.partners },
          { label: "Placement rate", value: `${site.stats.placement} (2025 batches)` },
          { label: "Alumni", value: site.stats.alumni },
        ]}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="What is included"
            title="Four things, all included in your fee"
            body="None of this is an add-on package sold at the end of the course."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {stages.map((stage) => (
              <div key={stage.title} className="rounded-2xl border border-line bg-white p-7">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={stage.icon} className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
                  {stage.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{stage.body}</p>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      <section className="panel-surface py-16 text-white lg:py-24">
        <Rail>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <SectionHeading
              onDark
              eyebrow="Straight answers"
              title="The questions students are afraid to ask"
              body="Better to have this conversation before you enrol than after."
            />
            <dl className="space-y-4">
              {honest.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm"
                >
                  <dt className="font-display font-bold tracking-tight">{item.q}</dt>
                  <dd className="mt-2.5 leading-relaxed text-brand-100/75">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Rail>
      </section>

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value={site.stats.partners} label="Hiring partners" />
            <Stat value={site.stats.placement} label="Placement rate, 2025 batches" />
            <Stat value={site.stats.alumni} label="Alumni network" />
            <Stat value="Quarterly" label="On-campus drives" />
          </div>
        </Rail>
      </section>

      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
