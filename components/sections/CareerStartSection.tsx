"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { courses } from "@/data/courses";
import { Icon, Rail, cx } from "@/components/ui";
import { site } from "@/data/site";

const steps = [
  "A senior career counsellor calls you back during office hours.",
  "They go through your background, your budget and where you want to end up — including whether a course is wrong for you.",
  "You get a course roadmap and a batch that fits your week, free, with no obligation to enrol.",
];

const trustStats = [
  { value: `${site.stats.alumni} students trained` },
  { value: `${site.stats.rating}★ on Google (${site.stats.reviews})` },
  { value: `Training since ${site.founded}` },
];

function makeChallenge() {
  return {
    a: 1 + Math.floor(Math.random() * 9),
    b: 1 + Math.floor(Math.random() * 9),
  };
}

function CaptchaForm() {
  const [challenge, setChallenge] = useState<{ a: number; b: number } | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    setChallenge(makeChallenge());
  }, []);

  function refreshChallenge() {
    setChallenge(makeChallenge());
    setAnswer("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");

    if (phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (challenge && Number(answer) !== challenge.a + challenge.b) {
      setError("That answer doesn't look right — try again.");
      refreshChallenge();
      return;
    }

    setError(null);
    setStatus("sending");
    // TODO: replace with the real submission endpoint.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("sent");
  }

  const field =
    "w-full border-0 border-b border-white/20 bg-transparent px-0 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus:border-accent-400";

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-8 text-center">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Icon name="check" className="size-6" />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-white">Request received</h3>
        <p className="mt-2 text-sm text-white/65">
          A counsellor will call you during office hours to build your training plan.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <label className="block">
        <input name="name" required placeholder="Full Name*" className={field} />
      </label>

      <label className="block">
        <div className="flex items-center gap-2 border-b border-white/20 focus-within:border-accent-400">
          <span className="flex shrink-0 items-center gap-1 py-2.5 text-xs font-semibold text-white/60">
            <span aria-hidden="true">🇮🇳</span> +91
          </span>
          <input
            name="phone"
            type="tel"
            required
            inputMode="numeric"
            placeholder="Mobile Number*"
            className="w-full border-0 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/45 focus:outline-none"
          />
        </div>
      </label>

      <label className="block">
        <input name="email" type="email" placeholder="Email Address" className={field} />
      </label>

      <label className="block">
        <select
          name="course"
          required
          defaultValue=""
          className={cx(field, "cursor-pointer appearance-none [&>option]:text-ink")}
        >
          <option value="" disabled>
            Select Your Course of Interest*
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <textarea
          name="message"
          rows={2}
          placeholder="Your Message / Career Goals"
          className={cx(field, "resize-y")}
        />
      </label>

      <div>
        <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">Security Check</p>
        <div className="mt-2.5 flex items-center gap-3">
          <span className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-display text-sm font-bold text-white">
            {challenge ? `${challenge.a} + ${challenge.b} = ?` : "…"}
          </span>
          <button
            type="button"
            onClick={refreshChallenge}
            aria-label="Get a new security question"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-colors duration-200 hover:border-white/40 hover:text-white"
          >
            <Icon name="refresh" className="size-4" />
          </button>
        </div>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          inputMode="numeric"
          required
          placeholder="Answer"
          className={cx(field, "mt-3")}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm font-medium text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending" || !challenge}
        className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-500 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit"}
        <Icon name="arrow-right" className="size-4" />
      </button>

      <p className="flex items-start gap-1.5 text-xs text-white/50">
        <Icon name="spark" className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
        A counsellor replies during office hours — {site.contact.hours}.
      </p>
    </form>
  );
}

export function CareerStartSection() {
  return (
    <section
      id="enquire"
      className="relative isolate scroll-mt-24 overflow-hidden bg-gradient-to-br from-[#050b1d] via-[#1e2761] to-[#0f2e6d] py-20 text-white lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="drift-slow absolute -top-24 -left-32 size-[30rem] rounded-full bg-brand-400/12 blur-[140px]" />
        <div className="drift-slow-reverse absolute -right-24 -bottom-24 size-[26rem] rounded-full bg-accent-400/10 blur-[130px]" />
      </div>

      <Rail className="relative">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl leading-[1.15] font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.5rem]">
              Take the first step towards{" "}
              <span className="text-accent-400">your IT career</span> with {site.shortName}{" "}
              {site.city}
            </h2>

            <p className="mt-9 font-display text-sm font-bold tracking-tight text-white">
              What happens next?
            </p>
            <ol className="mt-4 space-y-4">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-3.5">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-brand-600 font-mono text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-white/75">{step}</span>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-sm leading-relaxed text-white/65">
              Fill in the form and a counsellor will get back to you during office hours. You can
              also call{" "}
              <Link href={site.contact.phoneHref} className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                {site.contact.phone}
              </Link>{" "}
              or write to{" "}
              <Link href={`mailto:${site.contact.email}`} className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                {site.contact.email}
              </Link>
              .
            </p>

            <div className="mt-9 border-t border-white/10 pt-7">
              <p className="text-xs font-bold tracking-[0.15em] text-accent-400 uppercase">
                Trusted by learners across {site.state}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-white/70">
                {trustStats.map((stat) => (
                  <span key={stat.value}>{stat.value}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-7 backdrop-blur-md lg:p-9">
            <h3 className="font-display text-lg leading-snug font-bold tracking-tight text-balance text-white">
              Tell us your goal. We&rsquo;ll build the training around it.
            </h3>
            <div className="mt-7">
              <CaptchaForm />
            </div>
          </div>
        </div>
      </Rail>
    </section>
  );
}
