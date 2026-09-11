import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getCategory, type Course, type CourseModule } from "@/data/courses";
import { site } from "@/data/site";
import { includedItems, PLACEMENT_ITEMS, type Testimonial } from "@/data/content";
import { getReviews } from "@/lib/cms";
import { BuildStagesPanel } from "./BuildStagesPanel";
import { EmptyState } from "./EmptyState";
import { Icon, SectionHeading, ButtonLink, cx, joinNatural, variantIndex } from "./ui";

/* ------------------------------ Overview network ------------------------------ */

const NETWORK_NODES = [
  { x: 16, y: 30 },
  { x: 16, y: 70 },
  { x: 60, y: 15 },
  { x: 60, y: 50 },
  { x: 60, y: 85 },
  { x: 110, y: 25 },
  { x: 110, y: 50 },
  { x: 110, y: 75 },
  { x: 160, y: 40 },
  { x: 160, y: 65 },
];

const NETWORK_EDGES: [number, number][] = [
  [0, 2], [0, 3], [1, 3], [1, 4],
  [2, 5], [2, 6], [3, 5], [3, 6], [3, 7], [4, 6], [4, 7],
  [5, 8], [6, 8], [6, 9], [7, 9],
];

/**
 * A decorative "neural network" graphic — plain SVG, no external image asset —
 * doubling as a teaser link out to the real techcadd YouTube channel. There's
 * no per-course video to embed honestly, so this links out rather than faking
 * a play-in-place player.
 */
export function OverviewNetworkGraphic() {
  return (
    <a
      href={site.social.youtube}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative isolate flex aspect-[2/1] w-full items-center justify-center overflow-hidden rounded-[24px] bg-[#050810]"
    >
      <svg viewBox="0 0 200 100" className="size-full" aria-hidden="true">
        <defs>
          <linearGradient id="network-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#F97066" />
          </linearGradient>
        </defs>
        {NETWORK_EDGES.map(([a, b], i) => {
          const from = NETWORK_NODES[a];
          const to = NETWORK_NODES[b];
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#network-line)"
              strokeWidth={0.3}
              strokeOpacity={0.6}
            />
          );
        })}
        {NETWORK_NODES.map((node, i) => (
          <circle key={i} cx={node.x} cy={node.y} r={i % 3 === 0 ? 1.8 : 1.2} fill="#e5e7eb" />
        ))}
      </svg>

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20"
      />
      <span className="absolute inline-flex size-16 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110 lg:size-20">
        <svg viewBox="0 0 24 24" className="ml-1 size-6 text-hero-950 lg:size-7" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7-11-7Z" />
        </svg>
      </span>
      <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        Watch on YouTube
      </span>
    </a>
  );
}

/**
 * The "Course overview" block every course page opens with — badge, heading
 * with its decorative ring, intro copy, then either a tool-tag cloud (plain
 * course pages) or the network graphic (the fuller `showExtras` layout, also
 * used by pages that aren't a single real course, like the AI hub pages).
 * `CourseBody` and every non-course template call this exact function rather
 * than each keeping their own copy, so the wrapper/max-width/spacing can
 * never drift between them.
 */
export function CourseOverview({
  course,
  intro,
  showExtras,
}: {
  course: Course;
  intro: ReactNode;
  showExtras?: boolean;
}) {
  return (
    <div>
      <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-wide text-muted uppercase">
        Overview
      </span>
      <h2 className="mt-6 flex items-center gap-3 font-display text-3xl font-bold tracking-tight lg:text-4xl">
        Course overview
        <span
          aria-hidden="true"
          className="inline-block size-7 shrink-0 rounded-full border-2 border-brand-500"
        />
      </h2>
      <div className="mt-5 space-y-4 text-justify text-base leading-relaxed text-muted lg:text-lg">
        {intro}
      </div>

      {showExtras ? null : (
        <div className="mt-8 flex flex-wrap gap-2">
          {course.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-lg border border-line bg-subtle px-3 py-1.5 text-sm font-medium text-muted"
            >
              {tool}
            </span>
          ))}
        </div>
      )}

      {showExtras ? (
        <div className="mt-10">
          <OverviewNetworkGraphic />
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------ Industry training ------------------------------ */

const WHAT_YOU_GET = [
  "100% practical, project-based learning",
  "AI tools integrated into every module",
  "Live client projects under trainer supervision",
  "Internship letter and placement support",
  "Small batches with daily doubt clearing",
];

export function IndustryTrainingSection({ course }: { course: Course }) {
  const category = getCategory(course.category);
  const stats = [
    { value: site.stats.alumni, label: "Students" },
    { value: `${site.stats.rating}★`, label: "Google rating" },
    { value: String(site.founded), label: "Estd." },
    { value: "100%", label: "Practical" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[24px] bg-gradient-to-br from-[#050B1D] via-[#081B3A] to-[#0F2E6D] p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_20%,rgba(0,212,255,0.25),transparent_70%)]"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#1E88FF] to-[#00D4FF] opacity-40 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/3 left-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#1E88FF] to-[#00D4FF] shadow-[0_20px_45px_-15px_rgba(0,212,255,0.6)]"
        >
          <Icon name={category.icon} className="size-9 text-white" />
        </span>

        <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
          <Icon name="sparkles" className="size-3.5" />
          AI-Powered Curriculum
        </span>
        <h3 className="relative mt-3 font-display text-xl leading-snug font-bold tracking-tight text-white">
          Industry-Ready Training in {course.name}
        </h3>
        <Link
          href="/contact#enquire"
          className="relative mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/20"
        >
          Get Started
          <Icon name="arrow-right" className="size-4" />
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-[20px] border border-line bg-white p-6">
          <p className="text-xs font-bold tracking-widest text-brand-600 uppercase">
            What you get
          </p>
          <ul className="mt-4 space-y-3">
            {WHAT_YOU_GET.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grow grid-cols-2 gap-x-6 gap-y-5 rounded-[20px] bg-gradient-to-br from-[#1E88FF] to-[#00D4FF] p-6 text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl font-extrabold tracking-tight">{s.value}</p>
              <p className="text-xs font-medium tracking-wide text-white/80 uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Certification ------------------------------- */

const SPARKLE_POSITIONS = [
  { top: "4%", left: "8%", delay: "0s" },
  { top: "12%", left: "88%", delay: "0.6s" },
  { top: "80%", left: "14%", delay: "1.1s" },
  { top: "88%", left: "82%", delay: "0.3s" },
];

function CertificateMockup({
  kind,
  variant,
}: {
  kind: "Project Excellence" | "Course Completion";
  variant: "back" | "front";
}) {
  const isFront = variant === "front";
  return (
    <div className={cx("absolute", isFront ? "top-10 left-10 z-10" : "top-0 left-0")}>
      <div className="float-slow" style={{ animationDelay: isFront ? "0.4s" : "0s" }}>
        <div
          className={cx(
            "w-64 rounded-xl border border-[#00D4FF]/20 bg-[#fbf8f0] p-1.5 text-center transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isFront
              ? "rotate-[4deg] shadow-[0_35px_70px_-15px_rgba(0,0,0,0.55),0_0_35px_-8px_rgba(0,212,255,0.4)] group-hover:translate-x-[25px] group-hover:rotate-[8deg] group-hover:shadow-[0_45px_90px_-15px_rgba(0,0,0,0.6),0_0_55px_-5px_rgba(0,212,255,0.65)]"
              : "rotate-[-6deg] shadow-[0_25px_50px_-15px_rgba(0,0,0,0.45),0_0_25px_-8px_rgba(0,212,255,0.3)] group-hover:-translate-x-[20px] group-hover:rotate-[-10deg] group-hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.5),0_0_45px_-5px_rgba(0,212,255,0.55)]",
          )}
        >
          <div className="rounded-lg border border-hero-950/10 p-5">
            <p className="font-display text-sm font-bold tracking-tight text-hero-950">
              techcadd
            </p>
            <p className="mt-0.5 text-[8px] tracking-[0.2em] text-muted uppercase">
              Computer Education
            </p>
            <p className="mt-4 font-display text-lg font-extrabold tracking-wide text-hero-950">
              CERTIFICATE
            </p>
            <p className="text-[11px] text-brand-600 italic">of {kind}</p>
            <p className="mt-4 text-[9px] tracking-widest text-muted uppercase">
              This is to certify that
            </p>
            <p className="mt-1 font-display text-sm text-ink italic">Student Name</p>
            <span className="mx-auto mt-4 grid size-7 place-items-center rounded-full bg-amber-400 text-[10px] font-bold text-hero-950">
              ★
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificationSection({ course }: { course: Course }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
      <div>
        <div className="flex items-center gap-3">
          {course.heroImage ? (
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 p-1.5">
              <Image
                src={course.heroImage}
                alt=""
                width={40}
                height={40}
                className="size-full object-contain"
              />
            </span>
          ) : null}
          <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-white/80 uppercase">
            Certification
          </span>
        </div>
        <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance text-white lg:text-4xl">
          Get Certified in {course.name}
        </h2>
        <p className="mt-4 max-w-lg leading-relaxed text-white/65">
          Complete the course with a portfolio of live projects and receive an
          industry-recognised certificate, plus a documented internship letter.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {includedItems.slice(0, 4).map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-white/10 bg-white/[0.06] p-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">
                  <Icon name="check" className="size-3.5" />
                </span>
                <p className="font-display text-sm font-bold tracking-tight text-white">
                  {item.title}
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/55">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="group relative mx-auto h-72 w-full max-w-sm cursor-default">
        {/* animated glow beneath the certificates */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D4FF]/25 opacity-60 blur-3xl transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:size-64 group-hover:opacity-100"
        />

        {/* sparkle particles */}
        {SPARKLE_POSITIONS.map((s, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="twinkle pointer-events-none absolute size-1.5 rounded-full bg-white opacity-0 shadow-[0_0_8px_2px_rgba(0,212,255,0.8)] transition-opacity duration-500 group-hover:opacity-100"
            style={{ top: s.top, left: s.left, ["--twinkle-delay" as string]: s.delay }}
          />
        ))}

        <CertificateMockup kind="Project Excellence" variant="back" />
        <CertificateMockup kind="Course Completion" variant="front" />
      </div>
    </div>
  );
}

/* ------------------------------ Stats strip ------------------------------ */

export function CourseStatsStrip() {
  const stats = [
    { value: site.stats.alumni, label: "Students trained" },
    { value: `${site.stats.rating}★`, label: "Google rating" },
    { value: String(site.founded), label: "Training since" },
    { value: "100%", label: "Practical, project-based" },
  ];
  return (
    <div className="relative isolate overflow-hidden rounded-[24px] bg-gradient-to-br from-[#050B1D] via-[#081B3A] to-[#0F2E6D] p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_15%_10%,rgba(30,136,255,0.25),transparent_70%),radial-gradient(50%_70%_at_90%_90%,rgba(0,212,255,0.18),transparent_70%)]"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-2xl font-extrabold tracking-tight text-[#00D4FF]">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium text-white/65">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Toolchain -------------------------------- */

export function ToolchainPanel({ course }: { course: Course }) {
  const tools = course.tools.slice(0, 8);
  const radius = 38;

  return (
    <div className="relative isolate overflow-hidden rounded-[24px] bg-gradient-to-br from-[#050B1D] via-[#081B3A] to-[#0F2E6D] p-7 lg:p-9">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_85%_15%,rgba(0,212,255,0.2),transparent_70%)]"
      />

      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
          One course. A mesh of real tools.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          Everything below is installed on the lab machines and used on live client work, not
          shown once in a slide and forgotten.
        </p>
      </div>

      <div className="relative mx-auto mt-12 hidden aspect-square w-full max-w-lg md:block">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#1E88FF] to-[#00D4FF] text-center shadow-[0_30px_70px_-20px_rgba(0,212,255,0.6)]"
        >
          <span className="font-display text-sm font-bold text-white">{course.name}</span>
        </span>
        {tools.map((tool, i) => {
          const angle = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          return (
            <span
              key={tool}
              className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center gap-1.5 rounded-2xl border border-[#00D4FF]/25 bg-white px-4 py-3 text-center shadow-[0_16px_36px_-16px_rgba(0,0,0,0.5)]"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <Icon name="code" className="size-4 text-brand-600" />
              <span className="text-xs font-semibold text-ink whitespace-nowrap">{tool}</span>
            </span>
          );
        })}
      </div>

      {/* Stacked list — mobile */}
      <div className="mt-8 flex flex-wrap justify-center gap-2.5 md:hidden">
        {course.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-lg border border-[#00D4FF]/25 bg-white/5 px-3.5 py-2 text-sm font-medium text-[#00D4FF]"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Eligibility -------------------------------- */

const PERSONAS: { icon: string; title: string; body: (name: string) => string }[] = [
  {
    icon: "graduation-cap",
    title: "Students after 12th",
    body: (name) =>
      `Join from any stream. You start ${name} from fundamentals with no assumed knowledge, and most students run it alongside a degree using the weekday or weekend batch.`,
  },
  {
    icon: "award",
    title: "Graduates & final-year students",
    body: (name) =>
      `If you are finishing a degree, ${name} is a short route from graduation to a job application with something to show. Enter placement season with project work in hand instead of a blank CV.`,
  },
  {
    icon: "briefcase",
    title: "Working professionals",
    body: () =>
      "The weekend and evening batches exist for people already earning. Career switchers typically become interview-ready within five to six months without leaving their current job.",
  },
  {
    icon: "target",
    title: "Business owners & freelancers",
    body: (name) =>
      `Owners take ${name} to stop outsourcing work they cannot judge for themselves. Freelancers take it to bill clients beyond ${site.city}, since a remote skill is not limited by location.`,
  },
  {
    icon: "refresh",
    title: "Career restarters",
    body: () =>
      "A gap on the CV counts for less than work you can point at. The course starts at zero and finishes with a portfolio and a documented internship letter — what an interviewer actually asks about after a break.",
  },
  {
    icon: "sparkles",
    title: "Self-taught learners",
    body: () =>
      "If free videos left you with notes but nothing finished, what changes here is a trainer who reviews what you built this week, and a deadline attached to every module.",
  },
];

export function EligibilitySection({ course }: { course: Course }) {
  return (
    <div>
      <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 uppercase">
        Eligibility
      </span>
      <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance text-white lg:text-4xl">
        Who can do this course
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-white/65">
        {course.name} is built for people at several different starting points, and the batch is
        deliberately mixed. What matters more than your background is turning up consistently and
        finishing what each module asks you to build.
      </p>
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((persona, i) => (
          <li
            key={persona.title}
            className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-400/15 font-display text-xs font-bold text-amber-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-base font-bold tracking-tight text-white">
              {persona.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              {persona.body(course.name)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------ The case for it ------------------------------ */

export function CaseForCourse({ course }: { course: Course }) {
  const feature = {
    icon: "clock",
    label: "Access",
    title: "Timings that fit your week",
    body: [
      `Students reach our ${site.city} centre from across the tricity, with weekend learners travelling in from Mohali, Panchkula, Zirakpur and Kharar. Nobody schedules a course around a commute they can't make twice a week, which is why weekday, evening, weekend and 1-on-1 slots all run in parallel rather than a single fixed batch.`,
      `Whether you've just finished 12th, are still completing a degree, or are switching out of an unrelated job, ${course.name} starts from zero. Every class runs a full two hours so a topic gets finished, not rushed, in the time you actually have.`,
    ],
  };

  const stacked = [
    {
      icon: "target",
      label: "Demand",
      title: "Real local demand",
      body: `${course.name} sits behind roles that keep appearing on ${site.city} job boards. That gap is the whole argument for a structured course: there is local demand, and there are very few trained people to hand the work to.`,
    },
    {
      icon: "users",
      label: "Method",
      title: "Supervised live work",
      body: "What separates this from a playlist of tutorials is supervision on real work. You build on live client briefs with a trainer beside you, make decisions that have consequences, and correct them the following week.",
    },
  ];

  const earnings = {
    icon: "chart",
    label: "Earnings",
    title: "Honest pay expectations",
    body: `Roles this opens include ${course.careers.slice(0, 3).join(", ")}. Pay depends on the portfolio you can show — use the free salary estimator for an honest range rather than a brochure number.`,
    cta: { href: "/tools/salary-estimator", label: "Open the salary estimator" },
  };
  const alternative = {
    icon: "shield",
    label: "The alternative",
    title: "A structured alternative",
    body: "The alternative is what most people try first: free videos, a cheap online course, months of drifting, and knowledge you cannot demonstrate. A live-project mentor, an internship letter and a placement cell that actually calls employers is the difference between knowing the subject and being hired to do it.",
  };

  const cardBase =
    "group relative rounded-[24px] border border-[rgba(20,40,90,0.08)] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]";
  const badge =
    "inline-flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600";
  const label = "text-xs font-bold uppercase tracking-[0.14em] text-brand-600";
  const title = "mt-3 font-display text-[1.75rem] font-bold leading-tight text-hero-950";

  return (
    <div className="mx-auto max-w-[1400px]">
      <h2 className="text-center font-display text-3xl font-extrabold tracking-tight text-hero-950 sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
        Why this course is worth your year
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Large left card, spans both top rows */}
        <div className={cx(cardBase, "lg:col-span-7 lg:row-span-2")}>
          <span className={badge}>
            <Icon name={feature.icon} className="size-6" />
          </span>
          <span className={cx(label, "mt-4 block")}>{feature.label}</span>
          <h3 className={title}>{feature.title}</h3>
          <div className="mt-4 space-y-4 text-[15px] leading-[1.7] text-muted">
            {feature.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className="relative mt-8 isolate">
            <span
              aria-hidden="true"
              className="float-slow absolute -top-6 -right-4 size-20 rounded-full bg-gradient-to-br from-brand-400/40 to-accent-glow/30 blur-sm sm:size-24"
            />
            <div className="relative isolate flex h-48 items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-hero-950 via-hero-900 to-hero-800 transition-transform duration-500 group-hover:scale-[1.03] sm:h-56">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1.5px)] [background-size:22px_22px]"
              />
              <div className="relative flex items-center gap-4 text-white/90">
                <Icon name="calendar" className="size-9" />
                <span className="text-left text-sm font-semibold leading-snug">
                  Weekday · Evening
                  <br />
                  Weekend · 1-on-1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two stacked cards, right column */}
        {stacked.map((card) => (
          <div key={card.title} className={cx(cardBase, "lg:col-span-5")}>
            <span className={badge}>
              <Icon name={card.icon} className="size-6" />
            </span>
            <span className={cx(label, "mt-4 block")}>{card.label}</span>
            <h3 className={title}>{card.title}</h3>
            <p className="mt-4 text-[15px] leading-[1.7] text-muted">{card.body}</p>
          </div>
        ))}

        {/* Bottom row: narrower + wider */}
        <div className={cx(cardBase, "lg:col-span-5")}>
          <span className={badge}>
            <Icon name={earnings.icon} className="size-6" />
          </span>
          <span className={cx(label, "mt-4 block")}>{earnings.label}</span>
          <h3 className={title}>{earnings.title}</h3>
          <p className="mt-4 text-[15px] leading-[1.7] text-muted">{earnings.body}</p>
          <Link
            href={earnings.cta.href}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
          >
            {earnings.cta.label}
            <Icon name="arrow-right" className="size-3.5" />
          </Link>
        </div>
        <div className={cx(cardBase, "lg:col-span-7")}>
          <span className={badge}>
            <Icon name={alternative.icon} className="size-6" />
          </span>
          <span className={cx(label, "mt-4 block")}>{alternative.label}</span>
          <h3 className={title}>{alternative.title}</h3>
          <p className="mt-4 text-[15px] leading-[1.7] text-muted">{alternative.body}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Why now ------------------------------ */

export function IndustryLeadersSection({ course }: { course: Course }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 uppercase">
          Why now
        </span>
        <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance text-white lg:text-4xl">
          {course.name} Is Powering the Next Generation of Industry Leaders
        </h2>
        <ul className="mt-8 space-y-4">
          <li className="flex items-start gap-3">
            <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent-400" />
            <span className="leading-relaxed text-white/70">
              Live client work from week one, supervised by a trainer, not slides, not simulations.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent-400" />
            <span className="leading-relaxed text-white/70">
              Entry-level pay for {course.name} roles varies with the portfolio you can show — see
              live tricity ranges in the free{" "}
              <Link href="/tools/salary-estimator" className="font-semibold text-accent-400 underline underline-offset-4">
                salary estimator
              </Link>
              .
            </span>
          </li>
        </ul>
        <ButtonLink href="/contact#enquire" variant="onDark" className="mt-10">
          Talk to a Course Advisor
          <Icon name="arrow-right" className="size-4" />
        </ButtonLink>
      </div>

      <div className="relative isolate rounded-3xl border border-white/15 bg-white/[0.04] p-2 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-hero-900 via-hero-800 to-hero-600">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1.5px)] [background-size:24px_24px]"
          />
          <span className="relative grid size-20 place-items-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Icon name="award" className="size-10 text-accent-400" />
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-5 pt-10 text-xs font-bold tracking-wide text-white uppercase">
            Reviewed by mentors. Built for interviews.
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- What you will build --------------------------- */

export function ProjectsSection({ course }: { course: Course }) {
  const modules = course.modules;
  const first = modules[0];
  const second = modules[1] ?? first;
  const last = modules[modules.length - 1];

  const projects = [
    {
      step: "01",
      title: `${first?.title ?? "Foundations"} build`,
      body: `Your first working piece, applying ${(first?.topics ?? []).slice(0, 2).join(" and ").toLowerCase()} end to end rather than as isolated exercises.`,
      tags: (first?.topics ?? []).slice(0, 2),
    },
    {
      step: "02",
      title: `${second?.title ?? "Applied"} challenge`,
      body: `Work with a real, messier brief covering ${(second?.topics ?? []).slice(0, 2).join(" and ").toLowerCase()}, and defend the choices you made to a trainer.`,
      tags: (second?.topics ?? []).slice(0, 2),
    },
    {
      step: "03",
      title: "Live client brief",
      body: "A genuine requirement from techcadd's delivery pipeline, scoped, built and shipped under supervision. This is the one interviewers ask about.",
      tags: ["Live work", "Supervised"],
    },
    {
      step: "04",
      title: "Portfolio capstone",
      body: `A ${course.name.toLowerCase()} project you specify yourself, covering ${(last?.topics ?? []).slice(0, 2).join(" and ").toLowerCase()}, presented as your final piece.`,
      tags: (last?.topics ?? []).slice(0, 2),
    },
  ];

  return (
    <div>
      <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 uppercase">
        Portfolio
      </span>
      <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance text-white lg:text-4xl">
        Hands-on projects you will ship
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-white/65">
        The syllabus is arranged so every module produces something you keep rather than a set of
        notes. Modules run in the order a real project runs: foundations first, then applied work,
        then supervised client work, then the portfolio piece that turns all of it into an offer
        letter.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.step}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1E88FF]/20 to-[#0F2E6D]/40 p-6 backdrop-blur-sm"
          >
            <span className="inline-flex items-center rounded-full border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
              Project {project.step}
            </span>
            <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-white">
              {project.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{project.body}</p>
            {project.tags.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Working loop -------------------------------- */

/**
 * Splits into 3 roughly-even, non-empty groups (as long as `items` has 3+
 * entries) — a plain `Math.ceil(n/3)` stride leaves the last group empty
 * whenever `n` divides evenly into the first two, which then silently
 * duplicates group 2's content into the fallback.
 */
export function splitIntoThirds<T>(items: T[]): [T[], T[], T[]] {
  const n = items.length;
  if (n === 0) return [[], [], []];
  if (n === 1) return [items, items, items];
  if (n === 2) return [[items[0]!], [items[1]!], items];
  const size1 = Math.ceil(n / 3);
  const size2 = Math.ceil((n - size1) / 2);
  return [items.slice(0, size1), items.slice(size1, size1 + size2), items.slice(size1 + size2)];
}

export function WorkingLoopSection({ course }: { course: Course }) {
  const modules = course.modules;
  const [group1, group2, group3] = splitIntoThirds(modules);

  const g1Topics = joinNatural(group1.flatMap((m) => m.topics).slice(0, 5)).toLowerCase();
  const g2Topics = joinNatural(group2.flatMap((m) => m.topics).slice(0, 4)).toLowerCase();
  const g3Topics = joinNatural(group3.flatMap((m) => m.topics).slice(0, 3)).toLowerCase();
  const v = variantIndex(course.id, 2);
  const stageOpeners = [
    ["The first stage covers", "The next stage moves into", "The final stage adds"],
    ["Early modules cover", "From there the syllabus moves into", "The closing stage brings in"],
  ][v]!;

  return (
    <div>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute -top-10 left-0 hidden size-10 rounded-full border-2 border-brand-300 sm:block"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold tracking-wide text-brand-600 uppercase">
            Syllabus
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold tracking-wide text-emerald-600 uppercase">
            Live projects
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <h2 className="font-display text-4xl font-bold tracking-tight text-hero-950 lg:text-5xl">
            What you will
            <br />
            actually <span className="italic text-brand-600">build</span>
          </h2>

          <p className="max-w-md text-justify leading-relaxed text-muted">
            The syllabus is arranged so every module produces an asset rather than a set of notes.{" "}
            {g1Topics ? <>{stageOpeners[0]} {g1Topics}. </> : null}
            {g2Topics ? <>{stageOpeners[1]} {g2Topics}. </> : null}
            {stageOpeners[2]}{g3Topics ? <> {g3Topics}, alongside</> : ""} a live client project, CV
            preparation and placement drives. Modules run in the order a real project runs:
            foundations first, then core skills, then applied work under supervision, then the
            portfolio and interview preparation that turn all of it into an offer letter.
          </p>
        </div>
      </div>

      <BuildStagesPanel course={course} group1={group1} group2={group2} group3={group3} />
    </div>
  );
}

/* ------------------------------- Career FAQs ------------------------------- */

export function CareerFaqSection({ course }: { course: Course }) {
  const roles = course.careers.join(", ");
  const qas = [
    {
      q: `What job roles open up after ${course.name}?`,
      a: `Graduates typically move into ${roles}. These sit behind roles that keep appearing on ${site.city} job listings, so demand is real rather than assumed.`,
    },
    {
      q: "What can I earn, and how fast does it grow?",
      a: "Pay depends on the portfolio you can show more than the certificate alone. Use the free salary estimator for an honest range by role, experience and employer type rather than a brochure number.",
    },
    {
      q: "Can I freelance or work remotely with this skill?",
      a: `Yes. A ${site.city} address costs you nothing on a remote brief. The course covers client handling and reporting so you can price and defend your work, not just do it.`,
    },
    {
      q: `Which industries hire for this around ${site.city}?`,
      a: "IT services firms, product startups and a growing set of local businesses across the tricity now hire directly for these skills, not only large employers.",
    },
    {
      q: "Can I continue to higher studies or a specialisation later?",
      a: "The certificate and portfolio stand on their own, and they stack. Most students move on to an adjacent techcadd track — the tools overlap, so the second course is faster than the first.",
    },
  ];
  return (
    <div>
      <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-wide text-amber-600 uppercase">
        Future scope
      </span>
      <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance lg:text-4xl">
        Where this course takes you
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        The roles this opens and who is hiring for them — the same figures our free salary
        estimator publishes, not a brochure number.
      </p>

      <div className="mt-10 rounded-[24px] border border-line bg-subtle p-7 lg:p-9">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon name="briefcase" className="size-6" />
            </span>
            <div>
              <p className="text-[11px] font-bold tracking-widest text-brand-600 uppercase">
                Salary outlook
              </p>
              <p className="font-display text-xl font-bold tracking-tight">
                {course.careers[0] ?? course.name}
              </p>
            </div>
          </div>
          <Link
            href="/tools/salary-estimator"
            className="inline-flex items-center gap-1.5 rounded-full bg-hero-950 px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
          >
            Open the salary estimator
            <Icon name="arrow-right" className="size-3.5" />
          </Link>
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
          Pay depends on the portfolio you can show more than the certificate alone — the
          estimator gives an honest range by role, experience and employer type rather than a
          fixed figure.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {qas.map((qa) => (
          <div key={qa.q} className="rounded-2xl border border-line bg-white p-6">
            <p className="font-display text-base font-bold tracking-tight">{qa.q}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{qa.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Why techcadd ------------------------------ */

export function WhyTechcaddSection() {
  const years = new Date().getFullYear() - site.founded;
  const cards: { title: string; body: ReactNode }[] = [
    {
      title: "Trainers who still do the work",
      body: "Your trainer is not a full-time lecturer. They deliver client projects for techcadd's services arm, so examples in class are current rather than a case study from five years ago.",
    },
    {
      title: "Live projects, real consequences",
      body: "You work on genuine client requirements under supervision. This is where a portfolio comes from, and it is the first thing an interviewer asks to see.",
    },
    {
      title: "Small batches and open lab hours",
      body: "Batches stay small enough that a trainer sees your screen daily. Lab time runs outside class hours and doubt sessions continue until the concept lands.",
    },
    {
      title: "Internship letter and certificate",
      body: (
        <>
          Every student finishes with an industry-recognised certificate and a documented
          internship on real work, accepted for university{" "}
          <Link href="/internship-training" className="underline underline-offset-4 hover:text-white">
            industrial training
          </Link>{" "}
          requirements.
        </>
      ),
    },
    {
      title: "A placement cell that persists",
      body: `Mock interviews, CV reviews and drives with our ${site.stats.partners} hiring partners across the tricity, repeated after a rejection, not abandoned.`,
    },
    {
      title: `Since ${site.founded}, ${site.stats.alumni} students`,
      body: `${years}+ years of hiring relationships in the region is why a call from our placement cell gets answered and why local employers know what our certificate means.`,
    },
  ];
  return (
    <div>
      <SectionHeading
        eyebrow="Why techcadd"
        title="Why students choose techcadd"
        onDark
        body={`There are many places to learn this in ${site.city}, and the brochure syllabus looks similar at all of them. What differs is who teaches, whether you ever touch real work, and whether anyone picks up the phone after you have paid. techcadd has trained students across the region since ${site.founded} on the same model: small batches, working practitioners as trainers, client projects as coursework.`}
      />
      <div className="mt-12 space-y-8">
        <div className="grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {cards.slice(0, 3).map((card) => (
            <div key={card.title}>
              <h3 className="font-display text-base font-bold tracking-tight text-white">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{card.body}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {cards.slice(3, 6).map((card) => (
            <div key={card.title}>
              <h3 className="font-display text-base font-bold tracking-tight text-white">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Comparison table ---------------------------- */

const COMPARISON_ROWS = [
  { feature: "Curriculum", techcadd: "Industry-aligned, updated regularly", other: "Often outdated or generic" },
  { feature: "Learning style", techcadd: "100% hands-on, project-based", other: "Mostly theory-heavy" },
  { feature: "Trainers", techcadd: "Industry-experienced mentors who still deliver client work", other: "Mixed experience levels" },
  { feature: "Real projects", techcadd: "Multiple real-world projects plus a capstone", other: "Limited or simulated projects" },
  { feature: "Code review", techcadd: "Every assignment is read line by line by a mentor, so bad habits are corrected in week two, not year two", other: "Assignments marked pass or fail" },
  { feature: "Placement support", techcadd: "Dedicated career and interview preparation", other: "Often limited or absent" },
  { feature: "Batch flexibility", techcadd: "Weekday, evening, weekend and 1-on-1 options", other: "Fixed schedules" },
  { feature: "Doubt support", techcadd: "Ongoing mentor and community support", other: "Limited post-class support" },
  { feature: "Certification", techcadd: "Industry-recognised certificate plus a documented internship letter", other: "Varies" },
];

export function ComparisonTable({ course }: { course: Course }) {
  return (
    <div>
      <SectionHeading
        align="center"
        eyebrow="Compare"
        title="How techcadd compares"
        body={`${course.name} is taught everywhere, which is exactly why the differences matter. These are the things worth asking before you enrol in any programme, including this one.`}
        className="mx-auto"
      />
      <div className="mt-10 overflow-x-auto rounded-[24px] border border-line">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="text-left">
              <th className="bg-subtle p-4 text-xs font-bold tracking-widest text-muted uppercase">
                Feature
              </th>
              <th className="bg-brand-50 p-4 font-display font-bold text-brand-700">techcadd</th>
              <th className="bg-subtle p-4 font-display font-bold text-muted">Other institutes</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={row.feature} className={i % 2 ? "bg-subtle/40" : undefined}>
                <td className="border-t border-line p-4 font-medium">{row.feature}</td>
                <td className="border-t border-line bg-brand-50/60 p-4 text-ink">
                  <span className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                      <Icon name="check" className="size-3" />
                    </span>
                    {row.techcadd}
                  </span>
                </td>
                <td className="border-t border-line p-4 text-muted">
                  <span className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-line/60 text-muted">
                      <Icon name="minus" className="size-3" />
                    </span>
                    {row.other}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted">
        The right-hand column describes what is commonly offered in the market, not any particular
        institute. Ask any institute you are considering — this one included — to show you the work
        its students actually produced.
      </p>
    </div>
  );
}

/* ------------------------------- Testimonials ------------------------------- */

/**
 * The reviews whose course looks like this one.
 *
 * Takes the pool as an argument rather than reading a module-level array,
 * because the reviews now arrive from the CMS at request time.
 */
export function matchingTestimonials(course: Course, pool: Testimonial[]) {
  const nameLower = course.name.toLowerCase();
  return pool.filter(
    (t) =>
      t.course.toLowerCase().includes(nameLower.split(" ")[0]) ||
      nameLower.includes(t.course.toLowerCase()) ||
      t.course.toLowerCase() === nameLower,
  );
}

function GoogleBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1">
      <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3a7.4 7.4 0 0 1-4.07 1.14c-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z"
        />
        <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.27a12 12 0 0 0 0 10.74l4-3.1Z" />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.63l4 3.1C6.22 6.87 8.87 4.75 12 4.75Z"
        />
      </svg>
      <span className="text-xs font-semibold text-[#5F6368]">Google</span>
    </span>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure
      className={cx(
        "flex h-[260px] w-[300px] shrink-0 flex-col rounded-[20px] border border-line bg-white p-6",
        "shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-300",
        "hover:-translate-y-2 hover:border-brand-200 hover:shadow-[0_20px_40px_rgba(37,99,235,0.16)]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="star" className="size-3.5 text-amber-400" />
          ))}
        </div>
        <GoogleBadge />
      </div>
      <blockquote className="line-clamp-5 mt-4 flex-1 text-sm leading-relaxed text-muted">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
          {t.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-bold">{t.name}</span>
          <span className="block truncate text-[11px] text-muted">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export async function CourseTestimonials({ course }: { course: Course }) {
  // Falls back to real reviews from other tracks when this exact course has no
  // match yet, so the section never fabricates a review — it just widens the
  // honest pool it draws from.
  const all = await getReviews();
  const matches = matchingTestimonials(course, all);
  const pool = matches.length ? matches : all;

  // Nothing published in the CMS at all. Returned before the heading rather
  // than after it, because "What our students say" above two empty marquee
  // rows reads as a section that failed to load.
  if (pool.length === 0) {
    return (
      <EmptyState
        icon="quote"
        title="No reviews published yet"
        body={`Nothing has been added to the review wall for ${course.name} so far. Book a demo class and you can ask the batch about it directly — we will not be in the room.`}
      />
    );
  }

  const mid = Math.ceil(pool.length / 2);
  const row1 = pool.slice(0, mid).length ? pool.slice(0, mid) : pool;
  const row2 = pool.slice(mid).length ? pool.slice(mid) : pool;

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute -top-10 left-1 hidden size-9 rounded-full border-2 border-brand-300 sm:block"
      />
      <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-wide text-muted uppercase">
        Student reviews
      </span>
      <h2 className="mt-6 font-display text-3xl font-bold tracking-tight lg:text-4xl">
        What our students in {site.city} say
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        Real feedback from learners who completed training, projects, internships and placement
        preparation.
      </p>

      <div className="mt-12 space-y-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="group overflow-hidden py-2">
          <div className="marquee-track flex w-max touch-pan-y gap-5 group-hover:[animation-play-state:paused]">
            {[...row1, ...row1].map((t, i) => (
              <TestimonialCard key={`${t.name}-r1-${i}`} t={t} />
            ))}
          </div>
        </div>
        <div className="group overflow-hidden py-2">
          <div className="marquee-track flex w-max touch-pan-y gap-5 [animation-direction:reverse] group-hover:[animation-play-state:paused]">
            {[...row2, ...row2].map((t, i) => (
              <TestimonialCard key={`${t.name}-r2-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Staged syllabus ----------------------------- */

export function courseStages(course: Course) {
  const modules = course.modules;
  const mid = Math.ceil(modules.length / 2);
  const stage1 = modules.slice(0, mid);
  const stage2 = modules.slice(mid);

  const topicLine = (mods: typeof modules) =>
    mods.flatMap((m) => m.topics).slice(0, 2).join(", ") ||
    `Core ${course.name.toLowerCase()} fundamentals`;

  return [
    {
      title: "Foundation & Core Skills",
      body: `${topicLine(stage1)}, through to the tools that turn theory into finished work. ${stage1.length} capabilities, taught, practised in the lab and assessed on work you keep.`,
      modules: stage1,
      count: stage1.length,
      countLabel: `${stage1.length} capabilities`,
    },
    {
      title: "Applied Work",
      body: `${topicLine(stage2)}, building on everything from stage one.`,
      modules: stage2,
      count: stage2.length,
      countLabel: `+${stage2.length} capabilities`,
    },
    {
      title: "Live Project & Placement",
      body: "A live client project, a documented internship, mock interviews and placement drives with our hiring partner network.",
      modules: PLACEMENT_ITEMS.map((title): CourseModule => ({ title, topics: [] })),
      count: PLACEMENT_ITEMS.length,
      countLabel: `+${PLACEMENT_ITEMS.length} capabilities`,
    },
  ];
}

export function HowItIsBuiltSection({ course }: { course: Course }) {
  const stages = courseStages(course);
  const category = getCategory(course.category);

  return (
    <div className="relative mx-auto max-w-5xl text-center">
      <span
        aria-hidden="true"
        className="absolute -top-8 -left-6 hidden size-9 rounded-full border-2 border-brand-300 sm:block"
      />
      <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
        How it is built
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-hero-950 lg:text-4xl">
        How the programme is staged
      </h2>
      <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
        One programme, taught in stages. Each stage begins with practical foundations and the next
        continues where it ends, so nothing is repeated and nothing is skipped.
      </p>

      <div className="mt-12 grid gap-6 text-left lg:grid-cols-3">
        {stages.map((stage, i) => {
          const isActive = i === 1;
          return (
            <div
              key={stage.title}
              className={cx(
                "rounded-[24px] border p-3 pb-6",
                isActive
                  ? "border-transparent bg-brand-600 shadow-[0_20px_45px_rgba(37,99,235,0.3)]"
                  : "border-line bg-white",
              )}
            >
              <div
                className={cx(
                  "relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br",
                  isActive ? "from-brand-500 to-brand-700" : "from-hero-900 to-hero-700",
                )}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1.5px)] [background-size:18px_18px]"
                />
                <Icon name={category.icon} className="relative size-9 text-white/90" />
              </div>
              <div className="px-3">
                <span
                  className={cx(
                    "mt-5 block text-xs font-bold tracking-widest uppercase",
                    isActive ? "text-white/80" : "text-brand-600",
                  )}
                >
                  Stage {i + 1}
                </span>
                <h3
                  className={cx(
                    "mt-2 font-display text-lg font-bold tracking-tight",
                    isActive ? "text-white" : "text-hero-950",
                  )}
                >
                  {stage.title}
                </h3>
                <p
                  className={cx(
                    "mt-2 text-sm leading-relaxed",
                    isActive ? "text-white/75" : "text-muted",
                  )}
                >
                  {stage.body}
                </p>
                <div
                  className={cx(
                    "mt-5 border-t pt-3 text-xs font-semibold",
                    isActive ? "border-white/20 text-white/70" : "border-line text-muted",
                  )}
                >
                  {stage.countLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------- Get started -------------------------------- */

export function GetStartedStrip({ course }: { course: Course }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[24px] bg-gradient-to-br from-[#050B1D] via-[#081B3A] to-[#0F2E6D] p-8 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(30,136,255,0.25),transparent_70%)]"
      />
      <h2 className="font-display text-xl font-bold tracking-tight text-white">
        Get started today
      </h2>
      <p className="mt-2 text-sm text-white/65">Not sure if {course.name} is the right fit?</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65">
        One call with a counsellor is usually enough to find out. Book a free demo class and see
        the lab before you decide.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={site.contact.phoneHref}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:border-[#00D4FF]/50 hover:bg-white/5"
        >
          <Icon name="phone" className="size-4 text-[#00D4FF]" />
          {site.contact.phone}
        </a>
        <ButtonLink href="/contact#enquire" size="lg" variant="onDark">
          Book a free demo
          <Icon name="arrow-right" className="size-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
