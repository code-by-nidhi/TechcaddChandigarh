import { site } from "@/data/site";
import { ButtonLink, Icon } from "@/components/ui";
import { HeroReveal } from "@/components/motion/Reveal";
import { HeroCircuit } from "./HeroCircuit";

export function Hero() {
  return (
    /**
     * One viewport on desktop, `min-h` below it. The hard lock pairs with
     * `overflow-hidden`, so on a short phone the badge, headline, both
     * paragraphs and the buttons would be silently clipped rather than
     * scrolled — `min-h` lets the stack grow instead. `svh` rather than `vh`
     * so a collapsing address bar cannot push the section past the fold, and
     * the bottom padding reserves the band the circuit hub sits in.
     */
    <section className="hero-surface relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-[clamp(5rem,11vh,7rem)] pb-[clamp(6rem,24vh,15rem)] text-white lg:h-[100svh] lg:max-h-[100svh]">
      <HeroCircuit className="pointer-events-none absolute inset-0 -z-10 size-full opacity-40 sm:opacity-75 lg:opacity-100" />

      <div className="rail">
        <HeroReveal className="mx-auto max-w-3xl text-center">
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
            Build Skills. Build Projects.{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-accent-yellow">Build Your Career.</span>
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
            </span>
          </h1>

          <p
            data-hero-item
            className="mx-auto mt-5 max-w-xl text-sm font-medium leading-relaxed text-pretty text-brand-100 lg:text-base"
          >
            Learn the technologies shaping tomorrow. Build real projects. Become industry-ready.
          </p>

          <p
            data-hero-item
            className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-pretty text-brand-100/70 lg:text-sm"
          >
            At techcadd, we turn technology learning into practical career skills through
            industry-oriented training, hands-on projects, expert mentorship, and career-focused
            support.
          </p>

          <div data-hero-item className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/courses" variant="onDark" size="md">
              Explore Courses
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/contact#enquire" variant="onDarkGhost" size="md">
              Book a Free Demo
            </ButtonLink>
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
