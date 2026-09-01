import Link from "next/link";
import { site } from "@/data/site";
import { courseSlug } from "@/data/courses";
import { ButtonLink, Icon } from "@/components/ui";
import { HeroReveal, Reveal } from "@/components/motion/Reveal";
import { HeroCircuit } from "./HeroCircuit";

export function Hero() {
  return (
    /**
     * Locked to one viewport. `svh` rather than `vh` so a mobile browser's
     * collapsing address bar cannot push the section past the fold. The bottom
     * padding reserves the band the circuit hub sits in, so the artwork and the
     * copy never land on top of each other.
     */
    <section className="hero-surface relative isolate flex h-[100svh] max-h-[100svh] flex-col justify-center overflow-hidden pt-[clamp(5rem,11vh,7rem)] pb-[clamp(8rem,24vh,15rem)] text-white">
      <HeroCircuit className="pointer-events-none absolute inset-0 -z-10 size-full opacity-40 sm:opacity-75 lg:opacity-100" />

      <div className="rail">
        <HeroReveal className="mx-auto max-w-2xl text-center">
          <p
            data-hero-item
            className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3.5 pl-1 text-[11px] font-medium ring-1 ring-inset ring-white/15 backdrop-blur-sm"
          >
            <span className="rounded-full bg-accent-yellow px-2 py-0.5 text-[10px] font-bold text-hero-950">
              NEW
            </span>
            Agentic AI &amp; Generative AI batches now open in {site.city}
          </p>

          <h1
            data-hero-item
            className="mt-6 font-display text-[min(1.75rem,4.6vh)] leading-[1.12] font-extrabold tracking-tight text-balance sm:text-[min(2.25rem,5vh)] lg:text-[min(2.5rem,5.4vh)]"
          >
            Build the skills that turn you into a{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-accent-yellow">job-ready engineer</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 320 12"
                className="absolute -bottom-0.5 left-0 h-2 w-full text-accent-yellow/45"
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

          <p
            data-hero-item
            className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-pretty text-brand-100/85 lg:text-base"
          >
            Students learn AI, cloud and full-stack systems with industry mentors, hands-on projects
            and <span className="font-semibold text-accent-yellow">{site.stats.partners} hiring partners</span>. Training in {site.city} since{" "}
            {site.founded}.
          </p>

          <div data-hero-item className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/contact#enquire" variant="onDark" size="md">
              Start your career
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/courses" variant="onDarkGhost" size="md">
              Explore courses
            </ButtonLink>
          </div>
        </HeroReveal>
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
    <Reveal as="section" stagger className="rail grid grid-cols-2 gap-x-4 gap-y-10 py-20 sm:gap-x-8 lg:grid-cols-4">
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
    </Reveal>
  );
}
