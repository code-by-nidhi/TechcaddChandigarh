"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { site } from "@/data/site";
import { trainingFormats, programDurations, programTracks } from "@/data/programs";
import { Icon, cx } from "@/components/ui";

const windows = [
  { id: "45-days", label: "A semester break (4–6 weeks)", formatSlug: `45-days-training-in-${site.citySlug}` },
  { id: "6-weeks", label: "University-mandated 6 weeks", formatSlug: `6-weeks-training-in-${site.citySlug}` },
  { id: "4-months", label: "One semester (4 months)", formatSlug: `4-months-training-in-${site.citySlug}` },
  { id: "6-months", label: "Final semester (6 months)", formatSlug: `6-months-training-in-${site.citySlug}` },
  { id: "9-months", label: "A full year, maximum depth", formatSlug: `9-months-training-in-${site.citySlug}` },
] as const;

const goals = [
  { id: "certificate", label: "Meet a university requirement", note: "Report, attendance and certificate in the format your college asks for." },
  { id: "internship", label: "Get real work experience", note: "Live client project with an internship experience letter." },
  { id: "job", label: "Get hired straight after", note: "Full syllabus, portfolio and placement drives." },
] as const;

export function TrainingMatcher() {
  const [window, setWindow] = useState<string>("");
  const [track, setTrack] = useState<string>("");
  const [goal, setGoal] = useState<string>("");

  const complete = Boolean(window && track && goal);

  const result = useMemo(() => {
    if (!complete) return null;

    const win = windows.find((w) => w.id === window)!;
    const format = trainingFormats.find((f) => f.slug === win.formatSlug)!;
    const trackRecord = programTracks.find((t) => t.id === track)!;

    // Map the available window onto the closest certificate program duration.
    const months = window === "9-months" ? 9 : window === "6-months" || window === "4-months" ? 6 : 3;
    const duration = programDurations.find((d) => d.months === months)!;

    const note =
      goal === "certificate"
        ? "This format is built against standard university training requirements, so the paperwork side is covered."
        : goal === "internship"
          ? months >= 6
            ? "At this length the internship and experience letter are included."
            : "Note: the internship letter needs a four-month window or longer. Consider extending if you can."
          : months >= 6
            ? "This is the format most students are placed from — full syllabus, live project and placement drives."
            : "For a job straight after, six months gives you the internship that makes a CV competitive. Three months works if you already have some experience.";

    return { format, duration, trackRecord, note };
  }, [window, track, goal, complete]);

  const card = "rounded-3xl border border-line bg-white p-8";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className={card}>
        <h2 className="font-display text-lg font-bold tracking-tight">Three questions</h2>

        <div className="mt-7 space-y-8">
          <Group
            legend="1. How much time do you have?"
            options={windows.map((w) => ({ id: w.id, label: w.label }))}
            value={window}
            onChange={setWindow}
            name="window"
          />

          <div>
            <p className="mb-2 text-sm font-semibold">2. Which technology?</p>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-line bg-white px-4 text-sm outline-none transition-colors focus:border-brand-600"
            >
              <option value="" disabled>
                Select a track
              </option>
              {programTracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <Group
            legend="3. What do you need out of it?"
            options={goals.map((g) => ({ id: g.id, label: g.label, note: g.note }))}
            value={goal}
            onChange={setGoal}
            name="goal"
          />
        </div>
      </div>

      <div className={cx(card, "lg:sticky lg:top-24 lg:self-start")}>
        {result ? (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Recommended format
            </p>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">
              {result.format.label} · {result.trackRecord.name}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{result.note}</p>

            <ul className="mt-7 space-y-2.5">
              {result.format.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span className="text-muted">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-2.5">
              <Link
                href={`/${result.format.slug}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                See this training format
                <Icon name="arrow-right" className="size-4" />
              </Link>
              <Link
                href={`/${result.duration.slug}-${result.trackRecord.id}-program-in-${site.citySlug}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-medium transition-colors hover:border-brand-600/30 hover:bg-brand-50"
              >
                {result.duration.label} {result.trackRecord.name} program
              </Link>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon name="compass" className="size-6" />
            </span>
            <p className="mt-5 font-display font-bold tracking-tight">
              Answer all three to see your match
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              We will suggest the training format and the certificate program that fit your window.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Group({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: { id: string; label: string; note?: string }[];
  value: string;
  onChange: (id: string) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-line px-4 py-3 text-sm transition-colors has-checked:border-brand-600 has-checked:bg-brand-50"
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="mt-0.5 size-4 accent-[var(--color-brand-600)]"
            />
            <span>
              <span className="block font-medium">{option.label}</span>
              {option.note ? (
                <span className="mt-0.5 block text-xs text-muted">{option.note}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
