"use client";

import { useState } from "react";
import type { Course, CourseModule } from "@/data/courses";
import { PLACEMENT_ITEMS } from "@/data/content";
import { cx } from "./ui";

interface Stage {
  step: string;
  title: string;
  summary: string;
  bullets: string[];
}

function topicLine(mods: CourseModule[], fallback: string): string {
  return mods.flatMap((m) => m.topics).slice(0, 2).join(" • ") || fallback;
}

export function BuildStagesPanel({
  course,
  group1,
  group2,
  group3,
}: {
  course: Course;
  group1: CourseModule[];
  group2: CourseModule[];
  group3: CourseModule[];
}) {
  const fallback = `Core ${course.name.toLowerCase()} fundamentals`;
  const stages: Stage[] = [
    {
      step: "01",
      title: "Foundations",
      summary: topicLine(group1, fallback),
      bullets: group1.map((m) => m.title),
    },
    {
      step: "02",
      title: "Core Skills",
      summary: topicLine(group2, fallback),
      bullets: group2.map((m) => m.title),
    },
    {
      step: "03",
      title: "Applied Work",
      summary: topicLine(group3, fallback),
      bullets: group3.map((m) => m.title),
    },
    {
      step: "04",
      title: "Live Project & Placement Prep",
      summary: PLACEMENT_ITEMS.join(" • "),
      bullets: PLACEMENT_ITEMS,
    },
  ];

  const [selected, setSelected] = useState(0);
  const active = stages[selected]!;

  const tools = course.tools.length ? course.tools : [course.name, "Practice", "Delivery"];
  const nodeLeft = tools[0]!;
  const nodeCenter = tools[Math.min(1, tools.length - 1)]!;
  const nodeRight = tools[tools.length - 1]!;

  return (
    <div className="relative mt-10 overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-brand-50/50 via-white to-rose-50/40 p-6 lg:p-8">
      <span
        aria-hidden="true"
        className="float-slow absolute top-6 right-10 size-8 rounded-full border-2 border-brand-300"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {stages.map((stage, i) => {
            const isActive = i === selected;
            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={isActive}
                className={cx(
                  "w-full rounded-2xl p-5 text-left transition-colors duration-300",
                  isActive ? "bg-hero-950" : "bg-white/80 hover:bg-white",
                )}
              >
                <span
                  className={cx(
                    "text-xs font-bold tracking-widest",
                    isActive ? "text-accent-400" : "text-brand-600",
                  )}
                >
                  {stage.step}
                </span>
                <p
                  className={cx(
                    "mt-1 font-display text-base font-bold tracking-tight",
                    isActive ? "text-white" : "text-hero-950",
                  )}
                >
                  {stage.title}
                </p>
                <p
                  className={cx(
                    "mt-1 text-sm leading-relaxed",
                    isActive ? "text-white/70" : "text-muted",
                  )}
                >
                  {stage.summary}
                </p>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-subtle px-3 py-1 text-xs font-bold tracking-widest text-muted uppercase">
                {course.name}
              </span>
              <span className="shrink-0 rounded-full bg-subtle px-3 py-1 text-xs font-bold text-muted">
                {selected + 1}/{stages.length}
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-hero-950">
              {active.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {active.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-rose-50 p-8">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(37,99,235,0.15)_1px,transparent_1.5px)] [background-size:20px_20px]"
            />
            <div className="relative flex flex-wrap items-center justify-center gap-4">
              <span className="grid min-w-18 place-items-center rounded-2xl border-2 border-white bg-white px-3 py-3 text-center text-[10px] leading-tight font-bold tracking-wide text-hero-950 uppercase shadow-sm">
                {nodeLeft}
              </span>
              <span className="grid min-w-24 place-items-center rounded-3xl bg-brand-600 px-5 py-5 text-center text-xs leading-tight font-bold tracking-wide text-white uppercase shadow-lg">
                {nodeCenter}
              </span>
              <span className="grid min-w-18 place-items-center rounded-2xl border-2 border-white bg-white px-3 py-3 text-center text-[10px] leading-tight font-bold tracking-wide text-hero-950 uppercase shadow-sm">
                {nodeRight}
              </span>
            </div>
            <p className="relative mt-6 text-center text-xs font-bold tracking-[0.2em] text-muted uppercase">
              Learn / Build / Deploy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
