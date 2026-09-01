"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui";

/**
 * Indicative monthly salary bands for the tricity market, expressed in rupees.
 * These are estimates built from local hiring conversations, not a survey —
 * the disclaimer under the result says so plainly.
 */
const roles = [
  { id: "data-analyst", label: "Data Analyst", base: [20000, 30000] },
  { id: "full-stack", label: "Full-Stack Developer", base: [22000, 35000] },
  { id: "ai-engineer", label: "AI / ML Engineer", base: [30000, 45000] },
  { id: "digital-marketer", label: "Digital Marketing Executive", base: [18000, 25000] },
  { id: "security-analyst", label: "Security Analyst", base: [25000, 38000] },
  { id: "devops", label: "DevOps / Cloud Engineer", base: [28000, 42000] },
  { id: "mobile-dev", label: "Mobile App Developer", base: [22000, 33000] },
  { id: "designer", label: "UI / Web Designer", base: [16000, 26000] },
] as const;

const experienceLevels = [
  { id: "fresher", label: "Fresher (0–1 yr)", multiplier: 1 },
  { id: "junior", label: "Junior (1–3 yrs)", multiplier: 1.8 },
  { id: "mid", label: "Mid (3–5 yrs)", multiplier: 2.9 },
  { id: "senior", label: "Senior (5+ yrs)", multiplier: 4.2 },
] as const;

const employers = [
  { id: "services", label: "IT services company", multiplier: 1 },
  { id: "product", label: "Product company", multiplier: 1.25 },
  { id: "startup", label: "Startup", multiplier: 1.1 },
  { id: "remote", label: "Remote, national company", multiplier: 1.5 },
] as const;

const portfolioBoost = [
  { id: "none", label: "No projects yet", multiplier: 0.9 },
  { id: "some", label: "A few course projects", multiplier: 1 },
  { id: "strong", label: "Deployed projects + internship", multiplier: 1.15 },
] as const;

const inr = (value: number) =>
  `₹${Math.round(value / 500) * 500 === 0 ? value : (Math.round(value / 500) * 500).toLocaleString("en-IN")}`;

export function SalaryEstimator() {
  const [role, setRole] = useState<string>(roles[0].id);
  const [experience, setExperience] = useState<string>(experienceLevels[0].id);
  const [employer, setEmployer] = useState<string>(employers[0].id);
  const [portfolio, setPortfolio] = useState<string>(portfolioBoost[1].id);

  const estimate = useMemo(() => {
    const r = roles.find((x) => x.id === role)!;
    const e = experienceLevels.find((x) => x.id === experience)!;
    const c = employers.find((x) => x.id === employer)!;
    const p = portfolioBoost.find((x) => x.id === portfolio)!;
    const factor = e.multiplier * c.multiplier * p.multiplier;
    return {
      low: r.base[0] * factor,
      high: r.base[1] * factor,
      annualLow: (r.base[0] * factor * 12) / 100000,
      annualHigh: (r.base[1] * factor * 12) / 100000,
      role: r.label,
    };
  }, [role, experience, employer, portfolio]);

  const field =
    "h-11 w-full cursor-pointer rounded-xl border border-line bg-white px-4 text-sm outline-none transition-colors focus:border-brand-600";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-line bg-white p-8">
        <h2 className="font-display text-lg font-bold tracking-tight">Your situation</h2>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Target role</span>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={field}>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Experience</span>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={field}
            >
              {experienceLevels.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Type of employer</span>
            <select value={employer} onChange={(e) => setEmployer(e.target.value)} className={field}>
              {employers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold">What can you show?</legend>
            <div className="grid gap-2">
              {portfolioBoost.map((p) => (
                <label
                  key={p.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm transition-colors has-checked:border-brand-600 has-checked:bg-brand-50"
                >
                  <input
                    type="radio"
                    name="portfolio"
                    value={p.id}
                    checked={portfolio === p.id}
                    onChange={() => setPortfolio(p.id)}
                    className="size-4 accent-[var(--color-brand-600)]"
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="hero-surface rounded-3xl p-8 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-200">
          Indicative range
        </p>
        <p className="mt-4 font-display text-3xl font-extrabold tracking-tight lg:text-4xl">
          {inr(estimate.low)} – {inr(estimate.high)}
        </p>
        <p className="mt-1.5 text-sm text-brand-100/70">per month, {estimate.role}</p>

        <p className="mt-6 font-display text-lg font-bold">
          ≈ {estimate.annualLow.toFixed(1)} – {estimate.annualHigh.toFixed(1)} LPA
        </p>

        <div className="mt-8 space-y-3 border-t border-white/15 pt-7 text-sm text-brand-100/75">
          <p className="flex gap-3">
            <Icon name="check" className="mt-0.5 size-4 shrink-0 text-accent-400" />
            Deployed projects and a real internship move candidates to the top of these ranges more
            reliably than an extra certificate does.
          </p>
          <p className="flex gap-3">
            <Icon name="check" className="mt-0.5 size-4 shrink-0 text-accent-400" />
            Remote roles for national companies consistently pay above the local band and are
            increasingly open to tricity candidates.
          </p>
        </div>

        <Link
          href="/contact#enquire"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-hero-950 transition-colors hover:bg-brand-50"
        >
          Plan a route to this role
          <Icon name="arrow-right" className="size-4" />
        </Link>

        <p className="mt-6 text-xs leading-relaxed text-brand-100/50">
          These are estimates drawn from local hiring conversations, not a formal salary survey.
          Treat them as a starting point for a discussion, not a promise.
        </p>
      </div>
    </div>
  );
}
