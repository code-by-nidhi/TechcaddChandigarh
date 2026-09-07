import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Eyebrow, Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Mission & Vision — ${site.name}`,
  description: `What ${site.name} is working towards: employable graduates, a current curriculum, and training that is affordable for the students who need it most.`,
  alternates: { canonical: `${site.url}/about/mission-vision` },
};

const pillars = [
  {
    icon: "target",
    title: "Our mission",
    paragraphs: [
      "To close the gap between what students are taught and what employers actually need — by teaching current tools in real labs, on real projects, with trainers who still practise what they teach.",
      "Every decision about a syllabus, a batch size or a new centre gets checked against one question: does this make our graduates more employable, or does it just make us bigger?",
    ],
  },
  {
    icon: "rocket",
    title: "Our vision",
    paragraphs: [
      "A tricity where a student from any background — any degree, any college, any family income — can reach a genuine technology career within a year, without leaving the region to do it.",
      "That means keeping training affordable, keeping the curriculum ahead of local hiring, and building enough employer trust that a techcadd portfolio is taken seriously on its own.",
    ],
  },
];

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

const impactTimeline = [
  {
    step: "01",
    title: "Industry-Relevant Training",
    body: "Every syllabus is checked against what companies are actually hiring for right now, not what was current when it was written.",
  },
  {
    step: "02",
    title: "Real Project Experience",
    body: "Assignments, live projects and industrial training that mirror how technology is applied in a real workplace.",
  },
  {
    step: "03",
    title: "Affordable Learning",
    body: "EMI options, no registration fee, and honest advice about the most affordable route that still gets you hired.",
  },
  {
    step: "04",
    title: "Career Preparation",
    body: "Career guidance, mock interviews and placement support that continue until you are placed, not until the course ends.",
  },
  {
    step: "05",
    title: "Continuous Improvement",
    body: "A curriculum that keeps moving with the industry, reviewed and updated as tools and hiring patterns change.",
  },
];

/** Angle-spaced around the centre node — top, then clockwise every 72°. */
const valuesEcosystem = [
  { icon: "target", label: "Employability", x: 50, y: 16 },
  { icon: "users", label: "Accessibility", x: 82.3, y: 39.5 },
  { icon: "shield", label: "Transparency", x: 70, y: 77.5 },
  { icon: "code", label: "Practical Learning", x: 30, y: 77.5 },
  { icon: "award", label: "Student Success", x: 17.7, y: 39.5 },
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

      {/* --------------------------------- Mission & vision --------------------------------- */}
      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <ul className="grid gap-6 lg:grid-cols-2">
            {pillars.map((pillar) => (
              <li
                key={pillar.title}
                className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 lg:p-8"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                  <Icon name={pillar.icon} className="size-6" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                  {pillar.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
                  {pillar.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Rail>
      </section>

      {/* ------------------------------- Four commitments ------------------------------- */}
      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Values"
            title="Four commitments we hold ourselves to"
            body="Written plainly, so you can hold us to them too."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-line bg-subtle p-7">
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

      {/* ---------------------------- Industry impact timeline ---------------------------- */}
      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Our impact"
            title="Industry Impact Timeline"
            body="How our commitments and teaching philosophy translate into a real learning journey."
          />

          <div className="relative mt-16">
            <span
              aria-hidden="true"
              className="absolute top-7 right-[10%] left-[10%] hidden border-t border-dashed border-line lg:block"
            />
            <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {impactTimeline.map((point) => (
                <li key={point.title} className="group lg:flex lg:flex-col lg:items-center lg:text-center">
                  <span className="grid size-14 place-items-center rounded-full border border-line bg-white font-display text-base font-bold tracking-tight text-brand-600 shadow-[0_12px_28px_-16px_rgba(15,23,42,0.55)] transition-all duration-300 group-hover:border-brand-600/40 group-hover:bg-brand-600 group-hover:text-white">
                    {point.step}
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold tracking-tight text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{point.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Rail>
      </section>

      {/* ------------------------------- Values ecosystem ------------------------------- */}
      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="How it all connects"
            title="The techcadd values ecosystem"
            body="Every commitment above feeds back into one another — none of them work in isolation."
          />

          {/* Circular diagram — desktop and tablet */}
          <div className="relative mx-auto mt-16 hidden aspect-square w-full max-w-xl md:block">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
              {valuesEcosystem.map((node) => (
                <line
                  key={node.label}
                  x1={50}
                  y1={50}
                  x2={node.x}
                  y2={node.y}
                  className="stroke-line"
                  strokeWidth={0.6}
                />
              ))}
            </svg>

            <div
              className="absolute grid place-items-center rounded-full bg-brand-600 p-6 text-center text-white shadow-[0_20px_45px_-20px_rgba(37,99,235,0.6)]"
              style={{ left: "50%", top: "50%", width: "34%", transform: "translate(-50%, -50%)" }}
            >
              <span className="font-display text-sm leading-tight font-bold tracking-tight sm:text-base">
                Techcadd Values
              </span>
            </div>

            {valuesEcosystem.map((node) => (
              <div
                key={node.label}
                className="absolute grid place-items-center gap-1.5 rounded-full border border-line bg-white p-4 text-center shadow-[0_12px_28px_-16px_rgba(15,23,42,0.35)]"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  width: "24%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Icon name={node.icon} className="size-5 text-brand-600" />
                <span className="text-xs leading-tight font-semibold text-ink sm:text-sm">
                  {node.label}
                </span>
              </div>
            ))}
          </div>

          {/* Stacked list — mobile */}
          <div className="mt-14 md:hidden">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand-600 text-center text-white">
              <span className="font-display text-[11px] leading-tight font-bold tracking-tight">
                Techcadd
                <br />
                Values
              </span>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {valuesEcosystem.map((node) => (
                <li
                  key={node.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 text-center"
                >
                  <Icon name={node.icon} className="size-5 text-brand-600" />
                  <span className="text-xs font-semibold text-ink">{node.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Rail>
      </section>

      {/* ----------------------------------- Transition ----------------------------------- */}
      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <div className="mx-auto max-w-[800px] overflow-hidden rounded-3xl border border-line bg-white text-center shadow-[0_30px_70px_-40px_rgba(15,23,42,0.4)]">
            <span
              aria-hidden="true"
              className="block h-1 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-400"
            />
            <div className="px-7 py-12 sm:px-12 lg:py-14">
              <Eyebrow>Where this is heading</Eyebrow>
              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-balance text-ink sm:text-3xl lg:text-4xl">
                From learning technology to creating technology.
              </h2>
              <div className="mx-auto mt-6 max-w-2xl space-y-4 text-left leading-relaxed text-muted">
                <p>
                  A tricity where a student from any background — any degree, any college, any
                  family income — can reach a genuine technology career within a year, without
                  leaving the region to do it.
                </p>
                <p>
                  That means keeping training affordable, keeping the curriculum ahead of local
                  hiring, and building enough employer trust that a techcadd portfolio is taken
                  seriously on its own.
                </p>
              </div>
            </div>
          </div>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
