import type { Metadata } from "next";
import Link from "next/link";
import { MediaFrame } from "@/components/MediaFrame";
import { ScrambleButton } from "@/components/ScrambleButton";
import { ButtonLink, Eyebrow as UiEyebrow, Icon, Rail, SectionHeading } from "@/components/ui";
import { CountUp, Parallax, Reveal } from "@/components/motion/Reveal";
import { RevealScope } from "@/components/motion/RevealScope";
import { Words, revealDelay } from "@/components/motion/Words";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `About ${site.name} — Building Careers, Creating Future-Ready Professionals`,
  description: `${site.name} turns skills into real-world opportunities through industry-focused training, practical projects and career mentorship — for learners who want a technology career, not just a certificate.`,
  alternates: { canonical: `${site.url}/about` },
};

/* ---------------------------------------------------------------------------
   Content
   --------------------------------------------------------------------------- */

const heroStats = [
  { label: "Courses", value: "50+" },
  { label: "Learners", value: "15K+" },
  { label: "Hiring Partners", value: "120+" },
  { label: "Student Satisfaction", value: "98%" },
];

/** Six pillars, laid out as hexagon vertices — top, then clockwise every 60°. */
const ecosystemPillars = [
  {
    icon: "layers",
    title: "Industry-Relevant Curriculum",
    body: "Every syllabus is checked against what companies are hiring for right now.",
    x: 50,
    y: 12,
  },
  {
    icon: "code",
    title: "Hands-On Projects",
    body: "Concepts are proven by building, not by memorising slides.",
    x: 82.9,
    y: 31,
  },
  {
    icon: "users",
    title: "Expert Mentorship",
    body: "Trainers who still ship production work guide every batch.",
    x: 82.9,
    y: 69,
  },
  {
    icon: "briefcase",
    title: "Internship Opportunities",
    body: "Real assignments with real deadlines, before the certificate.",
    x: 50,
    y: 88,
  },
  {
    icon: "target",
    title: "Career Preparation",
    body: "Resumes, mock interviews and portfolio reviews, built into the track.",
    x: 17.1,
    y: 69,
  },
  {
    icon: "award",
    title: "Placement Support",
    body: "Hiring partners and drives that continue until you are placed.",
    x: 17.1,
    y: 31,
  },
];

const missionPoints = ["Practical by design", "Priced for access", "Always current"];

const visionLines = [
  { text: "A confident learner today.", accent: false },
  { text: "A capable professional tomorrow.", accent: false },
  { text: "A stronger digital economy, together.", accent: true },
];

const journeySteps = [
  {
    step: "01",
    title: "Learn",
    body: "Structured lessons and live sessions build the fundamentals — the concepts, tools and reasoning every track is built on.",
  },
  {
    step: "02",
    title: "Practice",
    body: "Guided exercises and lab hours turn theory into muscle memory, with a trainer in the room to correct course early.",
  },
  {
    step: "03",
    title: "Build",
    body: "Live projects and industrial training replace toy examples — the kind of work you can actually describe in an interview.",
  },
  {
    step: "04",
    title: "Grow",
    body: "Career guidance, mock interviews and placement support carry that portfolio into an offer, not just a completion certificate.",
  },
];

const bentoItems = [
  {
    icon: "code",
    title: "Practical Training",
    body: "Every course runs on lab hours and live builds, not just lecture slides — so the skill is real before the certificate is.",
    span: "lg:col-span-2 lg:row-span-2",
    big: true,
  },
  {
    icon: "layers",
    title: "Real Projects",
    body: "Work that mirrors an actual client brief.",
    span: "",
  },
  {
    icon: "users",
    title: "Industry Mentors",
    body: "Guided by trainers who still practise the craft.",
    span: "",
  },
  {
    icon: "clock",
    title: "Flexible Learning",
    body: "Campus or online, weekday or weekend batches, without paying twice to switch.",
    span: "",
  },
  {
    icon: "briefcase",
    title: "Internship Opportunities",
    body: "Structured internship tracks with real deliverables.",
    span: "",
  },
  {
    icon: "target",
    title: "Placement Assistance",
    body: "Hiring drives, resume reviews and interview prep that continue until you are placed — not until the course ends.",
    span: "lg:col-span-2",
  },
  {
    icon: "award",
    title: "Recognised Certifications",
    body: "Credentials that hold up with recruiters.",
    span: "",
  },
  {
    icon: "compass",
    title: "Career Guidance",
    body: "Honest advice on the track that actually fits you.",
    span: "",
  },
];

const impactStats = [
  { value: "15K+", label: "Learners Trained" },
  { value: "50+", label: "Career-Oriented Courses" },
  { value: "120+", label: "Hiring Partners" },
  { value: "1000+", label: "Projects Built" },
];

const futureDomains = [
  { icon: "sparkles", label: "Artificial Intelligence" },
  { icon: "chart", label: "Data Science" },
  { icon: "shield", label: "Cyber Security" },
  { icon: "cloud", label: "Cloud Computing" },
  { icon: "code", label: "Full Stack Development" },
];

const ctaTrust = ["Free career counselling", "No registration fee", "Placement support included"];

/* ---------------------------------------------------------------------------
   Small shared pieces
   --------------------------------------------------------------------------- */

function CheckIcon() {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
      <Icon name="check" className="size-3.5" />
    </span>
  );
}

/** The dark decorative wash shared by the panel sections. */
function PanelGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="panel-dots absolute inset-0" />
      <div className="drift-slow absolute -top-1/3 -left-1/4 h-[140%] w-[70%] -rotate-12 bg-gradient-to-br from-brand-500/25 via-brand-600/10 to-transparent blur-[120px]" />
      <div className="drift-slow-reverse absolute -right-1/4 -bottom-1/3 h-[120%] w-[55%] -rotate-12 bg-gradient-to-tl from-accent-500/20 to-transparent blur-[120px]" />
      <div className="panel-noise absolute inset-0" />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Page
   --------------------------------------------------------------------------- */

export default function AboutPage() {
  return (
    <RevealScope>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="hero-surface relative isolate flex min-h-screen items-center overflow-hidden pt-32 pb-20 text-white lg:pt-40 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-hero-950/60 via-hero-800/10 to-hero-950/95"
        />
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute -top-40 -right-32 size-[42rem] rounded-full bg-accent-500/12 blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="drift-slow-reverse pointer-events-none absolute -bottom-40 -left-32 size-[36rem] rounded-full bg-brand-500/14 blur-[130px]"
        />
        <Rail className="relative">
          <span
            data-reveal
            className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-md"
          >
            About us
          </span>
          <h1
            data-reveal-words
            className="mt-7 max-w-4xl font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            <Words
              delay={120}
              segments={[
                { text: "Building Careers." },
                { text: "Creating Future-Ready Professionals.", className: "text-accent-400" },
              ]}
            />
          </h1>
          <p
            data-reveal
            style={revealDelay(3)}
            className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 lg:text-lg"
          >
            {site.shortName} helps learners transform skills into real-world opportunities through
            industry-focused training, practical projects and career mentorship.
          </p>

          <div data-reveal style={revealDelay(4)} className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href="/courses" variant="onDark" size="lg">
              Explore courses
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
            <ScrambleButton href="/contact#enquire" className="h-13 px-7 text-[15px]">
              Book free counselling
            </ScrambleButton>
          </div>

          <dl className="mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {heroStats.map((stat, i) => (
              <div
                key={stat.label}
                data-reveal
                style={revealDelay(i, 110)}
                className="relative flex flex-col-reverse pl-5"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-gradient-to-b from-accent-400 to-brand-600"
                />
                <dt className="mt-2 text-sm text-white/55">{stat.label}</dt>
                <dd className="font-display text-4xl leading-none font-bold tracking-tight lg:text-5xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Rail>

        <span
          aria-hidden="true"
          className="scroll-hint absolute bottom-10 left-1/2 hidden h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/50 to-transparent lg:block"
        />
      </section>

      {/* -------------------------------- Who we are -------------------------------- */}
      <section className="relative isolate overflow-hidden bg-subtle py-20 lg:py-28">
        <Rail>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <UiEyebrow>Who we are</UiEyebrow>
              <h2 className="mt-5 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
                More Than A Training Institute
              </h2>
              <Reveal className="mt-6 space-y-5 text-base leading-relaxed text-muted lg:text-[17px]">
                <p>
                  Most technology education stops at theory. {site.shortName} exists to close the
                  distance between what a classroom teaches and what a hiring manager actually
                  expects on day one — a gap that shows up quietly, in interviews learners are
                  otherwise qualified for.
                </p>
                <p>
                  That means practical learning over passive lectures, direct industry exposure
                  instead of secondhand descriptions of it, and a syllabus built from the modern
                  technologies companies are hiring for — reviewed and rebuilt as those companies
                  change their minds.
                </p>
                <p>
                  Every course ends the same way it should: with a project a learner built
                  themselves, and the outcome that project was meant to produce — a real,
                  defensible step into a technology career.
                </p>
              </Reveal>
              <div className="mt-9 grid grid-cols-3 gap-4 border-t border-line pt-7">
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-brand-600">
                    <CountUp value={`${new Date().getFullYear() - site.founded}+`} />
                  </p>
                  <p className="mt-1 text-xs text-muted">Years building careers</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-brand-600">
                    <CountUp value={site.stats.technologies} />
                  </p>
                  <p className="mt-1 text-xs text-muted">Technologies taught</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-brand-600">
                    <CountUp value={site.stats.placement} />
                  </p>
                  <p className="mt-1 text-xs text-muted">Placement rate</p>
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-7">
              <div
                aria-hidden="true"
                className="drift-slow pointer-events-none absolute -top-10 -right-10 size-64 rounded-full bg-brand-500/15 blur-[90px]"
              />
              <Parallax amount={-48} className="relative grid grid-cols-6 gap-4">
                <MediaFrame
                  reveal
                  caption={`The ${site.shortName} team with faculty at a partner college`}
                  icon="users"
                  className="col-span-6 aspect-[16/9] sm:col-span-4"
                />
                <MediaFrame
                  reveal
                  delay={120}
                  caption="Live project review during a lab session"
                  icon="code"
                  className="col-span-3 aspect-square sm:col-span-2 sm:row-span-2 sm:mt-10"
                />
                <MediaFrame
                  reveal
                  delay={240}
                  caption="A hiring drive on campus"
                  icon="briefcase"
                  className="col-span-3 aspect-square sm:col-span-2"
                />
                <MediaFrame
                  reveal
                  delay={320}
                  caption="Screen-side during the Agentic AI workshop"
                  icon="monitor"
                  className="col-span-6 aspect-[21/9] sm:col-span-4"
                />
              </Parallax>
            </div>
          </div>
        </Rail>
      </section>

      {/* ----------------------------- Learning ecosystem ----------------------------- */}
      <section className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
        <PanelGlow />
        <Rail className="relative">
          <SectionHeading
            align="center"
            onDark
            eyebrow="How it fits together"
            title="An Ecosystem Designed For Career Growth"
            body="Six parts that reinforce each other — none of them work in isolation, which is the point."
          />

          {/* Hexagon network — desktop and tablet */}
          <Reveal className="relative mx-auto mt-16 hidden aspect-square w-full max-w-2xl md:block">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id="eco-spoke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              {ecosystemPillars.map((node) => (
                <line
                  key={`spoke-${node.title}`}
                  x1={50}
                  y1={50}
                  x2={node.x}
                  y2={node.y}
                  stroke="url(#eco-spoke)"
                  strokeWidth={0.5}
                  strokeLinecap="round"
                />
              ))}
              {ecosystemPillars.map((node, i) => {
                const next = ecosystemPillars[(i + 1) % ecosystemPillars.length];
                return (
                  <line
                    key={`ring-${node.title}`}
                    x1={node.x}
                    y1={node.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="#38bdf8"
                    strokeWidth={0.35}
                    strokeOpacity={0.35}
                    className="neural-flow"
                    style={{ ["--flow-delay" as string]: `${i * 0.35}s` }}
                  />
                );
              })}
            </svg>

            <div
              className="absolute grid place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 p-6 text-center shadow-[0_30px_70px_-20px_rgba(34,211,238,0.55)] ring-4 ring-white/10"
              style={{ left: "50%", top: "50%", width: "26%", transform: "translate(-50%, -50%)" }}
            >
              <span className="font-display text-xs leading-tight font-bold tracking-tight sm:text-sm">
                Career Growth
              </span>
            </div>

            {ecosystemPillars.map((node) => (
              <div
                key={node.title}
                className="absolute grid place-items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] p-4 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.12]"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  width: "23%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Icon name={node.icon} className="size-5 text-accent-400" />
                <span className="text-[11px] leading-tight font-semibold sm:text-xs">
                  {node.title}
                </span>
              </div>
            ))}
          </Reveal>

          {/* Connected list — mobile */}
          <div className="relative mt-14 md:hidden">
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[19px] w-px bg-white/15"
            />
            <ol className="relative space-y-6">
              {ecosystemPillars.map((node, i) => (
                <li
                  key={node.title}
                  data-reveal
                  style={revealDelay(i, 70)}
                  className="relative flex gap-4 pl-0"
                >
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-hero-950 text-accent-400">
                    <Icon name={node.icon} className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold tracking-tight">{node.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{node.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Descriptions — every viewport */}
          <ul className="mt-16 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {ecosystemPillars.map((node, i) => (
              <li
                key={`desc-${node.title}`}
                data-reveal
                style={revealDelay(i, 70)}
                className="border-l-2 border-white/15 pl-4"
              >
                <h4 className="font-display text-sm font-bold tracking-tight text-white">
                  {node.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{node.body}</p>
              </li>
            ))}
          </ul>
        </Rail>
      </section>

      {/* ---------------------------------- Mission ---------------------------------- */}
      <section className="relative isolate overflow-hidden py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute top-1/4 -right-40 -z-10 size-[36rem] rounded-full bg-brand-500/8 blur-[130px]"
        />
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
            <div>
              <UiEyebrow>Our mission</UiEyebrow>
              <h2 className="mt-5 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
                Making Quality Tech Education Accessible
              </h2>
              <Reveal className="mt-6 space-y-5 text-base leading-relaxed text-muted lg:text-[17px]">
                <p>
                  A good career shouldn&rsquo;t depend on which college a learner could afford, or
                  which city they grew up in. Our mission is to make practical, industry-relevant
                  technology education available on those terms — priced for the students who need
                  it most, not the ones who can already afford to wait.
                </p>
                <p>
                  That means keeping fees honest, keeping the curriculum current enough to be worth
                  paying for, and building training around outcomes we can be held to — not
                  promises that sound good in a brochure.
                </p>
              </Reveal>
              <ul className="mt-8 flex flex-wrap gap-3">
                {missionPoints.map((point) => (
                  <li
                    key={point}
                    className="rounded-full border border-line bg-background px-4 py-2 text-xs font-semibold text-foreground"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* No `Reveal` wrapper: the two `CountUp`s below run their own
                ScrollTrigger, and nesting them inside a GSAP-animated parent
                has previously frozen the parent's fade mid-transition. */}
            <div
              data-reveal
              className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/70 p-8 shadow-[0_40px_80px_-40px_rgba(37,99,235,0.35)] backdrop-blur-xl lg:p-10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br from-brand-400/25 to-transparent blur-2xl"
              />
              <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_16px_30px_-12px_rgba(37,99,235,0.6)]">
                <Icon name="target" className="size-6" />
              </span>
              <p className="mt-7 font-display text-xl leading-snug font-bold tracking-tight text-balance text-ink lg:text-2xl">
                Practical, affordable and industry-relevant — so a learner&rsquo;s career depends on
                their effort, not their starting point.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6">
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-brand-600">
                    <CountUp value={site.stats.alumni} />
                  </p>
                  <p className="mt-1 text-xs text-muted">Learners reached</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-brand-600">
                    <CountUp value={site.stats.rating} />
                  </p>
                  <p className="mt-1 text-xs text-muted">Average rating</p>
                </div>
              </div>
            </div>
          </div>
        </Rail>
      </section>

      {/* ---------------------------------- Vision ---------------------------------- */}
      <section className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
        <PanelGlow />
        <Rail className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <UiEyebrow onDark>Our vision</UiEyebrow>
            <h2 className="mt-5 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Building India&rsquo;s Future Technology Workforce
            </h2>
            <Reveal className="mt-6 space-y-5 text-base leading-relaxed text-white/70 lg:text-lg">
              <p>
                India&rsquo;s digital economy is growing faster than the pipeline of people ready to
                run it. We want {site.shortName} learners to be the ones who close that gap — not
                by chasing every new technology trend, but by building the judgment to learn
                whichever one shows up next.
              </p>
              <p>
                That is the long-term measure we hold ourselves to: not how many students enrol,
                but how many become confident, capable contributors to the technology economy this
                country is building.
              </p>
            </Reveal>
          </div>

          <Reveal className="mx-auto mt-16 max-w-2xl lg:mt-20">
            {visionLines.map((line) => (
              <p
                key={line.text}
                className={`border-b border-white/10 py-4 text-center text-2xl leading-tight font-bold text-balance first:pt-0 last:border-0 last:pb-0 sm:text-3xl lg:text-4xl ${
                  line.accent ? "text-accent-400" : "text-white"
                }`}
              >
                {line.text}
              </p>
            ))}
          </Reveal>
        </Rail>
      </section>

      {/* -------------------------- Learn / Practice / Build / Grow -------------------------- */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="From classroom to career"
            title={
              <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                {journeySteps.map((step, i) => (
                  <span key={step.title} className="inline-flex items-center gap-3">
                    {i > 0 ? (
                      <Icon name="arrow-right" className="size-[0.7em] shrink-0 text-brand-600" />
                    ) : null}
                    {step.title}
                  </span>
                ))}
              </span>
            }
            body="Every format we run — live projects, industrial training, internships — moves through the same four stages."
          />

          <div className="relative mt-14 lg:mt-20">
            <span
              aria-hidden="true"
              className="absolute top-7 right-[12.5%] left-[12.5%] hidden border-t border-dashed border-line lg:block"
            />
            <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {journeySteps.map((step, i) => (
                <li
                  key={step.title}
                  data-reveal
                  style={revealDelay(i, 110)}
                  className="group lg:flex lg:flex-col lg:items-center lg:text-center"
                >
                  <span className="grid size-14 place-items-center rounded-full border border-line bg-background font-display text-base font-bold tracking-tight text-brand-600 shadow-[0_12px_28px_-16px_rgba(15,23,42,0.55)] transition-all duration-300 group-hover:border-brand-600/40 group-hover:bg-brand-600 group-hover:text-white">
                    {step.step}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Rail>
      </section>

      {/* --------------------------- Why students choose us (bento) --------------------------- */}
      <section className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
        <PanelGlow />
        <Rail className="relative">
          <SectionHeading
            align="center"
            onDark
            eyebrow="Why students choose us"
            title={`What makes ${site.shortName} different?`}
            body="Eight things that show up in every batch, not just the ones we advertise."
          />

          <ul className="mt-16 grid auto-rows-[minmax(160px,auto)] gap-4 lg:mt-20 lg:grid-cols-4">
            {bentoItems.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                style={revealDelay(i, 70)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.1] lg:p-7 ${item.span}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br from-accent-400/15 to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/10 text-accent-400">
                  <Icon name={item.icon} className={item.big ? "size-6" : "size-5"} />
                </span>
                <div className="mt-auto pt-6">
                  <h3
                    className={`font-display font-bold tracking-tight ${item.big ? "text-2xl lg:text-3xl" : "text-base"}`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-2 leading-relaxed text-white/65 ${item.big ? "max-w-sm text-[15px] lg:text-base" : "text-sm"}`}
                  >
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Rail>
      </section>

      {/* --------------------------------- Our impact --------------------------------- */}
      <section className="relative isolate overflow-hidden py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(37,99,235,0.07),transparent_70%)]"
        />
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Our impact"
            title="Numbers we can be held to"
            body="Not a claim on a poster — the same figures behind every other stat on this page."
          />

          {/* No `Reveal` wrapper: `CountUp` runs its own ScrollTrigger, and
              nesting it inside a GSAP-animated parent has previously frozen
              the parent's fade mid-transition (see mission-vision page). The
              counting numbers already give this grid its own entrance. */}
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:mt-20 lg:grid-cols-4 lg:gap-8">
            {impactStats.map((stat) => (
              <div key={stat.label} className="relative text-center">
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-3 hidden h-16 w-px -translate-y-1/2 bg-line lg:block last:lg:hidden"
                />
                <dd className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 bg-clip-text font-display text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                  <CountUp value={stat.value} />
                </dd>
                <dt className="mt-2 text-sm font-medium text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Rail>
      </section>

      {/* ----------------------------- Preparing for the future ----------------------------- */}
      <section className="relative isolate overflow-hidden bg-hero-950 py-20 text-white lg:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="panel-dots absolute inset-0 opacity-60" />
          <div className="drift-slow absolute top-0 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[150px]" />
        </div>
        <Rail className="relative">
          <SectionHeading
            align="center"
            onDark
            eyebrow="What's next"
            title="Preparing Learners For The Future Of Technology"
            body="Curriculum reviews aren't an annual event here — they're a response to what the industry is doing right now."
          />

          {/* No `Reveal` wrapper here: each chip already carries its own
              infinite `float-slow` CSS animation on `transform`, and having
              GSAP tween the same property from a scroll trigger occasionally
              left the whole list stuck at opacity 0 — the two animations
              fighting over one element. The chips are already below the
              fold, so a plain render loses little. */}
          <ul className="mt-14 flex flex-wrap items-center justify-center gap-3 lg:mt-16 lg:gap-4">
            {futureDomains.map((domain) => (
              <li
                key={domain.label}
                className="float-slow inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:border-accent-400/50 hover:bg-white/[0.1]"
              >
                <Icon name={domain.icon} className="size-4.5 text-accent-400" />
                <span className="text-sm font-semibold tracking-tight">{domain.label}</span>
              </li>
            ))}
          </ul>
        </Rail>
      </section>

      {/* ------------------------------------ CTA ------------------------------------ */}
      <section className="hero-surface relative isolate overflow-hidden py-20 text-white lg:py-28">
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute -top-32 right-0 size-[34rem] rounded-full bg-accent-500/14 blur-[140px]"
        />
        <Rail className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <UiEyebrow onDark className="mb-5">
              Ready when you are
            </UiEyebrow>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Start Building Your Tech Career Today
            </h2>
            <p className="mt-6 leading-relaxed text-white/70 lg:text-lg">
              Join thousands of learners who have transformed their careers through practical,
              industry-focused training.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/courses" variant="onDark" size="lg">
                Explore courses
                <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
              <ScrambleButton href="/contact#enquire" className="h-13 px-7 text-[15px]">
                Book free counselling
              </ScrambleButton>
            </div>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {ctaTrust.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-10 text-sm text-white/50">
              Prefer to talk first?{" "}
              <Link href={site.contact.phoneHref} className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {site.contact.phone}
              </Link>
            </p>
          </div>
        </Rail>
      </section>
    </RevealScope>
  );
}
