import type { ReactNode } from "react";
import { Breadcrumbs, Eyebrow, Rail, cx } from "./ui";
import { HeroReveal } from "./motion/Reveal";
import { breadcrumbListSchema } from "@/lib/schema";

/**
 * The navy banner every inner page opens with — keeps the hero gradient as the
 * one visual constant across the site.
 *
 * `align="center"` is for the long-form pages — a blog article and a CMS page —
 * whose body is a centred reading column. Left is the default because every
 * other page on the site is a full-width layout, and centring a heading over a
 * three-column grid would leave it floating away from what it introduces.
 */
export function PageHeader({
  eyebrow,
  title,
  body,
  breadcrumbs,
  children,
  meta,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  meta?: { label: string; value: string }[];
  align?: "left" | "center";
}) {
  const centered = align === "center";
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

      <HeroReveal className={cx("rail", centered && "text-center")}>
        {breadcrumbs ? (
          <div data-hero-item className={cx(centered && "flex justify-center")}>
            <Breadcrumbs items={breadcrumbs} onDark />
          </div>
        ) : null}
        {eyebrow ? (
          <div data-hero-item className={breadcrumbs ? "mt-6" : ""}>
            <Eyebrow onDark>{eyebrow}</Eyebrow>
          </div>
        ) : null}
        <h1
          data-hero-item
          className={cx(
            "mt-6 max-w-4xl font-display text-3xl leading-[1.1] font-extrabold tracking-tight text-balance wrap-anywhere sm:text-4xl lg:text-5xl",
            centered && "mx-auto",
          )}
        >
          {title}
        </h1>
        {body ? (
          <p
            data-hero-item
            className={cx(
              "mt-6 max-w-2xl leading-relaxed text-pretty wrap-anywhere text-brand-100/85 lg:text-lg",
              centered && "mx-auto",
            )}
          >
            {body}
          </p>
        ) : null}

        {meta ? (
          <dl
            data-hero-item
            className={cx(
              "mt-10 flex flex-wrap gap-x-10 gap-y-5",
              centered && "justify-center",
            )}
          >
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
          <div data-hero-item className={cx("mt-9", centered && "flex justify-center")}>
            {children}
          </div>
        ) : null}
      </HeroReveal>

      {breadcrumbs && breadcrumbs.length > 1 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbListSchema(breadcrumbs)),
          }}
        />
      ) : null}
    </section>
  );
}
