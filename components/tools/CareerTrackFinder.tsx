"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { courseSlug, courses, getCategory } from "@/data/courses";
import { Button, Icon, cx } from "@/components/ui";

interface Question {
  id: string;
  prompt: string;
  options: { label: string; hint?: string; weights: Record<string, number> }[];
}

/**
 * Weights map an answer onto course ids. The recommendation is simply the
 * highest-scoring course — deliberately transparent, so a counsellor can
 * explain the result rather than defend a black box.
 */
const questions: Question[] = [
  {
    id: "background",
    prompt: "Where are you starting from?",
    options: [
      {
        label: "No coding experience at all",
        hint: "School leaver, non-technical degree, or career change",
        weights: {
          "digital-marketing": 3,
          "data-analytics": 3,
          "web-designing": 2,
          "basic-computer": 1,
          python: 2,
        },
      },
      {
        label: "Some programming, still a beginner",
        hint: "You have written code for coursework",
        weights: { python: 3, "full-stack-development": 3, "data-analytics": 2, java: 2 },
      },
      {
        label: "Comfortable with a language",
        hint: "You can build something small on your own",
        weights: {
          "full-stack-development": 3,
          "mern-stack": 3,
          "machine-learning": 2,
          "cloud-computing": 2,
        },
      },
      {
        label: "Working professional adding a skill",
        hint: "You already have a technical job",
        weights: {
          "agentic-ai": 3,
          "generative-ai": 3,
          "cloud-computing": 3,
          "cyber-security": 2,
        },
      },
    ],
  },
  {
    id: "interest",
    prompt: "Which of these sounds most like the work you want?",
    options: [
      {
        label: "Building things people use",
        hint: "Websites, apps, products",
        weights: { "full-stack-development": 4, "mern-stack": 3, "flutter-app-development": 3 },
      },
      {
        label: "Finding answers in data",
        hint: "Reports, dashboards, models",
        weights: { "data-analytics": 4, "data-science": 4, "power-bi": 2 },
      },
      {
        label: "Working with AI systems",
        hint: "Models, agents, automation",
        weights: { "artificial-intelligence": 4, "generative-ai": 3, "agentic-ai": 3 },
      },
      {
        label: "Growing an audience or a business",
        hint: "Campaigns, SEO, content",
        weights: { "digital-marketing": 4, seo: 2, "ai-powered-marketing": 3 },
      },
    ],
  },
  {
    id: "time",
    prompt: "How much time can you give this?",
    options: [
      {
        label: "A few weeks",
        hint: "Semester break or evenings",
        weights: {
          "prompt-engineering": 3,
          "chatgpt-ai-tools": 3,
          "power-bi": 2,
          wordpress: 2,
          seo: 2,
        },
      },
      {
        label: "Two to three months",
        hint: "A focused certificate",
        weights: { python: 3, "data-analytics": 3, "generative-ai": 2, "web-development": 2 },
      },
      {
        label: "Six months",
        hint: "Full syllabus with an internship",
        weights: {
          "full-stack-development": 4,
          "data-science": 3,
          "cyber-security": 3,
          "cloud-computing": 2,
        },
      },
      {
        label: "Nine months or more",
        hint: "Maximum depth before a first job",
        weights: {
          "full-stack-development": 3,
          "artificial-intelligence": 4,
          "cyber-security": 3,
          "data-science": 3,
        },
      },
    ],
  },
  {
    id: "outcome",
    prompt: "What matters most in the first job you take?",
    options: [
      {
        label: "Getting hired quickly",
        weights: { "data-analytics": 3, "digital-marketing": 3, "full-stack-development": 2, tally: 1 },
      },
      {
        label: "The highest ceiling long term",
        weights: { "artificial-intelligence": 4, "agentic-ai": 3, "data-science": 3, "cloud-computing": 2 },
      },
      {
        label: "Freelance or my own business",
        weights: { "digital-marketing": 3, wordpress: 3, shopify: 3, "web-designing": 2 },
      },
      {
        label: "Job security and demand",
        weights: { "cyber-security": 4, "cloud-computing": 3, "data-analytics": 2, java: 2 },
      },
    ],
  },
];

export function CareerTrackFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));

  const done = step >= questions.length;

  const results = useMemo(() => {
    if (!done) return [];
    const scores = new Map<string, number>();
    answers.forEach((choice, i) => {
      if (choice === null) return;
      const weights = questions[i].options[choice].weights;
      for (const [id, weight] of Object.entries(weights)) {
        scores.set(id, (scores.get(id) ?? 0) + weight);
      }
    });
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, score]) => ({ course: courses.find((c) => c.id === id)!, score }))
      .filter((r) => r.course);
  }, [answers, done]);

  function choose(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);
    setStep(step + 1);
  }

  function reset() {
    setAnswers(questions.map(() => null));
    setStep(0);
  }

  if (done) {
    const [top, ...rest] = results;
    return (
      <div className="rounded-3xl border border-line bg-white p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
          Your recommended track
        </p>
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight lg:text-3xl">
          {top.course.name}
        </h2>
        <p className="mt-4 leading-relaxed text-muted">{top.course.summary}</p>

        <dl className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-subtle p-5">
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">Duration</dt>
            <dd className="mt-1.5 font-display font-bold">{top.course.duration}</dd>
          </div>
          <div className="rounded-xl border border-line bg-subtle p-5">
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">Level</dt>
            <dd className="mt-1.5 font-display font-bold">{top.course.level}</dd>
          </div>
          <div className="rounded-xl border border-line bg-subtle p-5">
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">Track</dt>
            <dd className="mt-1.5 font-display font-bold">
              {getCategory(top.course.category).short}
            </dd>
          </div>
        </dl>

        <div className="mt-7">
          <p className="text-sm font-semibold">A good first project on this track</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {top.course.outcomes[0]}. Start there — it is the outcome employers ask about first.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${courseSlug(top.course.id)}`}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            See the full syllabus
            <Icon name="arrow-right" className="size-4" />
          </Link>
          <Link
            href="/contact#enquire"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium transition-colors hover:border-brand-600/30 hover:bg-brand-50"
          >
            Discuss with a counsellor
          </Link>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium text-muted transition-colors hover:text-brand-600"
          >
            <Icon name="arrow-right" className="size-4 rotate-180" />
            Start over
          </button>
        </div>

        {rest.length ? (
          <div className="mt-10 border-t border-line pt-8">
            <p className="text-sm font-semibold">Also worth considering</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {rest.map(({ course }) => (
                <Link
                  key={course.id}
                  href={`/${courseSlug(course.id)}`}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-line px-5 py-4 transition-colors hover:border-brand-600/30 hover:bg-brand-50/40"
                >
                  <span>
                    <span className="block text-sm font-medium">{course.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">{course.duration}</span>
                  </span>
                  <Icon
                    name="arrow-right"
                    className="size-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600"
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const question = questions[step];

  return (
    <div className="rounded-3xl border border-line bg-white p-8 lg:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
          Question {step + 1} of {questions.length}
        </p>
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-brand-600"
          >
            <Icon name="arrow-right" className="size-3.5 rotate-180" />
            Back
          </button>
        ) : null}
      </div>

      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
      >
        <span
          className="block h-full rounded-full bg-brand-600 transition-all duration-500"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h2 className="mt-7 font-display text-xl font-bold tracking-tight lg:text-2xl">
        {question.prompt}
      </h2>

      <div className="mt-7 grid gap-3">
        {question.options.map((option, i) => (
          <button
            key={option.label}
            type="button"
            onClick={() => choose(i)}
            className={cx(
              "group flex items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-colors",
              answers[step] === i
                ? "border-brand-600 bg-brand-50"
                : "border-line hover:border-brand-600/40 hover:bg-brand-50/50",
            )}
          >
            <span>
              <span className="block font-medium">{option.label}</span>
              {option.hint ? (
                <span className="mt-0.5 block text-xs text-muted">{option.hint}</span>
              ) : null}
            </span>
            <Icon
              name="arrow-right"
              className="size-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600"
            />
          </button>
        ))}
      </div>

      {step > 0 ? (
        <Button variant="ghost" size="sm" className="mt-6" onClick={reset}>
          Start over
        </Button>
      ) : null}
    </div>
  );
}
