"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";

export function FutureCareerForm() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
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
      <div className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-4 text-emerald-700">
        <Icon name="check" className="size-5 shrink-0" />
        <span className="text-sm font-semibold">Thanks — a counsellor will call you shortly.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-md">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <input
          type="tel"
          inputMode="numeric"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your mobile number"
          className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand-400"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-hero-950 px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-hero-900 disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Sending…" : "Book Demo"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-center text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </form>
  );
}
