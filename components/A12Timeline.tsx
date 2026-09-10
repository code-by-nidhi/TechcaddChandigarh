"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon, cx } from "./ui";

gsap.registerPlugin(ScrollTrigger);

export interface A12TimelineItem {
  icon: string;
  title: string;
  body: string;
}

/**
 * A central gold spine with one milestone dot per step, cards alternating
 * left/right of it. The spine's fill bar grows with scroll position and each
 * dot/card lights up once its step has been scrolled to, so the whole thing
 * reads as a step-by-step journey rather than a static grid.
 */
export function A12Timeline({ items }: { items: A12TimelineItem[] }) {
  const total = items.length;
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopFillRef = useRef<HTMLDivElement>(null);
  const mobileFillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      [desktopFillRef.current, mobileFillRef.current].forEach((fill) => {
        if (!fill) return;
        if (reduced) {
          gsap.set(fill, { height: "100%" });
          return;
        }
        gsap.set(fill, { height: "0%" });
        gsap.to(fill, {
          height: "100%",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 75%", end: "bottom 55%", scrub: true },
        });
      });

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        if (!reduced) {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              // Leaves lingering inline `transform`/`opacity`/`visibility` that
              // would outrank the Tailwind hover-lift and active/inactive
              // opacity classes forever after — drop them once the reveal
              // finishes so those classes take back over.
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: el, start: "top 85%" },
            },
          );
        } else {
          gsap.set(el, { autoAlpha: 1, y: 0, clearProps: "transform,opacity,visibility" });
        }
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });
    }, section);

    return () => ctx.revert();
  }, [total]);

  return (
    <div ref={sectionRef} className="relative">
      <div className="relative">
        {/* Desktop centre spine */}
        <div className="absolute inset-y-0 left-1/2 hidden w-[3px] -translate-x-1/2 overflow-hidden rounded-full bg-white/10 lg:block">
          <div
            ref={desktopFillRef}
            className="w-full rounded-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_14px_rgba(245,197,66,0.75)]"
          />
        </div>
        {/* Mobile left rail */}
        <div className="absolute inset-y-0 left-3 w-[3px] overflow-hidden rounded-full bg-white/10 lg:hidden">
          <div
            ref={mobileFillRef}
            className="w-full rounded-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_14px_rgba(245,197,66,0.75)]"
          />
        </div>

        <div className="flex flex-col gap-8 lg:gap-10">
          {items.map((item, i) => {
            const isLeft = i % 2 === 0;
            const isActive = active === i;
            const passed = active > i;
            return (
              <div key={item.title} className="relative">
                {/* Desktop milestone dot */}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute top-1/2 left-1/2 z-10 hidden size-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 lg:block",
                    isActive
                      ? "scale-125 bg-amber-400 shadow-[0_0_0_6px_rgba(245,197,66,0.25),0_0_18px_rgba(245,197,66,0.9)]"
                      : passed
                        ? "bg-amber-400/80 shadow-[0_0_10px_rgba(245,197,66,0.5)]"
                        : "bg-white/25",
                  )}
                />
                {/* Mobile milestone dot */}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute top-1/2 left-3 z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 lg:hidden",
                    isActive
                      ? "scale-125 bg-amber-400 shadow-[0_0_0_5px_rgba(245,197,66,0.25),0_0_14px_rgba(245,197,66,0.9)]"
                      : passed
                        ? "bg-amber-400/80 shadow-[0_0_8px_rgba(245,197,66,0.5)]"
                        : "bg-white/25",
                  )}
                />

                <div
                  className={cx(
                    "w-full pl-10 lg:w-[46%] lg:pl-0",
                    isLeft ? "" : "lg:ml-auto",
                  )}
                >
                  <div
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className={cx(
                      "group relative overflow-hidden rounded-[24px] border p-6 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      "hover:-translate-y-1.5 hover:opacity-100 hover:border-amber-300/40",
                      "hover:shadow-[0_35px_80px_-25px_rgba(0,0,0,0.75),0_0_45px_-8px_rgba(245,197,66,0.4)]",
                      isActive
                        ? "border-amber-300/50 bg-white/[0.07] opacity-100 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(245,197,66,0.4)]"
                        : "border-white/10 bg-white/[0.04] opacity-70 shadow-[0_20px_45px_-25px_rgba(0,0,0,0.55)]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_15%_0%,rgba(245,197,66,0.1),transparent_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-6">
                        <Icon name={item.icon} className="size-4.5" />
                      </span>
                      <span
                        className={cx(
                          "grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                          isActive || passed
                            ? "bg-amber-400 text-hero-950"
                            : "bg-white/15 text-white/70",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="relative mt-4 font-display text-base font-bold tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="relative mt-2.5 text-sm leading-relaxed text-white/60">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
