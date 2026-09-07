"use client";

import { useState } from "react";
import type { Course } from "@/data/courses";
import { site } from "@/data/site";
import { rupees } from "@/lib/routes";
import { Icon, cx } from "./ui";

export function CourseFaqSection({ course }: { course: Course }) {
  const [open, setOpen] = useState<number | null>(0);

  const feeAnswer = course.fee
    ? `The current fee is ${rupees(course.fee.offer)}, listed at ${rupees(course.fee.original)}. EMI options are available and there is no registration fee.`
    : "Fees vary by batch and any live offer running at the time — talk to a counsellor for the current number. There is no registration fee.";

  const items = [
    {
      q: `What is the duration of the ${course.name} program in ${site.city}?`,
      a: `techcadd runs ${course.name} over ${course.duration}. Weekday, evening and weekend batches cover the same syllabus, and 1-on-1 training is available if you would rather set your own pace.`,
    },
    {
      q: `What is the fee for the ${course.name} program in ${site.city}?`,
      a: feeAnswer,
    },
    {
      q: `Who can join the ${course.name} program?`,
      a: `${course.name} is built for people at several starting points — students, graduates and working professionals switching tracks. What matters more than your background is turning up consistently and finishing what each module asks you to build.`,
    },
    {
      q: `What jobs can I get after the ${course.name} program?`,
      a: `Graduates typically move into ${course.careers.join(", ")}. These are roles that keep appearing on ${site.city} job boards.`,
    },
    {
      q: `What salary can a fresher expect after this programme in ${site.city}?`,
      a: "Pay depends on the portfolio you can show more than the certificate alone. Use the free salary estimator for an honest range by role, experience and employer type rather than a brochure number.",
    },
    {
      q: `Is placement support available after the ${course.name} program?`,
      a: `No genuine institute can guarantee a job, and we will not tell you otherwise. What we do run is a placement cell: CV and portfolio review, mock interviews, aptitude practice and drives with our ${site.stats.partners} hiring partners, continuing after your course finishes until you are placed.`,
    },
    {
      q: "Which tools and software will I learn?",
      a: `You will work hands-on with ${course.tools.join(", ")}.`,
    },
    {
      q: "Will I get a certificate and internship letter?",
      a: "Yes. Every student finishes with an industry-recognised certificate and a documented internship on real work.",
    },
    {
      q: "Do you work on real projects or only theory?",
      a: "Real projects. You work on genuine client requirements under supervision — that is where your portfolio comes from, and it is the first thing an interviewer asks to see.",
    },
    {
      q: "Are weekend and evening batches available?",
      a: "Yes. Weekday, evening, weekend and 1-on-1 formats all run in parallel, so you can pick whichever fits your week.",
    },
  ] as const;

  const renderItem = (item: (typeof items)[number], i: number) => {
    const isOpen = open === i;
    return (
      <div
        key={item.q}
        className={cx(
          "rounded-2xl border p-5 transition-colors",
          isOpen ? "border-accent-yellow/40 bg-white/[0.06]" : "border-white/10",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(isOpen ? null : i)}
          aria-expanded={isOpen}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <span className="font-display text-sm font-bold text-white">{item.q}</span>
          <span
            className={cx(
              "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
              isOpen
                ? "border-accent-yellow bg-accent-yellow text-hero-950"
                : "border-white/30 text-white/70",
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
            <p className="text-sm leading-relaxed text-white/65">{item.a}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute -top-4 left-0 size-8 rounded-full border-2 border-brand-400/60"
      />
      <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 uppercase">
        Got questions?
      </span>
      <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white lg:text-4xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">{items.slice(0, 5).map((item, i) => renderItem(item, i))}</div>
        <div className="space-y-4">
          {items.slice(5, 10).map((item, i) => renderItem(item, i + 5))}
        </div>
      </div>
    </div>
  );
}
