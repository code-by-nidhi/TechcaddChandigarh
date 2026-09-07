"use client";

import { useState } from "react";
import type { Course } from "@/data/courses";
import { courseStages } from "./CourseDetailExtras";
import { Icon, cx } from "./ui";

const ROW_TEMPLATES = [
  [
    "Taught in this stage, with a graded exercise you keep.",
    "Practised in supervised lab time, not just demonstrated.",
    "Built hands-on in this stage and reviewed line by line by a mentor.",
  ],
  [
    "Applied here, building directly on the stage before it.",
    "Worked through with a real, messier brief under trainer supervision.",
    "Assessed on what you produce here, not on notes.",
  ],
  [
    "Delivered as part of the live client project and placement stage.",
    "Documented so it stands up in an interview, not just on a certificate.",
    "Carried through to the portfolio piece you finish the course with.",
  ],
];

export function SyllabusLadderSection({ course }: { course: Course }) {
  const stages = courseStages(course);
  const [openStage, setOpenStage] = useState<number | null>(0);

  return (
    <div>
      <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 uppercase">
        The ladder
      </span>
      <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance text-white lg:text-4xl">
        Every module, stage by stage
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-white/65">
        {course.name} runs as {stages.length} stages inside one enrolment. A tick shows the stage
        each capability first appears in — the ladder is cumulative, so a later stage builds on
        the earlier ones instead of replacing them.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {stages.map((stage, i) => (
          <div key={stage.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-bold text-white">{i + 1}</span>
              <span className="text-xs text-white/50">stage</span>
            </div>
            <p className="mt-3 text-[11px] font-bold tracking-widest text-accent-400 uppercase">
              {stage.title}
            </p>
            <p className="mt-1 text-xs text-white/50">{stage.countLabel}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10">
        <div className="hidden bg-white/[0.04] px-6 py-3 text-xs font-bold tracking-widest text-white/50 uppercase sm:grid sm:grid-cols-[1fr_repeat(3,64px)]">
          <span>Module</span>
          {stages.map((_, i) => (
            <span key={i} className="text-center">
              Stage {i + 1}
            </span>
          ))}
        </div>

        {stages.map((stage, stageIndex) => {
          const isOpen = openStage === stageIndex;
          return (
            <div key={stage.title} className="border-t border-white/10 first:border-t-0">
              <button
                type="button"
                onClick={() => setOpenStage(isOpen ? null : stageIndex)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 bg-white/[0.02] px-6 py-4 text-left"
              >
                <span className="text-xs font-bold tracking-widest text-white/70 uppercase">
                  Stage {stageIndex + 1} · {stage.title} · {stage.countLabel}
                </span>
                <Icon
                  name="chevron-down"
                  className={cx(
                    "size-4 shrink-0 text-white/50 transition-transform duration-300",
                    isOpen ? "rotate-180" : "",
                  )}
                />
              </button>
              <div
                className={cx(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  {stage.modules.map((m, i) => {
                    const templates = ROW_TEMPLATES[stageIndex % ROW_TEMPLATES.length]!;
                    const description = templates[i % templates.length]!;
                    return (
                      <div
                        key={m.title}
                        className="grid grid-cols-1 gap-3 border-t border-white/5 px-6 py-4 sm:grid-cols-[1fr_repeat(3,64px)] sm:items-center"
                      >
                        <div>
                          <p className="text-sm font-bold text-white">{m.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-white/50">{description}</p>
                        </div>
                        {stages.map((_, colIndex) => (
                          <span key={colIndex} className="flex justify-start sm:justify-center">
                            {colIndex >= stageIndex ? (
                              <Icon name="check" className="size-4 text-accent-400" />
                            ) : (
                              <span className="text-white/20">—</span>
                            )}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
