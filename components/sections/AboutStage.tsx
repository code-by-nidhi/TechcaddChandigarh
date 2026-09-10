"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { aboutSlides, aboutStats } from "@/data/content";
import { ButtonLink, cx, Icon, Rail } from "@/components/ui";
import { CountUp } from "@/components/motion/Reveal";

/** How long each phase holds before the headline and photos advance. */
const HOLD_MS = 4200;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * About section, built as a slideshow rather than a static block.
 *
 * One timer drives three things at once — the headline's closing word, the two
 * photo slots and the caption — so the section reads as a sequence of phases
 * instead of a wall of copy. The photo slots are offset by one slide so both
 * visibly change on every tick from a single list of images.
 *
 * Slides are stacked absolutely and crossfaded on opacity, which keeps the
 * layout still while the images swap and lets the browser hold all of them
 * decoded. A visitor who has asked for reduced motion gets the first slide,
 * held, with no timer running at all.
 */
export function AboutStage() {
  const [active, setActive] = useState(0);

  /**
   * `active` is a dependency so the timer restarts whenever the slide changes —
   * clicking a dot then gets a full hold rather than the remainder of the tick
   * that was already running.
   */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % aboutSlides.length),
      HOLD_MS,
    );
    return () => window.clearTimeout(id);
  }, [active]);

  /* The right-hand frame runs one slide ahead so the two photos never match. */
  const trailing = (active + 1) % aboutSlides.length;

  return (
    /**
     * Locked to one viewport only where there is genuinely room for it — see
     * the `roomy` variant in globals.css. The lock pairs with `overflow-hidden`,
     * so on a short laptop or phone the headline, points, frame and buttons
     * would be clipped rather than scrolled; `min-h` lets the stack grow there
     * instead. `svh` rather than `vh` so a collapsing address bar cannot push
     * the section past the fold.
     */
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 lg:py-14 roomy:h-[100svh] roomy:max-h-[100svh]">
      <Rail className="flex flex-col gap-8 lg:min-h-0 lg:flex-1 lg:gap-6">
        {/* `min-h-0` lets this row shrink below its content so the frames, not
            the section, absorb whatever height is left over. */}
        <div className="grid gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          {/* ------------------------------ Left column ----------------------------- */}
          <div className="flex flex-col lg:min-h-0 lg:justify-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              We Are Committed To
              <span className="mt-2 block overflow-hidden">
                {/*
                  Sized so the longest phrase — "Building the Future" — stays on
                  one line in the narrower left column, with `nowrap` to hold
                  that. A wrap here changed the column's height between slides,
                  which is what made the frame below jump. The clamp keeps it
                  fluid below `lg`, where the column runs full width.

                  Keyed on the index so React remounts the span and the
                  entrance replays.
                */}
                <span
                  key={active}
                  className="about-word block whitespace-nowrap bg-gradient-to-r from-brand-700 via-brand-500 to-accent-500 bg-clip-text text-[clamp(1.25rem,6.2vw,2.75rem)] font-bold uppercase tracking-tight text-transparent lg:text-[2.25rem] xl:text-[3rem]"
                >
                  {aboutSlides[active].word}
                </span>
              </span>
            </h2>

            {/*
              The points replace the generic intro paragraph that used to sit
              here: they do the same job of supporting the headline, but change
              with the slide. Reclaiming that height also keeps the frame below
              from collapsing on a short laptop, since it absorbs the slack.

              Keyed on the slide so the list remounts and the stagger replays.
            */}
            <ul key={active} className="mt-6 space-y-2.5">
              {aboutSlides[active].points.map((point, i) => (
                <li
                  key={point}
                  className="about-point flex gap-2.5 text-sm leading-relaxed text-muted"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <Icon
                    name="check"
                    className="mt-0.5 size-4 shrink-0 text-brand-600"
                  />
                  {point}
                </li>
              ))}
            </ul>

            {/*
              Fixed height from `lg` up rather than flexing: the frame is the
              same size on every slide, and it no longer resizes with the copy
              above it. Below `lg` the ratio drives it, since the column is
              full width there.
            */}
            <SlideFrame
              active={active}
              className="mt-6 aspect-[16/9] lg:aspect-auto lg:h-44"
              sizes="(min-width: 1024px) 48vw, 92vw"
            />

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <ButtonLink href="/about" variant="primary">
                Our story
                <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
              <ButtonLink href="/about/founder" variant="secondary">
                Meet the founder
              </ButtonLink>
            </div>
          </div>

          {/* ----------------------------- Right column ----------------------------- */}
          <SlideFrame
            active={trailing}
            className="aspect-[4/5] lg:aspect-auto lg:h-full"
            sizes="(min-width: 1024px) 40vw, 92vw"
            priority
          />
        </div>

        {/* -------------------------------- Stats -------------------------------- */}
        <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {aboutStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-subtle px-4 py-6 text-center lg:py-4"
            >
              <CountUp
                value={stat.value}
                className="block font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-3xl"
              />
              <p className="mt-2 text-xs leading-relaxed text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ------------------------------- Slide dots ------------------------------ */}
        <div className="flex shrink-0 items-center justify-center gap-2.5">
          {aboutSlides.map((slide, i) => (
            <button
              key={slide.word}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${slide.word}`}
              aria-current={i === active}
              className={cx(
                "h-1.5 rounded-full transition-all duration-500",
                i === active ? "w-8 bg-brand-600" : "w-1.5 bg-line hover:bg-brand-300",
              )}
            />
          ))}
        </div>
      </Rail>
    </section>
  );
}

/**
 * One photo slot. Every slide is rendered and stacked; only the active one is
 * opaque, so swapping costs a repaint rather than a reflow. A slide with no
 * `image` falls back to a branded panel carrying its icon and caption.
 */
function SlideFrame({
  active,
  className,
  sizes,
  priority = false,
}: {
  active: number;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cx(
        "relative isolate w-full overflow-hidden rounded-2xl ring-1 ring-line",
        className,
      )}
    >
      {aboutSlides.map((slide, i) => (
        <figure
          key={slide.word}
          aria-hidden={i !== active}
          className={cx(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            i === active ? "opacity-100" : "opacity-0",
          )}
        >
          {slide.image ? (
            <Image
              src={slide.image}
              alt={slide.caption}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              className="object-cover"
            />
          ) : (
            <>
              <span aria-hidden="true" className="panel-surface absolute inset-0 -z-10" />
              <span aria-hidden="true" className="panel-dots absolute inset-0 -z-10" />
              <Icon
                name={slide.icon}
                className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-accent-400/70"
              />
            </>
          )}
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hero-950/90 to-transparent p-5 text-xs leading-relaxed text-white/85">
            {slide.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
