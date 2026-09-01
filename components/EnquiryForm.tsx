"use client";

import { useState } from "react";
import { courses } from "@/data/courses";
import { branches } from "@/data/branches";
import { Button, Icon, cx } from "./ui";

/**
 * Front-end only. Wire `onSubmit` to the CRM or an API route when the backend
 * is ready — the success state below is what the user sees either way.
 */
export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");

    if (phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError(null);
    setStatus("sending");
    // TODO: replace with the real submission endpoint.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-50 p-8 text-center">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Icon name="check" className="size-6" />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold">Request received</h3>
        <p className="mt-2 text-sm text-muted">
          A counsellor will call you within one working day to schedule your free demo class.
        </p>
      </div>
    );
  }

  const field =
    "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-brand-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className={cx("grid gap-4", !compact && "sm:grid-cols-2")}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Full name</span>
          <input name="name" required placeholder="Your name" className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Mobile number</span>
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

      {!compact ? (
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">
            Email <span className="font-normal text-muted">(optional)</span>
          </span>
          <input name="email" type="email" placeholder="you@example.com" className={field} />
        </label>
      ) : null}

      <div className={cx("grid gap-4", !compact && "sm:grid-cols-2")}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">
            Course of interest
          </span>
          <select name="course" defaultValue="" className={cx(field, "cursor-pointer")}>
            <option value="" disabled>
              Select a course
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
            <option value="not-sure">Not sure yet — please advise</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Nearest centre</span>
          <select name="branch" defaultValue={branches[0].slug} className={cx(field, "cursor-pointer")}>
            {branches.map((branch) => (
              <option key={branch.slug} value={branch.slug}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!compact ? (
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">
            Message <span className="font-normal text-muted">(optional)</span>
          </span>
          <textarea
            name="message"
            rows={3}
            placeholder="Tell us about your background and what you want to learn."
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-brand-600"
          />
        </label>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Book my free demo"}
        <Icon name="arrow-right" className="size-4" />
      </Button>

      <p className="text-center text-xs text-muted">
        No registration fee. We will never share your number.
      </p>
    </form>
  );
}

/** Single-field variant used in the closing call-to-action band. */
export function QuickDemoForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  return status === "sent" ? (
    <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-medium text-white ring-1 ring-inset ring-white/20">
      <Icon name="check" className="size-4" />
      Thanks — a counsellor will call you shortly.
    </p>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("sent");
      }}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <label className="sr-only" htmlFor="quick-phone">
        Mobile number
      </label>
      <input
        id="quick-phone"
        name="phone"
        type="tel"
        required
        inputMode="numeric"
        placeholder="Enter your mobile number"
        className="h-13 flex-1 rounded-full border border-white/25 bg-white/10 px-6 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-brand-100/60 focus:border-white/60"
      />
      <Button type="submit" variant="onDark" size="lg" className="shrink-0">
        Book Demo
        <Icon name="arrow-right" className="size-4" />
      </Button>
    </form>
  );
}
