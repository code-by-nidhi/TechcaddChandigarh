"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { includedItems } from "@/data/content";
import { ButtonLink, Icon, Rail } from "@/components/ui";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Each card parks this many px lower than the one before, so the pile shows. */
const STEP = 16;

/**
 * Modules — the oversized statement, then the cards that stack over it.
 *
 * Two layers inside one tall section. The headline is `position: sticky` and
 * fills the first viewport, so it stays put for the whole section; the cards
 * come after it in flow and ride over it on a higher z-index. Each card is
 * sticky too, parked a little lower than the last, which is what makes them
 * pile up rather than scroll past one another.
 *
 * The stack is pure CSS sticky. ScrollTrigger only pushes the headline back —
 * blur, fade and a slight scale — so the cards read as being in front of it
 * rather than sharing its plane.
 */
export function ModulesStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const type = typeRef.current;
    if (!section || !type || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // Recedes over the first card's worth of travel, not the whole section.
        end: "top+=70% top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          type.style.filter = `blur(${(p * 16).toFixed(2)}px)`;
          type.style.opacity = (1 - p * 0.6).toFixed(3);
          type.style.transform = `scale(${(1 - p * 0.07).toFixed(4)})`;
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="panel-surface relative text-white">
      {/* ------------------------- The statement, pinned ------------------------- */}
      <div className="sticky top-0 z-0 flex h-screen items-center overflow-hidden">
        <Rail className="w-full">
          <div ref={typeRef} className="will-change-[filter,transform,opacity]">
            <p className="text-[11px] font-bold tracking-[0.3em] text-accent-400 uppercase">
              Modules
            </p>

            <h2 className="mt-5 font-display text-[clamp(2.75rem,12vw,10rem)] leading-[0.85] font-extrabold tracking-tighter uppercase">
              What we
            </h2>

            {/*
              The supporting copy sits in the gap the second line leaves, the
              way the reference nests it inside the type rather than beneath it.
            */}
            <div className="mt-2 flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-12">
              <div className="max-w-sm lg:pb-4">
                <p className="leading-relaxed text-brand-100/80">
                  Every programme carries the same five things. They are not upsells at the end of
                  the course — they are part of what you already paid for.
                </p>
                <ButtonLink href="/courses" variant="onDark" size="sm" className="mt-6">
                  See the programmes
                  <Icon name="arrow-right" className="size-4" />
                </ButtonLink>
              </div>

              <h2
                aria-hidden="true"
                className="font-display text-[clamp(2.75rem,12vw,10rem)] leading-[0.85] font-extrabold tracking-tighter uppercase lg:ml-auto"
              >
                Include
              </h2>
            </div>
          </div>
        </Rail>
      </div>

      {/* --------------------------- The stacking cards --------------------------- */}
      <div className="relative z-10 pb-[30vh]">
        <Rail>
          <ol className="mx-auto max-w-3xl">
            {includedItems.map((item, i) => (
              <li
                key={item.title}
                className="sticky mb-6"
                /*
                 * Each card parks a notch lower than the one before, so the
                 * edge of every card underneath stays visible as the pile
                 * builds. Inline because the offset is per-index.
                 */
                style={{ top: `calc(50vh - 11rem + ${i * STEP}px)` }}
              >
                <article className="flex min-h-[19rem] flex-col justify-between rounded-3xl border border-white/12 bg-white p-7 text-hero-950 shadow-[0_30px_70px_-30px_rgba(3,10,30,0.85)] lg:p-9">
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight uppercase lg:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-md leading-relaxed text-hero-950/65">{item.body}</p>
                  </div>

                  <div className="mt-8 flex items-end justify-between gap-6">
                    <ul className="space-y-1 text-sm font-medium text-hero-950/70">
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <span className="font-display text-4xl leading-none font-extrabold tracking-tighter text-hero-950/25 lg:text-5xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </Rail>
      </div>
    </section>
  );
}
