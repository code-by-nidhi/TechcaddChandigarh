import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Eyebrow, Icon, Rail, SectionHeading } from "@/components/ui";
import { HeroReveal } from "@/components/motion/Reveal";
import { SupportDesks } from "@/components/sections/SupportDesks";
import { CareerStartSection } from "@/components/sections/CareerStartSection";
import { TrainingHighlights } from "@/components/sections/TrainingHighlights";
import { LocationContact } from "@/components/sections/LocationContact";
import { site } from "@/data/site";
import { branches } from "@/data/branches";

export const metadata: Metadata = {
  title: `Contact — Book a Free Demo Class in ${site.city}`,
  description: `Call ${site.contact.phone}, email ${site.contact.email}, or visit our ${site.city} campus. Free career counselling with no obligation to enrol.`,
  alternates: { canonical: `${site.url}/contact` },
};

export default function ContactPage() {
  return (
    <>
      {/* --------------------------------------- Hero --------------------------------------- */}
      <section className="hero-surface relative isolate flex min-h-screen flex-col justify-center overflow-hidden pt-28 pb-20 text-white lg:pt-32 lg:pb-24">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.12]"
        >
          <defs>
            <pattern id="contact-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-grid)" />
        </svg>

        {/* circuit-style accent lines */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.35]"
          preserveAspectRatio="none"
          viewBox="0 0 1600 620"
        >
          <path
            d="M900 140 L1120 140 L1200 210 L1370 210"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M1240 280 L1240 350 L1470 350 L1560 430"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M830 395 L970 395 L970 465 L1180 465 L1180 555 L1350 555"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M1580 555 L1450 555 L1450 620"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          {[
            [900, 140],
            [1120, 140],
            [1370, 210],
            [1240, 280],
            [1470, 350],
            [1560, 430],
            [830, 395],
            [970, 465],
            [1180, 555],
            [1350, 555],
            [1580, 555],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="white" />
          ))}
        </svg>

        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute top-8 left-8 size-16 rounded-full border border-white/25"
        />

        <HeroReveal className="rail relative">
          <div data-hero-item>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} onDark />
          </div>
          <div data-hero-item className="mt-8">
            <Eyebrow onDark>Contact</Eyebrow>
          </div>
          <h1
            data-hero-item
            className="mt-8 max-w-4xl font-display text-4xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {`Talk to a counsellor in ${site.city}`}
          </h1>
          <p
            data-hero-item
            className="mt-8 max-w-2xl leading-relaxed text-pretty text-brand-100/85 lg:text-lg"
          >
            Tell us where you are: 12th pass, mid-degree, working, or running a business. We will
            tell you honestly which track fits and which does not.
          </p>
          <div data-hero-item className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/contact#enquire"
              className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-6 text-sm font-semibold text-hero-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book a free demo class
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-colors duration-300 group-hover:bg-brand-700">
                <Icon name="arrow-right" className="size-4" />
              </span>
            </Link>
            <a
              href={site.contact.phoneHref}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/50 hover:bg-white/10"
            >
              Call {site.contact.phone}
            </a>
          </div>
        </HeroReveal>
      </section>

      <SupportDesks />

      <CareerStartSection />

      <TrainingHighlights />

      <LocationContact />

      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="All centres"
            title="Prefer a campus closer to you?"
            body="Every centre runs the same syllabus and the same placement process."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <Link
                key={branch.slug}
                href={`/branches/${branch.slug}`}
                className="group card-hover rounded-2xl border border-line bg-white p-6 transition-colors duration-300 hover:border-brand-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon name="map-pin" className="size-4.5" />
                  </span>
                  {branch.isHead ? (
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                      Head
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 font-display font-bold tracking-tight">{branch.name}</h3>
                <p className="mt-2.5 text-sm text-muted">{branch.address}</p>
                <p className="mt-4 text-sm font-medium text-brand-600">{branch.phone}</p>
              </Link>
            ))}
          </div>
        </Rail>
      </section>
    </>
  );
}
