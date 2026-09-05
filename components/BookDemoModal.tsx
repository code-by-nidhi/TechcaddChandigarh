"use client";

import { useEffect, useState } from "react";
import { courses } from "@/data/courses";
import { Icon, cx } from "@/components/ui";
import { site } from "@/data/site";

/** Google's four-colour "G" mark. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function makeChallenge() {
  return {
    a: 1 + Math.floor(Math.random() * 9),
    b: 1 + Math.floor(Math.random() * 9),
  };
}

export function BookDemoModal({ onClose }: { onClose: () => void }) {
  const [challenge, setChallenge] = useState<{ a: number; b: number } | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    setChallenge(makeChallenge());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function refreshChallenge() {
    setChallenge(makeChallenge());
    setAnswer("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");

    if (phone.length !== 10) {
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
    "w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/60 focus:border-white/60";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a free demo"
      className="fade-up fixed inset-0 z-[100] overflow-y-auto bg-hero-950/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
      <div
        className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl shadow-[0_60px_120px_-40px_rgba(6,14,43,0.6)] sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative isolate overflow-hidden bg-hero-950 p-7 text-white lg:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="panel-dots absolute inset-0 opacity-60" />
            <div className="drift-slow absolute -top-16 -left-16 size-64 rounded-full bg-brand-500/20 blur-[100px]" />
          </div>

          <p className="relative font-display text-xl leading-snug font-bold tracking-tight text-balance">
            <span aria-hidden="true">👋</span> Still exploring? Let us help
          </p>
          <p className="relative mt-3 text-sm leading-relaxed text-white/65">
            Talk to a counsellor and we&rsquo;ll map the shortest route from where you are to the
            job you want.
          </p>

          <figure className="relative mt-7 rounded-2xl border border-white/12 bg-white/[0.05] p-5">
            <blockquote className="text-sm leading-relaxed font-medium text-balance text-white">
              &ldquo;AI is the new electricity for modern computing.&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-accent-400">
                <Icon name="sparkles" className="size-4" />
              </span>
              <span>
                <span className="block text-xs font-bold text-white">Jensen Huang</span>
                <span className="block text-[11px] text-white/55">CEO, NVIDIA Corporation</span>
              </span>
            </figcaption>
          </figure>

          <div className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
            <GoogleMark className="size-4" />
            <span className="text-xs font-semibold text-hero-950">Google Verified</span>
            <Icon name="check" className="size-3.5 text-brand-600" />
            <span className="flex items-center gap-0.5 text-accent-yellow">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" className="size-3" />
              ))}
            </span>
          </div>

          <p className="relative mt-6 text-xs leading-relaxed text-white/50">
            You can also share your requirements at{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              {site.contact.email}
            </a>
            , and our team will get back to you right away.
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-brand-600 to-violet-600 p-7 text-white lg:p-9">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 grid size-8 place-items-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
          >
            <Icon name="close" className="size-4" />
          </button>

          <h2 className="pr-8 font-display text-xl leading-snug font-bold tracking-tight text-balance">
            Tell us your goal. We&rsquo;ll code it into reality.
          </h2>

          {status === "sent" ? (
            <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-6 text-center">
              <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-white text-brand-600">
                <Icon name="check" className="size-6" />
              </span>
              <h3 className="mt-4 font-display font-bold">Request received</h3>
              <p className="mt-2 text-sm text-white/75">
                A counsellor will call you shortly to talk through your goal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
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
                <input name="name" required placeholder="Full Name*" className={field} />
              </label>

              <label className="block">
                <input
                  name="phone"
                  type="tel"
                  required
                  inputMode="numeric"
                  placeholder="Contact Number (10 Digits)*"
                  className={field}
                />
              </label>

              <div>
                <p className="text-xs font-semibold text-white/70">Security verification</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded-lg border border-white/20 bg-white/10 px-3.5 py-2 font-display text-sm font-bold">
                    {challenge ? `${challenge.a} + ${challenge.b} = ?` : "…"}
                  </span>
                  <button
                    type="button"
                    onClick={refreshChallenge}
                    aria-label="Get a new security question"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 text-white/80 transition-colors duration-200 hover:bg-white/10"
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
                <p role="alert" className="text-sm font-medium text-amber-200">
                  {error}
                </p>
              ) : null}

              <p className="flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-hero-950">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-hero-950 text-lime-400">
                  <Icon name="check" className="size-3" />
                </span>
                Expert response within 5 minutes.
              </p>

              <button
                type="submit"
                disabled={status === "sending" || !challenge}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:bg-brand-50 disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Submit"}
                <Icon name="arrow-right" className="size-4" />
              </button>
            </form>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
