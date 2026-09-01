import type { ReactNode } from "react";
import { Breadcrumbs, Eyebrow, Rail } from "./ui";
import { HeroReveal } from "./motion/Reveal";

/**
 * The navy banner every inner page opens with — keeps the hero gradient as the
 * one visual constant across the site.
 */
export function PageHeader({
  eyebrow,
  title,
  body,
  breadcrumbs,
  children,
  meta,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  meta?: { label: string; value: string }[];
}) {
  return (
    <section className="hero-surface relative isolate overflow-hidden pt-24 pb-16 text-white lg:pt-28 lg:pb-20">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.12]"
      >
        <defs>
          <pattern id="page-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0H0V56" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#page-grid)" />
      </svg>

      <HeroReveal className="rail">
        {breadcrumbs ? (
          <div data-hero-item>
            <Breadcrumbs items={breadcrumbs} onDark />
          </div>
        ) : null}
        {eyebrow ? (
          <div data-hero-item className={breadcrumbs ? "mt-6" : ""}>
            <Eyebrow onDark>{eyebrow}</Eyebrow>
          </div>
        ) : null}
        <h1 data-hero-item className="mt-6 max-w-4xl font-display text-3xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {body ? (
          <p data-hero-item className="mt-6 max-w-2xl leading-relaxed text-pretty text-brand-100/85 lg:text-lg">
            {body}
          </p>
        ) : null}

        {meta ? (
          <dl data-hero-item className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="text-[11px] font-bold uppercase tracking-widest text-brand-200/70">
                  {item.label}
                </dt>
                <dd className="mt-1.5 font-display text-lg font-bold tracking-tight">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {children ? (
          <div data-hero-item className="mt-9">
            {children}
          </div>
        ) : null}
      </HeroReveal>
    </section>
  );
}
