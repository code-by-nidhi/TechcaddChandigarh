import Link from "next/link";
import { site } from "@/data/site";
import { heroStats, trustPoints } from "@/data/content";
import { courseSlug } from "@/data/courses";
import { ButtonLink, Icon, Stat } from "@/components/ui";

export function Hero() {
  return (
    <section className="hero-surface relative isolate overflow-hidden pt-24 pb-16 text-white lg:pt-28 lg:pb-24">
      {/* Faint grid, drawn rather than imported */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.15]"
      >
        <defs>
          <pattern id="hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0H0V56" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      <div className="rail">
        <p className="fade-up inline-flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pr-4 pl-1.5 text-xs font-medium ring-1 ring-inset ring-white/15 backdrop-blur-sm">
          <span className="rounded-full bg-accent-400 px-2.5 py-1 text-[11px] font-bold text-hero-950">
            NEW
          </span>
          Agentic AI &amp; Generative AI batches now open in {site.city}
        </p>

        <h1 className="fade-up mt-8 max-w-4xl font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-[4rem]">
          Build the skills that turn you into a{" "}
          <span className="relative whitespace-nowrap">
            <span className="relative z-10 text-accent-400">job-ready engineer</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 320 12"
              className="absolute -bottom-1 left-0 h-2.5 w-full text-accent-glow/50"
              preserveAspectRatio="none"
            >
              <path
                d="M2 9c60-6 120-8 316-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          in AI &amp; software engineering
        </h1>

        <p className="fade-up mt-7 max-w-2xl text-base leading-relaxed text-pretty text-brand-100/85 lg:text-lg">
          Students learn AI, cloud and full-stack systems with industry mentors, hands-on projects
          and {site.stats.partners} hiring partners. Training in {site.city} since {site.founded}.
        </p>

        <div className="fade-up mt-9 flex flex-wrap items-center gap-4">
          <ButtonLink href="/contact#enquire" variant="onDark" size="lg">
            Start your career
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
          <ButtonLink href="/courses" variant="onDarkGhost" size="lg">
            Explore courses
          </ButtonLink>
        </div>

        <ul className="fade-up mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-brand-100/75">
          {trustPoints.map((point) => (
            <li key={point} className="inline-flex items-center gap-2">
              <Icon name="check" className="size-4 text-accent-400" />
              {point}
            </li>
          ))}
        </ul>

        <div className="fade-up mt-14 grid gap-4 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} onDark />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Category orbit strip --------------------------- */

const orbits = [
  {
    title: "Artificial Intelligence",
    body: "Generative AI, agents and machine learning built on real projects.",
    href: `/${courseSlug("artificial-intelligence")}`,
    icon: "sparkles",
  },
  {
    title: "Full-Stack Development",
    body: "Front-end, back-end and deployment — ship complete products.",
    href: `/${courseSlug("full-stack-development")}`,
    icon: "layers",
  },
  {
    title: "Data Science",
    body: "Statistics, SQL and modelling for analyst and scientist roles.",
    href: `/${courseSlug("data-science")}`,
    icon: "target",
  },
  {
    title: "Cyber Security",
    body: "Offensive and defensive security in isolated lab ranges.",
    href: `/${courseSlug("cyber-security")}`,
    icon: "shield",
  },
];

export function OrbitStrip() {
  return (
    <section className="rail grid grid-cols-2 gap-x-4 gap-y-10 py-20 sm:gap-x-8 lg:grid-cols-4">
      {orbits.map((orbit) => (
        <Link key={orbit.title} href={orbit.href} className="group mx-auto w-full max-w-[13rem]">
          <span className="relative grid aspect-square w-full place-items-center rounded-full border border-line bg-subtle p-6 text-center transition-all duration-500 group-hover:border-brand-600/30 group-hover:bg-brand-50">
            <span className="absolute inset-3 rounded-full border border-dashed border-line transition-colors duration-500 group-hover:border-brand-300" />
            <span className="relative">
              <Icon name={orbit.icon} className="mx-auto size-7 text-brand-600" />
              <span className="mt-3 block font-display text-sm font-bold tracking-tight">
                {orbit.title}
              </span>
            </span>
          </span>
          <span className="mt-4 block text-center text-xs leading-relaxed text-muted">
            {orbit.body}
          </span>
        </Link>
      ))}
    </section>
  );
}
