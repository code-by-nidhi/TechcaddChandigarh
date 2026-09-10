import Image from "next/image";
import Link from "next/link";
import { getCourse, type Course } from "@/data/courses";
import type { Program } from "@/data/programs";
import { programs } from "@/data/programs";
import { branches } from "@/data/branches";
import { site } from "@/data/site";
import { splitIntoThirds } from "./CourseDetailExtras";
import { A12ToolEcosystem } from "./A12ToolEcosystem";
import { A12Timeline } from "./A12Timeline";
import { monthLabel, STAGE_THEMES } from "./after12thShared";
import { Icon, ButtonLink, cx, joinNatural } from "./ui";

const topicLine = (mods: Course["modules"]) =>
  joinNatural(mods.flatMap((m) => m.topics).slice(0, 3)).toLowerCase();

/* -------------------------------- Overview -------------------------------- */

/**
 * One paragraph per stage, naming the real topics in that stage's modules —
 * mirrors the month-by-month walkthrough pattern used on the reference site,
 * but built entirely from this course's own real module/topic data rather
 * than reusing any of the reference's specific (different course, different
 * city) content.
 */
export function A12Overview({ course, program }: { course: Course; program: Program }) {
  const groups = splitIntoThirds(course.modules);
  return (
    <div>
      <h2 className="font-display text-3xl font-bold tracking-tight text-hero-950 lg:text-4xl">
        Course Overview
      </h2>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted lg:text-lg">
        <p>
          This is the {program.duration.months}-month {course.name} programme, built for someone
          starting straight after 12th who wants real {course.name.toLowerCase()} skills without
          assuming any coding or technical background. {course.summary}
        </p>
        {groups.map((mods, i) => {
          const topics = mods.flatMap((m) => m.topics);
          if (!topics.length) return null;
          const theme = STAGE_THEMES[i] ?? `Stage ${i + 1}`;
          return (
            <p key={theme}>
              {monthLabel(program, i)} covers {theme.toLowerCase()} —{" "}
              {joinNatural(mods.map((m) => m.title))}: {joinNatural(topics)}. Each topic is taught
              hands-on, in the order a real {course.name.toLowerCase()} project actually needs it.
            </p>
          );
        })}
        <p>
          Every module ends with something you actually build — a script, a working setup, a
          deployed piece of the final project. By the end of the programme, these add up to a
          complete portfolio project with documentation you can show in interviews and on your CV.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ What you'll learn ----------------------------- */

export function A12WhatYoullLearn({ course }: { course: Course }) {
  const [group1, group2] = splitIntoThirds(course.modules);
  const items = [
    {
      icon: "layers",
      title: "Strong fundamentals first",
      body: `${topicLine(group1)} are covered in the first stage, so when you reach applied work you already understand the system underneath.`,
    },
    {
      icon: "sparkles",
      title: `Real hands-on practice with ${course.tools[0] ?? course.name}`,
      body: `You work in a real environment with ${joinNatural(course.tools.slice(0, 3))} rather than watching a recorded demo.`,
    },
    {
      icon: "shield",
      title: "Best practices taught early",
      body: `${topicLine(group2)} are covered before the advanced modules, because that is the order real work actually happens in.`,
    },
    {
      icon: "box",
      title: "A capstone that ties everything together",
      body: "The final project combines the full programme into one deployment, with documentation, a demo and interview practice.",
    },
  ];

  return (
    <div className="relative isolate">
      {course.heroImage ? (
        <span className="mb-5 grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/5 p-2">
          <Image
            src={course.heroImage}
            alt=""
            width={44}
            height={44}
            className="size-full object-contain"
          />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="absolute -top-8 left-0 hidden size-9 rounded-full border-2 border-brand-300 sm:block"
        />
      )}
      <h2 className="font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
        What You&rsquo;ll Learn
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
        Every module ends in something you have built and a trainer has reviewed, so the list
        below is work you will have done rather than topics you will have heard about.
      </p>

      <div className="mt-10">
        <A12Timeline items={items} />
      </div>
    </div>
  );
}

/* ------------------------------------ Tools ----------------------------------- */

export function A12ToolsRow({ course, program }: { course: Course; program: Program }) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 uppercase">
        The tool ecosystem
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
        Everything this course revolves around
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65">
        These are the tools and platforms you will actually work in — hover any node to see what
        it does and where it shows up in the curriculum.
      </p>

      <div className="mt-14">
        <A12ToolEcosystem course={course} program={program} />
      </div>
    </div>
  );
}

/* --------------------------------- Eligibility -------------------------------- */

const A12_WHO_FOR = [
  {
    icon: "graduation-cap",
    title: "Students Straight After 12th",
    body: "Join from any stream — Science, Commerce, or Arts. No technical background is required. Learn industry-relevant skills through practical training and real-world projects.",
  },
  {
    icon: "award",
    title: "Graduates & Final-Year Students",
    body: "Ideal for BCA, B.Sc, B.Com, BBA, BA, B.Tech and other graduates looking to gain practical skills, strengthen their portfolio, and improve placement opportunities.",
  },
  {
    icon: "briefcase",
    title: "Career Changers",
    body: "Perfect for individuals looking to transition into the tech industry. Learn in-demand skills and become job-ready without needing prior experience.",
  },
  {
    icon: "target",
    title: "Job Seekers",
    body: "Build practical projects, gain certification, prepare for interviews, and develop the confidence needed to secure entry-level technology roles.",
  },
];

/**
 * A pure-CSS sticky card stack: each card is `position: sticky` at the same
 * offset, so as the page scrolls each later card (painted on top, since it
 * comes later in DOM order) slides up and physically covers the previous one
 * once it reaches that offset. No scroll-linked JS, so there is nothing here
 * for the compositor to fight — the browser drives the whole effect the same
 * way it drives any other sticky element.
 */
export function A12Eligibility() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-hero-950 lg:text-4xl">
          Who Is This Program For?
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          Whether you&rsquo;re a student, graduate, or working professional, this program is
          designed to help you build practical, job-ready skills and start your career in
          technology.
        </p>
      </div>

      <div className="relative mt-14 space-y-10 pb-10 lg:space-y-14">
        {A12_WHO_FOR.map((card, i) => (
          <div
            key={card.title}
            style={{ zIndex: i + 1 }}
            className="sticky top-24 min-h-[300px] rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-[0_30px_70px_-24px_rgba(15,23,42,0.3)] backdrop-blur-md lg:top-28 lg:min-h-[340px] lg:p-12"
          >
            <div className="grid h-full items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="font-display text-sm font-bold text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-hero-950 lg:text-3xl">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-xl leading-relaxed text-muted">{card.body}</p>
              </div>
              <span className="grid size-24 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-[#00D4FF] text-white shadow-[0_20px_45px_-15px_rgba(37,99,235,0.55)] lg:size-32">
                <Icon name={card.icon} className="size-10 lg:size-12" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Worth it -------------------------------- */

export function A12WorthYear({ course, program }: { course: Course; program: Program }) {
  const [group1] = splitIntoThirds(course.modules);
  const cards = [
    {
      icon: "target",
      title: "Fundamentals first",
      body: `The first stage covers ${topicLine(group1)}. Once these basics are clear, every later module is easier to understand because you already know how the system underneath works.`,
    },
    {
      icon: "sparkles",
      title: "Hands-on practice",
      body: `You work with ${joinNatural(course.tools.slice(0, 3))} by actually building and configuring, not watching slides.`,
    },
    {
      icon: "layers",
      title: "You build real projects",
      body: "Every topic ends with a deliverable — labs, reports, a hosted application and a final capstone. You leave with work you can show in interviews.",
    },
    {
      icon: "refresh",
      title: "Extend anytime",
      body: `This ${program.duration.label.toLowerCase()} programme is the foundation of the longer tracks. If you want to go deeper later, you continue from where you left off — nothing is repeated.`,
    },
  ];

  return (
    <div className="text-center">
      <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 uppercase">
        The case for it
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
        Why this programme is worth your year
      </h2>
      <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
          >
            <Icon name={card.icon} className="size-5 text-amber-300" />
            <h3 className="mt-4 font-display text-base font-bold tracking-tight text-white">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Build tomorrow ------------------------------ */

export function A12WhyNow({ course }: { course: Course }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-line bg-subtle p-6 lg:p-10">
      <span
        aria-hidden="true"
        className="absolute -top-8 left-6 hidden size-9 rounded-full border-2 border-brand-300 sm:block"
      />
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-wide text-brand-600 uppercase">
            Why now
          </span>
          <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-hero-950 lg:text-3xl">
            Build tomorrow. Scale without limits.
          </h2>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <Icon name="check" className="mt-0.5 size-5 shrink-0 text-brand-600" />
              <span className="text-sm leading-relaxed text-muted">
                {course.name} sits behind roles that keep appearing on {site.city} job boards, and
                businesses are increasingly hiring straight out of a practical programme rather
                than a degree alone.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="check" className="mt-0.5 size-5 shrink-0 text-brand-600" />
              <span className="text-sm leading-relaxed text-muted">
                Someone has to plan the work, build it and keep it running — that is the job this
                programme trains you for, using {joinNatural(course.tools.slice(0, 3))}.
              </span>
            </li>
          </ul>
          <ButtonLink href="/contact#enquire" variant="secondary" className="mt-8">
            Talk to a Course Advisor
          </ButtonLink>
        </div>

        <div className="relative isolate flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-hero-950 via-hero-900 to-hero-800">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1.5px)] [background-size:20px_20px]"
          />
          <Icon name="rocket" className="relative size-12 text-white/80" />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Why choose --------------------------------- */

export function A12WhyChoose() {
  const years = new Date().getFullYear() - site.founded;
  const cards = [
    {
      title: "Learn at your pace",
      body: "You advance when your work passes review, not when the calendar says so. If you need extra time on a topic, you get it — nobody is rushed ahead.",
    },
    {
      title: "Real practice, supervised",
      body: "Every hands-on session runs in a real account or environment — under trainer supervision, so mistakes become learning moments rather than surprise bills.",
    },
    {
      title: "Trainers with industry experience",
      body: "The people teaching this syllabus are the same people doing this work for real clients, which is why the course covers problems that actually happen.",
    },
    {
      title: "Extend your course anytime",
      body: "Finish with a certificate and a capstone, or continue into the longer tracks later. You pick up from where you left off — nothing is repeated.",
    },
  ];

  return (
    <div className="text-center">
      <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 uppercase">
        Why techcadd
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
        Why students choose techcadd
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65">
        {branches.length} campuses across the region, {site.stats.rating}★ from{" "}
        {site.stats.reviews} reviews, and a syllabus that is updated every year to match current
        industry needs.
      </p>
      <div className="group/cards mt-10 grid gap-5 text-left sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className={cx(
              "group/card relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-7",
              "cursor-pointer backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "hover:z-10 hover:-translate-y-3.5 hover:scale-[1.03] hover:border-[#00D4FF]/40 hover:bg-white/[0.08]",
              "hover:shadow-[0_35px_70px_-20px_rgba(0,0,0,0.55),0_0_45px_-12px_rgba(0,212,255,0.4)]",
              "group-has-[:hover]/cards:opacity-55 hover:opacity-100!",
            )}
          >
            {/* Spotlight glow, only painted in on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(0,212,255,0.16),transparent_75%)] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            />
            {/* Arrow, slides diagonally up and fades in on hover */}
            <span
              aria-hidden="true"
              className="absolute top-6 right-6 grid size-8 place-items-center rounded-full border border-white/15 text-white/40 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-1 group-hover/card:-translate-y-1 group-hover/card:border-[#00D4FF]/50 group-hover/card:text-[#00D4FF] group-hover/card:opacity-100"
            >
              <Icon name="arrow-up-right" className="size-4" />
            </span>

            <h3 className="pr-10 font-display text-lg font-bold tracking-tight text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:-translate-y-0.5">
              {card.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-white/60 transition-colors duration-500 group-hover/card:text-white/85">
              {card.body}
            </p>

            {/* Hidden tag row — expands open on hover */}
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4 opacity-0 transition-opacity delay-100 duration-300 group-hover/card:opacity-100">
                  {["Industry Mentors", "Live Projects", "Placement Support"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Learn it. Build it. ----------------------------- */

export function A12WorkingLoop({ course }: { course: Course }) {
  const modules = course.modules;
  const first = modules[0];
  const second = modules[1] ?? first;

  const steps = [
    {
      title: "Understand",
      body: "Break a real requirement into a clear plan and the right tools.",
      project: first ? `${first.title} build` : "Foundations build",
    },
    {
      title: "Build",
      body: "Work hands-on with trainer feedback while the decisions are still easy to change.",
      project: second ? `${second.title} challenge` : "Applied challenge",
    },
    {
      title: "Present",
      body: "Turn the finished work into a portfolio story you can defend in an interview.",
      project: "Live client brief",
    },
  ];

  return (
    <div className="relative text-center">
      <span
        aria-hidden="true"
        className="absolute -top-8 left-0 hidden size-9 rounded-full border-2 border-brand-300 sm:block"
      />
      <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-wide text-brand-600 uppercase">
        The working loop
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-hero-950 lg:text-3xl">
        Learn it. Build it. Make it yours.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Every project moves through the same loop: understand the brief, build with guidance, then
        explain the decisions behind your work.
      </p>
      <div className="group/cards mt-10 grid gap-5 text-left sm:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className={cx(
              "group/card relative isolate overflow-hidden rounded-[28px] border border-line",
              "bg-gradient-to-br from-white via-white to-brand-50/60 p-7",
              "cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "hover:z-10 hover:-translate-y-3.5 hover:scale-[1.03] hover:border-brand-300 hover:bg-white",
              "hover:shadow-[0_35px_70px_-24px_rgba(15,23,42,0.28),0_0_40px_-14px_rgba(37,99,235,0.35)]",
              "group-has-[:hover]/cards:opacity-60 hover:opacity-100!",
            )}
          >
            {/* Soft spotlight glow */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(65%_55%_at_20%_0%,rgba(37,99,235,0.12),transparent_75%)] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            />
            {/* Glass reflection sheen */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-10 -top-1/2 h-full -rotate-12 bg-gradient-to-b from-white/70 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-60"
            />

            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-full bg-white text-xs font-bold text-brand-600 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:-translate-y-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden="true"
                className="grid size-8 -translate-x-2 place-items-center rounded-full border border-line text-muted opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-0 group-hover/card:border-brand-300 group-hover/card:text-brand-600 group-hover/card:opacity-100"
              >
                <Icon name="arrow-right" className="size-4" />
              </span>
            </div>
            <h3 className="mt-4 font-display text-base font-bold tracking-tight text-hero-950">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted transition-colors duration-500 group-hover/card:text-hero-950/75">
              {step.body}
            </p>
            <p className="mt-4 border-t border-line pt-3 text-xs font-semibold text-hero-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-1">
              {step.project}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Popular programs -------------------------------- */

/**
 * A themed icon + gradient per track, standing in for a course photo — no
 * real course poster exists for these programs, so a distinct decorative
 * mark (shield for security, cloud for cloud computing, etc.) is used
 * instead of a fabricated or reused stock photo.
 */
const TRACK_VISUAL: Record<string, { icon: string; gradient: string }> = {
  "artificial-intelligence": { icon: "network", gradient: "from-brand-400 to-hero-800" },
  "agentic-ai": { icon: "sparkles", gradient: "from-violet-400 to-hero-800" },
  "data-science": { icon: "chart", gradient: "from-blue-400 to-hero-800" },
  "data-analytics": { icon: "monitor", gradient: "from-cyan-400 to-hero-800" },
  "full-stack-development": { icon: "code", gradient: "from-emerald-400 to-teal-700" },
  "mern-stack-development": { icon: "layers", gradient: "from-emerald-400 to-cyan-700" },
  "flutter-app-development": { icon: "smartphone", gradient: "from-sky-400 to-blue-700" },
  "cyber-security": { icon: "shield", gradient: "from-indigo-400 to-slate-900" },
  "cloud-computing": { icon: "cloud", gradient: "from-blue-400 to-indigo-800" },
  "digital-marketing": { icon: "megaphone", gradient: "from-rose-400 to-orange-600" },
};
const DEFAULT_TRACK_VISUAL = { icon: "sparkles", gradient: "from-slate-400 to-slate-800" };

export function A12PopularPrograms({ program }: { program: Program }) {
  const siblings = programs
    .filter((p) => p.after12th === program.after12th && p.slug !== program.slug)
    .slice(0, 4);

  if (!siblings.length) return null;

  return (
    <div className="text-center">
      <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 uppercase">
        Explore more
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
        Popular courses
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65">
        Learn from industry trainers on the tracks students most often take next.
      </p>
      <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
        {siblings.map((sibling) => {
          const siblingCourse = getCourse(sibling.track.id);
          const visual = TRACK_VISUAL[sibling.track.id] ?? DEFAULT_TRACK_VISUAL;
          return (
            <Link
              key={sibling.slug}
              href={`/${sibling.slug}`}
              className="group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-amber-300/30 hover:bg-white/[0.07] hover:shadow-[0_35px_70px_-25px_rgba(0,0,0,0.65)]"
            >
              {/* Ambient glow that blooms in on hover — the "border glow" cue. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_100%_0%,rgba(251,191,36,0.14),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="grid grid-cols-[1fr_0rem] items-center gap-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-cols-[1fr_6rem] group-hover:gap-5">
                <div className="min-w-0">
                  <span className="text-xs font-bold tracking-wide text-amber-300 uppercase">
                    {sibling.after12th ? "After 12th" : ""} {sibling.duration.label} Program
                  </span>
                  <h3 className="mt-2 line-clamp-2 min-h-[3.375rem] font-display text-lg font-bold tracking-tight text-white">
                    {sibling.track.name}{" "}
                    {sibling.duration.tier === "Diploma" ? "Diploma" : "Certificate"} Program
                  </h3>
                  <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-white/60">
                    {sibling.track.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                    View course
                    <Icon
                      name="arrow-right"
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </span>
                </div>

                <div className="min-w-0 overflow-hidden">
                  <div
                    className={cx(
                      "grid size-24 shrink-0 -translate-x-[30px] scale-95 place-items-center rounded-[28px] border border-white/15 opacity-0 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100",
                      siblingCourse?.heroImage ? "bg-white/5 p-2.5" : cx("bg-gradient-to-br", visual.gradient),
                    )}
                  >
                    {siblingCourse?.heroImage ? (
                      <Image
                        src={siblingCourse.heroImage}
                        alt=""
                        width={70}
                        height={70}
                        className="size-full object-contain"
                      />
                    ) : (
                      <span className="grid size-11 place-items-center rounded-2xl bg-white/15 text-white">
                        <Icon name={visual.icon} className="size-5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

