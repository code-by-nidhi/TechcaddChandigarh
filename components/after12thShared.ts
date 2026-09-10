import type { Program } from "@/data/programs";

/**
 * Plain (non-"use client") helpers shared between server components
 * (`After12thSections.tsx`) and client components (`After12thInteractive.tsx`).
 * A Server Component cannot call a function imported from a "use client"
 * module directly — only render it as JSX — so this logic lives here instead.
 */

export function monthLabel(program: Program, stageIndex: number): string {
  const total = program.duration.months;
  const perStage = total / 3;
  const start = Math.round(stageIndex * perStage) + 1;
  const end = Math.round((stageIndex + 1) * perStage);
  return start === end ? `Month ${start}` : `Months ${start}–${end}`;
}

export const STAGE_THEMES = ["Foundations", "Core Skills & Practice", "Scaling & Capstone Project"];
