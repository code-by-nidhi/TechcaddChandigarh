"use client";

import { useEffect, useState } from "react";
import type { Course } from "@/data/courses";
import { submitEnquiry } from "@/lib/enquiry";
import { Icon, Rail, cx } from "./ui";

const randomOperand = () => Math.floor(Math.random() * 8) + 2;

const CHECKLIST = [
  "Free counselling and demo class",
  "Weekday, evening, weekend or 1-on-1, all 2-hour classes",
  "Internship letter and placement support",
];

export function CourseEnquirySection({ course }: { course: Course }) {
  // Fixed on the server, randomised after mount — avoids a hydration
  // mismatch between the server-rendered sum and the client's Math.random().
  const [captcha, setCaptcha] = useState({ a: 2, b: 3 });
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCaptcha({ a: randomOperand(), b: randomOperand() });
  }, []);

  function refreshCaptcha() {
    setCaptcha({ a: randomOperand(), b: randomOperand() });
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
    if (Number(answer) !== captcha.a + captcha.b) {
      setError("That answer doesn't look right — please try the new sum.");
      refreshCaptcha();
      return;
    }

    setError(null);
    setStatus("sending");

    const result = await submitEnquiry({
      formType: "enquiry-form",
      name: String(data.get("name") ?? ""),
      phone,
      course: course.name,
      message: String(data.get("message") ?? ""),
    });

    if (!result.ok) {
      setError(result.error);
      setStatus("idle");
      refreshCaptcha();
      return;
    }

    setStatus("sent");
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent-400";

  return (
    <section className="hero-surface relative overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-15 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1.5px)] [background-size:26px_26px]"
      />
      <Rail>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute -top-8 -left-2 hidden size-9 rounded-full border-2 border-white/30 sm:block"
            />
            <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-white/80 uppercase">
              Course information
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Ask about {course.name}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/65">
              Send your question and a counsellor will call you back about batch timings, fees,
              EMI options, placement record, or whether this course fits your background.
            </p>
            <ul className="mt-6 space-y-3">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-accent-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm lg:p-8">
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-emerald-500 text-white">
                  <Icon name="check" className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">Message sent</h3>
                <p className="mt-2 text-sm text-white/65">
                  A counsellor will call you within working hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-white/80">
                      Your Name
                    </span>
                    <input name="name" required placeholder="Enter your full name" className={field} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-white/80">
                      Phone Number
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      required
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      className={field}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-white/80">
                    Course or Service
                  </span>
                  <input
                    name="course"
                    readOnly
                    value={course.name}
                    className={cx(field, "cursor-not-allowed text-white/80")}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-white/80">
                    Your Message
                  </span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Ask about batch timings, fees or anything else"
                    className={cx(field, "resize-y")}
                  />
                </label>

                <div>
                  <span className="mb-1.5 block text-xs font-semibold text-white/80">
                    Security Check
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-bold text-white">
                      {captcha.a} + {captcha.b} = ?
                    </span>
                    <input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      inputMode="numeric"
                      placeholder="Answer"
                      required
                      className={cx(field, "flex-1")}
                    />
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      aria-label="Get a new sum"
                      className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white"
                    >
                      <Icon name="refresh" className="size-4" />
                    </button>
                  </div>
                </div>

                {error ? (
                  <p role="alert" className="text-sm font-medium text-red-300">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 py-3.5 text-sm font-bold tracking-wide text-white uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>

                <p className="text-center text-xs text-white/50">
                  We never share your number. Expect a call within working hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </Rail>
    </section>
  );
}
