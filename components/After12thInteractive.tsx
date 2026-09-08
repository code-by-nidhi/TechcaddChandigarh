"use client";

import { useState } from "react";
import type { Course } from "@/data/courses";
import type { Program } from "@/data/programs";
import { site } from "@/data/site";
import { rupees } from "@/lib/routes";
import { splitIntoThirds } from "./CourseDetailExtras";
import { Icon, cx } from "./ui";

/* ------------------------------ Curriculum tabs ------------------------------ */

function monthLabel(program: Program, stageIndex: number): string {
  const total = program.duration.months;
  const perStage = total / 3;
  const start = Math.round(stageIndex * perStage) + 1;
  const end = Math.round((stageIndex + 1) * perStage);
  return start === end ? `Month ${start}` : `Months ${start}–${end}`;
}

const STAGE_THEMES = ["Foundations", "Core Skills & Practice", "Scaling & Capstone Project"];

export function A12CurriculumTabs({ course, program }: { course: Course; program: Program }) {
  const groups = splitIntoThirds(course.modules);
  const [selected, setSelected] = useState(0);

  const stages = groups.map((mods, i) => {
    const theme = STAGE_THEMES[i] ?? `Stage ${i + 1}`;
    const keywords = mods
      .flatMap((m) => m.topics)
      .slice(0, 3)
      .map((t) => t.split(/[,(]/)[0]!.trim())
      .join(", ");
    return {
      month: monthLabel(program, i),
      subtitle: keywords ? `${theme}: ${keywords}` : theme,
      firstLine: mods[0]?.topics[0] ?? `Core ${course.name.toLowerCase()} fundamentals`,
      lines: mods.flatMap((m) => m.topics),
      projects: mods.map((m) => m.title).join(" + "),
    };
  });

  const active = stages[selected]!;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-hero-950 lg:text-3xl">
        Course Curriculum
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        The course is divided into three months. Each month builds on the previous one, moving
        from basics to real, portfolio-ready projects.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3">
          {stages.map((stage, i) => {
            const isActive = i === selected;
            return (
              <button
                key={stage.month}
                type="button"
                onClick={() => setSelected(i)}
                className={cx(
                  "flex w-full items-start gap-3 rounded-2xl p-5 text-left transition-colors",
                  isActive ? "bg-brand-50" : "bg-white hover:bg-subtle",
                )}
              >
                <span
                  className={cx(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                    isActive
                      ? "bg-brand-600 text-white"
                      : "border border-brand-200 text-brand-600",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold tracking-tight text-hero-950">
                    Module {i + 1}: {stage.month} — {stage.subtitle}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                    {stage.firstLine}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-2 lg:p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
              {course.name}
            </span>
            <span className="shrink-0 rounded-full bg-subtle px-3 py-1 text-xs font-bold text-muted">
              {selected + 1}/{stages.length}
            </span>
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-hero-950">
            {active.month} — {active.subtitle}
          </h3>
          <ul className="mt-6 space-y-4">
            {active.lines.map((line, i) => (
              <li key={line} className="flex items-start gap-3 text-sm leading-relaxed font-medium text-hero-950/85">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-brand-200 text-[11px] font-bold text-brand-600">
                  {i + 1}
                </span>
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-1.5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
            <p>
              <span className="font-semibold text-hero-950">Tools covered:</span>{" "}
              {course.tools.join(" · ")}.
            </p>
            <p>
              <span className="font-semibold text-hero-950">Projects:</span> {active.projects}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Career accordion ------------------------------ */

export function A12CareerRoles({ course }: { course: Course }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="text-center">
      <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-wide text-brand-600 uppercase">
        Future scope
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-hero-950 lg:text-3xl">
        Where this course takes you
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        The roles this opens and who is hiring for them — the same figures our free salary
        estimator publishes, not a brochure number.
      </p>

      <div className="mx-auto mt-8 max-w-3xl space-y-3 text-left">
        {course.careers.map((role, i) => {
          const isOpen = open === i;
          return (
            <div key={role} className="overflow-hidden rounded-2xl bg-subtle">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-sm font-bold tracking-tight text-hero-950">
                  {role}
                </span>
                <Icon
                  name={isOpen ? "minus" : "plus"}
                  className="size-4 shrink-0 text-brand-600"
                />
              </button>
              <div
                className={cx(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                    {i === 0
                      ? `The most common starting role. You work hands-on with ${joinFirst(course.tools)} and configure the systems this course covers. Your projects from this course serve as proof of your skills.`
                      : `A natural next step as you gain experience — the same ${course.name} fundamentals apply, with more ownership over the systems you work on.`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function joinFirst(tools: string[]): string {
  return tools.slice(0, 2).join(" and ") || "the core tools";
}

/* ---------------------------------- FAQ ---------------------------------- */

export function A12Faq({ course, program }: { course: Course; program: Program }) {
  const [open, setOpen] = useState<number | null>(0);

  const feeAnswer = course.fee
    ? `The current fee is ${rupees(course.fee.offer)}, listed at ${rupees(course.fee.original)}. EMI options are available and there is no registration fee.`
    : "Fees vary by batch and any live offer running at the time — talk to a counsellor for the current number. There is no registration fee.";

  const items = [
    {
      q: `What is the duration of the After 12th ${program.duration.label} ${course.name} Program in ${site.city}?`,
      a: `${program.duration.label} (${program.duration.hours}). Weekday, evening and weekend batches cover the same syllabus, and 1-on-1 training is available if you prefer your own pace. Every class runs for 2 hours, whichever format you choose.`,
    },
    {
      q: "Do I need programming experience or a technical background?",
      a: "No. This programme is built for students straight after 12th from any stream — Science, Commerce or Arts. It starts from the basics.",
    },
    {
      q: "Will I work on real systems or just watch demonstrations?",
      a: `Real work. You build hands-on with ${joinFirst(course.tools)} under a trainer's supervision — that is what the internship letter is issued against.`,
    },
    {
      q: "What will I have built by the end?",
      a: "A complete capstone project that combines the full syllabus, plus the smaller projects from each module — all documented for your CV and interviews.",
    },
    {
      q: `What jobs can I get after the ${program.duration.label} program?`,
      a: `Graduates typically move into ${course.careers.slice(0, 3).join(", ")}.`,
    },
    {
      q: `What salary can a fresher expect in ${site.city}?`,
      a: "Pay depends on the portfolio you can show more than the certificate alone. Use the free salary estimator for an honest range by role and experience.",
      href: "/tools/salary-estimator",
    },
    {
      q: "Can I extend to the 6-month or 9-month program later?",
      a: "Yes. This programme is the foundation of the longer tracks, so you continue from where you left off — nothing is repeated or charged for twice.",
    },
    {
      q: "Is placement support available after this program?",
      a: `No genuine institute can guarantee a job. What we do run is a placement cell: CV review, mock interviews and drives with our ${site.stats.partners} hiring partners, continuing after your course finishes.`,
    },
    {
      q: "Do I get a certificate and an internship letter?",
      a: "Yes. Every student finishes with an industry-recognised certificate and a documented internship on real work.",
    },
  ];

  return (
    <div className="text-center">
      <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-wide text-brand-600 uppercase">
        FAQs
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-hero-950 lg:text-3xl">
        Frequently asked questions
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Find answers to the questions students ask before enrolling.
      </p>

      <div className="mx-auto mt-8 grid max-w-4xl gap-4 text-left lg:grid-cols-2">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={cx(
                "self-start overflow-hidden rounded-2xl border p-5 transition-colors",
                isOpen ? "border-brand-200 bg-brand-50/40" : "border-line bg-white",
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <span className="font-display text-sm font-bold text-hero-950">{item.q}</span>
                <span
                  className={cx(
                    "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
                    isOpen
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-line text-muted",
                  )}
                >
                  <Icon name={isOpen ? "minus" : "plus"} className="size-3" />
                </span>
              </button>
              <div
                className={cx(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="text-sm leading-relaxed text-muted">
                    {item.a}{" "}
                    {item.href ? (
                      <a href={item.href} className="font-semibold text-brand-600 underline underline-offset-4">
                        Open the salary estimator
                      </a>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
