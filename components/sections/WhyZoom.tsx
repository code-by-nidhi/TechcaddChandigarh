"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";
import { whyMetrics } from "@/data/content";
import { ButtonLink, Eyebrow, Icon } from "@/components/ui";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Share of the scroll runway spent expanding. The rest is dwell: the panel is
 * already full-screen and simply stays pinned, so the metrics can be read
 * before the section scrolls away. Without this the panel finished expanding at
 * the exact moment the pin released, and the finished state was never seen.
 */
const EXPAND_END = 0.55;

/** Progress at which the headline has fully faded, and where the panel starts. */
const COPY_OUT = 0.5;
const PANEL_IN = 0.62;

/**
 * "Why techcadd", as a scroll-driven zoom.
 *
 * At rest the section is only as tall as its headline — no full-viewport band
 * of empty space. Scrolling does two things at once: the sticky wrapper grows
 * from that height out to the viewport, and the gradient panel inside it is
 * revealed through an animated `clip-path` inset that starts matching the
 * little pill sitting inline in the headline.
 *
 * Doing it this way rather than scaling a small card up matters twice over: the
 * gradient is never resampled, so it stays crisp at full size, and the corner
 * radius stays circular throughout. A `scaleX/scaleY` big enough to take a
 * ~120x34 pill to a full viewport is wildly non-uniform, which smears the
 * rounded corners into ellipses on the way out.
 *
 * Pinning is CSS `position: sticky` rather than ScrollTrigger's pin, so there
 * is no pin-spacer to reconcile with the surrounding sections; ScrollTrigger
 * only reports progress.
 */
export function WhyZoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const wrap = wrapRef.current;
    const copy = copyRef.current;
    const slot = slotRef.current;
    const panel = panelRef.current;
    const grid = gridRef.current;
    if (!section || !wrap || !copy || !slot || !panel || !grid) return;

    // Reduced motion gets the open, static layout the `motion-reduce:` classes
    // below already describe — no trigger, no clipping.
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const clamp = gsap.utils.clamp(0, 1);

      const draw = (raw: number) => {
        // Expansion is done by EXPAND_END; past that `p` pins at 1 and holds.
        const p = clamp(raw / EXPAND_END);

        /*
         * The wrapper grows with the scroll instead of being a fixed viewport.
         * At rest it is exactly as tall as the headline block, so the section
         * sits on the page like any other; the full viewport is only claimed
         * once the panel actually needs it.
         */
        const shut = copy.offsetHeight;
        wrap.style.height = `${shut + (window.innerHeight - shut) * p}px`;

        /*
         * Measured after the height is written, so the insets track the box as
         * it opens. That costs one forced layout per scroll tick — acceptable
         * for a scrub, and the alternative (a cached box) would leave the clip
         * lagging the growing wrapper.
         */
        const w = wrap.getBoundingClientRect();
        const t = slot.getBoundingClientRect();

        // `rest` runs 1 -> 0: the share of the original inset still in place.
        const rest = 1 - p;
        panel.style.clipPath =
          `inset(${(t.top - w.top) * rest}px ${(w.right - t.right) * rest}px ` +
          `${(w.bottom - t.bottom) * rest}px ${(t.left - w.left) * rest}px ` +
          `round ${999 * rest}px)`;

        copy.style.opacity = String(clamp(1 - p / COPY_OUT));
        grid.style.opacity = String(clamp((p - PANEL_IN) / (1 - PANEL_IN)));
        // Contents rise the last stretch rather than appearing in place.
        grid.style.transform = `translate3d(0, ${clamp(1 - (p - PANEL_IN) / (1 - PANEL_IN)) * 28}px, 0)`;
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onRefresh: (self) => draw(self.progress),
        onUpdate: (self) => draw(self.progress),
      });

      draw(0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[260vh] motion-reduce:h-auto lg:h-[300vh]"
    >
      {/* No `h-screen`: the wrapper starts at the headline's own height and is
          grown to the viewport by `draw`, so there is no empty band at rest. */}
      <div
        ref={wrapRef}
        className="sticky top-0 overflow-hidden motion-reduce:static motion-reduce:h-auto"
      >
        {/* ---- Stage 1: copy. In normal flow, so it sets the resting height. ---- */}
        <div ref={copyRef} className="rail grid place-items-center py-20 lg:py-24">
          <Eyebrow className="mb-6">Why techcadd</Eyebrow>
          <h2 className="max-w-4xl text-center font-display text-3xl leading-[1.2] font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            What used to take a whole{" "}
            {/*
              The pill is only a spacer that reserves inline room — the gradient
              you see through it is the panel below, clipped to exactly this box.
              It carries the same gradient of its own so the reduced-motion
              layout still reads correctly.
            */}
            <span
              ref={slotRef}
              aria-hidden="true"
              className="inline-block h-[0.78em] w-[2.6em] translate-y-[0.06em] rounded-full bg-[linear-gradient(120deg,#7c3aed_0%,#2563eb_55%,#22d3ee_100%)] shadow-[0_8px_24px_-6px_rgba(79,70,229,0.65)]"
            />{" "}
            semester now takes weeks — and it sticks a great deal longer too
          </h2>
        </div>

        {/* --------------------- Stages 2 & 3: the expanding panel --------------------- */}
        <div
          ref={panelRef}
          className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[linear-gradient(140deg,#2b1b6b_0%,#1e3a8a_46%,#1c53d1_100%)] pt-24 pb-10 will-change-[clip-path] lg:pt-28 motion-reduce:static motion-reduce:rounded-3xl motion-reduce:py-16"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/3 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-accent-400/20 blur-[140px]"
          />

          <div
            ref={gridRef}
            className="rail relative w-full opacity-0 will-change-[opacity,transform] motion-reduce:opacity-100"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whyMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md lg:p-5"
                >
                  <p className="font-display text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
                    {metric.value}
                  </p>
                  <p className="mt-2.5 text-[11px] font-bold tracking-widest text-accent-400 uppercase">
                    {metric.label}
                  </p>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-brand-100/75">{metric.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 text-center">
              <p className="max-w-xl text-xs leading-relaxed text-brand-100/60">
                Based on placement records from techcadd&rsquo;s {site.city} centre.
              </p>
              <ButtonLink href="/contact#enquire" variant="onDark" size="lg">
                Book a free demo
                <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
