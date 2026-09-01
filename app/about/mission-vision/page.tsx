import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Mission & Vision — ${site.name}`,
  description: `What ${site.name} is working towards: employable graduates, a current curriculum, and training that is affordable for the students who need it most.`,
  alternates: { canonical: `${site.url}/about/mission-vision` },
};

const values = [
  {
    icon: "target",
    title: "Employability over enrolment",
    body: "We measure ourselves on how many students are working six months after finishing, not on how many signed up. Those two numbers pull in different directions more often than the industry admits.",
  },
  {
    icon: "sparkles",
    title: "Current, verifiably",
    body: "Any student can ask a trainer what they shipped last month and get a specific answer. A curriculum that cannot survive that question is out of date.",
  },
  {
    icon: "users",
    title: "Accessible pricing",
    body: "Most of our students are paying from a family budget that feels the cost. EMI options, no registration fee, and honest advice about the cheapest route that gets you hired.",
  },
  {
    icon: "shield",
    title: "No inflated promises",
    body: "We do not guarantee placement, because nobody honestly can. We guarantee the support — drives, reviews, mock interviews — and we keep providing it until you are placed.",
  },
];

export default function MissionVisionPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Mission & Vision" },
        ]}
        eyebrow="Mission & vision"
        title="What we are actually trying to build"
        body="Not the largest training network in the region — the one whose graduates are most obviously employable. Those are different goals and they occasionally conflict."
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-line bg-subtle p-9 lg:p-12">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <Icon name="target" className="size-6" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">Our mission</h2>
              <p className="mt-4 leading-relaxed text-muted">
                To close the gap between what students are taught and what employers actually need —
                by teaching current tools in real labs, on real projects, with trainers who still
                practise what they teach.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Every decision about a syllabus, a batch size or a new centre gets checked against
                one question: does this make our graduates more employable, or does it just make us
                bigger?
              </p>
            </div>

            <div className="hero-surface rounded-3xl p-9 text-white lg:p-12">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/12">
                <Icon name="rocket" className="size-6" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">Our vision</h2>
              <p className="mt-4 leading-relaxed text-brand-100/80">
                A tricity where a student from any background — any degree, any college, any family
                income — can reach a genuine technology career within a year, without leaving the
                region to do it.
              </p>
              <p className="mt-4 leading-relaxed text-brand-100/80">
                That means keeping training affordable, keeping the curriculum ahead of local
                hiring, and building enough employer trust that a techcadd portfolio is taken
                seriously on its own.
              </p>
            </div>
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Values"
            title="Four commitments we hold ourselves to"
            body="Written plainly, so you can hold us to them too."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-line bg-white p-7">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={value.icon} className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{value.body}</p>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
