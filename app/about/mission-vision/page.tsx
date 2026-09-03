import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Eyebrow, Icon, Rail, SectionHeading } from "@/components/ui";
import { CountUp, Reveal } from "@/components/motion/Reveal";
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

/** The outcome of the mission stated in numbers — real site stats, not new claims. */
const workforceStages = [
  {
    icon: "code",
    title: "Learn on current tools",
    body: "Real labs, real projects, and trainers who still practise what they teach.",
    stat: site.stats.technologies,
    statLabel: "Technologies taught",
  },
  {
    icon: "layers",
    title: "Build a portfolio that speaks",
    body: "Live projects and industrial training that mirror how technology is applied in a real workplace.",
    stat: site.stats.alumni,
    statLabel: "Alumni who've done it",
  },
  {
    icon: "briefcase",
    title: "Step into a career, not just a certificate",
    body: "Career guidance, mock interviews and placement support that continue until you are placed.",
    stat: site.stats.placement,
    statLabel: "Placement rate",
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

      {/* --------------------------------- Mission & vision --------------------------------- */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute -top-24 -right-24 -z-10 size-[28rem] rounded-full bg-brand-400/15 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="drift-slow-reverse pointer-events-none absolute -bottom-32 -left-24 -z-10 size-[24rem] rounded-full bg-accent-400/10 blur-[110px]"
        />
        <Rail>
          <Reveal as="ul" stagger className="grid gap-6 lg:grid-cols-2">
            {pillars.map((pillar) => (
              <li
                key={pillar.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/70 p-8 shadow-[0_40px_80px_-40px_rgba(37,99,235,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_50px_90px_-35px_rgba(37,99,235,0.45)] lg:p-10"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br from-brand-400/25 to-transparent blur-2xl"
                />
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_16px_30px_-12px_rgba(37,99,235,0.6)]">
                  <Icon name={pillar.icon} className="size-6" />
                </span>
                <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
                  {pillar.title}
                </h2>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted">
                  {pillar.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </li>
            ))}
          </Reveal>
        </Rail>
      </section>

      {/* ------------------------------- Four commitments ------------------------------- */}
      <section className="relative py-20 lg:py-28">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Values"
            title="Four commitments we hold ourselves to"
            body="Written plainly, so you can hold us to them too."
          />
          <Reveal as="ul" stagger className="mt-16 grid gap-5 sm:grid-cols-2">
            {values.map((value) => (
              <li
                key={value.title}
                className="group rounded-[24px] border border-line bg-white p-7 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_30px_60px_-30px_rgba(37,99,235,0.3)] lg:p-8"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 transition-colors duration-300 group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white">
                  <Icon name={value.icon} className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink">
                  {value.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{value.body}</p>
              </li>
            ))}
          </Reveal>
        </Rail>
      </section>

      {/* ---------------------------- Industry impact journey ---------------------------- */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-brand-50/50 to-white py-20 lg:py-28">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Our impact"
            title="An interactive industry impact journey"
            body="How our commitments and teaching philosophy translate into a real learning journey."
          />

          <div className="relative mt-16">
            <span
              aria-hidden="true"
              className="absolute top-7 right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-brand-100 via-brand-400 to-accent-400 lg:block"
            />
            <Reveal as="ol" stagger className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {impactTimeline.map((point) => (
                <li
                  key={point.title}
                  className="group lg:flex lg:flex-col lg:items-center lg:text-center"
                >
                  <span className="grid size-14 place-items-center rounded-full border border-line bg-white font-display text-base font-bold tracking-tight text-brand-600 shadow-[0_16px_32px_-16px_rgba(37,99,235,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white">
                    {point.step}
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold tracking-tight text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{point.body}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </Rail>
      </section>

      {/* ------------------------------- Values ecosystem ------------------------------- */}
      <section className="relative isolate overflow-hidden py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(37,99,235,0.08),transparent_70%)]"
        />
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="How it all connects"
            title="A connected values network"
            body="Every commitment above feeds back into one another — none of them work in isolation."
          />

          {/* Circular diagram — desktop and tablet */}
          <Reveal className="relative mx-auto mt-16 hidden aspect-square w-full max-w-xl md:block">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
              <defs>
                <linearGradient id="mv-line" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand-400)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--color-brand-600)" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              {valuesEcosystem.map((node) => (
                <line
                  key={node.label}
                  x1={50}
                  y1={50}
                  x2={node.x}
                  y2={node.y}
                  stroke="url(#mv-line)"
                  strokeWidth={0.7}
                  strokeLinecap="round"
                />
              ))}
            </svg>

            <div
              className="absolute grid place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 p-6 text-center text-white shadow-[0_30px_60px_-20px_rgba(37,99,235,0.55)] ring-4 ring-brand-100"
              style={{ left: "50%", top: "50%", width: "34%", transform: "translate(-50%, -50%)" }}
            >
              <span className="font-display text-sm leading-tight font-bold tracking-tight sm:text-base">
                Techcadd Values
              </span>
            </div>

            {valuesEcosystem.map((node) => (
              <div
                key={node.label}
                className="absolute grid place-items-center gap-1.5 rounded-full border border-line bg-white/90 p-4 text-center shadow-[0_16px_36px_-18px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_20px_40px_-16px_rgba(37,99,235,0.4)]"
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
          </Reveal>

          {/* Stacked list — mobile */}
          <div className="mt-14 md:hidden">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-center text-white shadow-[0_20px_40px_-16px_rgba(37,99,235,0.5)]">
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

      {/* -------------------------- Future-ready workforce -------------------------- */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-brand-50/60 to-white py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="drift-slow-reverse pointer-events-none absolute top-0 right-1/4 -z-10 size-[26rem] rounded-full bg-brand-400/12 blur-[120px]"
        />
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="The outcome"
            title="A future-ready workforce, not just graduates"
            body="This is what “employability over enrolment” looks like when you measure it."
          />

          {/* No `Reveal` wrapper here on purpose: `CountUp` below runs its own
              ScrollTrigger, and nesting it inside Reveal's transform-animating
              parent made the two fight — the parent's tween would freeze
              mid-fade. The counting numbers already give this grid its own
              entrance moment. */}
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {workforceStages.map((stage, i) => (
              <div
                key={stage.title}
                className="group relative flex h-full flex-col items-center overflow-hidden rounded-[28px] border border-white/70 bg-white/70 p-8 text-center shadow-[0_30px_60px_-35px_rgba(37,99,235,0.3)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_75px_-30px_rgba(37,99,235,0.4)]"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgba(37,99,235,0.6)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-4 inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={stage.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{stage.body}</p>
                <p className="mt-6 font-display text-4xl font-extrabold tracking-tight text-brand-600">
                  <CountUp value={stage.stat} />
                </p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-muted uppercase">
                  {stage.statLabel}
                </p>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      {/* ----------------------------------- Transition ----------------------------------- */}
      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <Reveal className="mx-auto max-w-[800px] overflow-hidden rounded-[32px] border border-line bg-white text-center shadow-[0_40px_90px_-40px_rgba(37,99,235,0.35)]">
            <span
              aria-hidden="true"
              className="block h-1.5 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-400"
            />
            <div className="px-7 py-12 sm:px-12 lg:py-14">
              <Eyebrow>Where this is heading</Eyebrow>
              <h2 className="mt-5 bg-gradient-to-r from-brand-700 via-brand-600 to-accent-500 bg-clip-text font-display text-2xl font-bold tracking-tight text-balance text-transparent sm:text-3xl lg:text-4xl">
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
          </Reveal>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
