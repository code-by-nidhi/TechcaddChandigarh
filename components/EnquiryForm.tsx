"use client";

import { useState } from "react";
import { useCourseOptions } from "@/components/CatalogueProvider";
import { branches } from "@/data/branches";
import { isValidPhone, submitEnquiry, type EnquiryFormType } from "@/lib/enquiry";
import { Button, Icon, cx } from "./ui";

/** Posts to `/api/enquiry`, which writes the lead to MySQL. */
export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const courses = useCourseOptions();
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

    const result = await submitEnquiry({
      formType: "enquiry-form",
      name: String(data.get("name") ?? ""),
      phone,
      email: String(data.get("email") ?? ""),
      course: String(data.get("course") ?? ""),
      branch: String(data.get("branch") ?? ""),
      message: String(data.get("message") ?? ""),
    });

    if (!result.ok) {
      setError(result.error);
      setStatus("idle");
      return;
    }

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

/**
 * The phone-only forms collect nothing else, so they share one handler — the
 * two exported variants differ only in how they are styled.
 */
function useQuickDemo(formType: EnquiryFormType) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phone = String(new FormData(event.currentTarget).get("phone") ?? "");

    if (!isValidPhone(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError(null);
    setStatus("sending");

    const result = await submitEnquiry({ formType, phone });
    if (!result.ok) {
      setError(result.error);
      setStatus("idle");
      return;
    }

    setStatus("sent");
  }

  return { status, error, handleSubmit };
}

/** Single-field variant used in the closing call-to-action band. */
export function QuickDemoForm() {
  const { status, error, handleSubmit } = useQuickDemo("quick-demo");

  return status === "sent" ? (
    <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-medium text-white ring-1 ring-inset ring-white/20">
      <Icon name="check" className="size-4" />
      Thanks — a counsellor will call you shortly.
    </p>
  ) : (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
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
        <Button type="submit" variant="onDark" size="lg" className="shrink-0" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Book Demo"}
          <Icon name="arrow-right" className="size-4" />
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-200">
          {error}
        </p>
      ) : null}
    </form>
  );
}

/** Same single-field form as `QuickDemoForm`, styled for a light background. */
export function QuickDemoFormLight() {
  const { status, error, handleSubmit } = useQuickDemo("quick-demo");

  return status === "sent" ? (
    <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-5 py-3 text-sm font-medium text-brand-700 ring-1 ring-inset ring-brand-600/15">
      <Icon name="check" className="size-4" />
      Thanks — a counsellor will call you shortly.
    </p>
  ) : (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="quick-phone-light">
          Mobile number
        </label>
        <input
          id="quick-phone-light"
          name="phone"
          type="tel"
          required
          inputMode="numeric"
          placeholder="Your mobile number"
          className="h-13 flex-1 rounded-full border border-line bg-white px-6 text-sm text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-brand-600"
        />
        <Button type="submit" size="lg" className="shrink-0" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Book Demo"}
          <Icon name="arrow-right" className="size-4" />
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </form>
  );
}
