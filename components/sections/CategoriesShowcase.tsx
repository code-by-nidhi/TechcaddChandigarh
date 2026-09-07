"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon, cx } from "@/components/ui";
import { courseCategories, coursesByCategory } from "@/data/courses";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Left-to-right seating order for the fan. "ai" is the focal centre card —
 * everything else spreads outward from it, matching the brief's left/right
 * split (cyber-cloud/marketing/programming on the left, web/cad/office right).
 */
const ORDER = ["cyber-cloud", "marketing", "programming", "ai", "web", "cad", "office"];
const CENTRE_ID = "ai";

/** Course-specific gradient per side card — the centre card gets a premium glass look instead. */
const THEMES: Record<string, string> = {
  programming: "from-slate-800 via-slate-700 to-slate-900",
  web: "from-emerald-500 via-teal-600 to-cyan-600",
  marketing: "from-rose-500 via-pink-500 to-orange-400",
  "cyber-cloud": "from-slate-900 via-blue-950 to-indigo-900",
  cad: "from-amber-500 via-orange-500 to-red-500",
  office: "from-violet-500 via-purple-600 to-fuchsia-600",
};

type Geometry = { x: number; z: number; rotateY: number; scale: number; zIndex: number };

export function CategoriesShowcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const layoutRef = useRef<(offset: number) => Geometry>((offset) => ({
    x: offset * 168,
    z: -Math.abs(offset) * 130,
    rotateY: offset * -9,
    scale: offset === 0 ? 1.08 : 1 - Math.abs(offset) * 0.09,
    zIndex: 100 - Math.abs(offset),
  }));

  const cards = ORDER.map((id) => courseCategories.find((c) => c.id === id)!);
  const centreIndex = cards.findIndex((c) => c.id === CENTRE_ID);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 639px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isDesktop: "(min-width: 1024px)",
        },
        (context) => {
          const conditions = context.conditions as { isMobile: boolean; isTablet: boolean };
          const spacingX = conditions.isMobile ? 96 : conditions.isTablet ? 132 : 172;
          const spacingZ = conditions.isMobile ? 70 : conditions.isTablet ? 100 : 140;
          const rotateStep = conditions.isMobile ? 16 : conditions.isTablet ? 12 : 9;

          const layout = (offset: number): Geometry => ({
            x: offset * spacingX,
            z: -Math.abs(offset) * spacingZ,
            rotateY: offset * -rotateStep,
            scale: offset === 0 ? 1.08 : 1 - Math.abs(offset) * 0.09,
            zIndex: 100 - Math.abs(offset),
          });
          layoutRef.current = layout;

          const els = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];

          els.forEach((el, i) => {
            const g = layout(i - centreIndex);
            gsap.set(el, {
              position: "absolute",
              top: "50%",
              left: "50%",
              xPercent: -50,
              yPercent: -50,
              x: g.x,
              z: g.z,
              rotateY: g.rotateY,
              scale: g.scale,
              zIndex: g.zIndex,
              force3D: true,
            });
          });

          if (prefersReducedMotion()) return;

          // Entrance: cards emerge from the centre and fan out into position.
          const tl = gsap.timeline({
            scrollTrigger: { trigger: stage, start: "top 80%", once: true },
          });
          els.forEach((el, i) => {
            tl.from(
              el,
              { x: 0, z: -420, rotateY: 0, scale: 0.4, opacity: 0, duration: 1, ease: "power3.out" },
              Math.abs(i - centreIndex) * 0.07,
            );
          });

          // Scroll-linked depth: the fan breathes open a little further as the
          // section crosses the viewport.
          els.forEach((el, i) => {
            const g = layout(i - centreIndex);
            gsap.to(el, {
              x: g.x * 1.12,
              z: g.z * 1.25,
              rotateY: g.rotateY * 1.15,
              ease: "none",
              scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: 1 },
            });
          });

          return () => {
            els.forEach((el) => gsap.set(el, { clearProps: "position,top,left" }));
          };
        },
      );

      return () => mm.revert();
    }, stage);

    return () => ctx.revert();
  }, []);

  function onEnter(i: number) {
    const el = cardRefs.current[i];
    if (!el) return;
    gsap.to(el, { z: "+=100", scale: "+=0.06", zIndex: 200, duration: 0.5, ease: "power3.out" });
  }

  function onLeave(i: number) {
    const el = cardRefs.current[i];
    if (!el) return;
    const g = layoutRef.current(i - centreIndex);
    gsap.to(el, { z: g.z, scale: g.scale, zIndex: g.zIndex, duration: 0.5, ease: "power3.out" });
  }

  return (
    <div
      ref={stageRef}
      className="relative flex h-auto min-h-[22rem] w-full flex-wrap items-center justify-center gap-4 overflow-hidden py-6 [perspective:1600px] sm:min-h-[26rem] lg:min-h-[30rem] lg:[transform-style:preserve-3d]"
    >
      {cards.map((category, i) => {
        const count = coursesByCategory(category.id).length;
        const isCentre = category.id === CENTRE_ID;
        return (
          <Link
            key={category.id}
            href={`/courses#${category.id}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={() => onLeave(i)}
            onFocus={() => onEnter(i)}
            onBlur={() => onLeave(i)}
            style={{ transformStyle: "preserve-3d" }}
            className={cx(
              "flex w-56 shrink-0 flex-col justify-between rounded-[32px] border p-6 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] backdrop-blur-sm transition-shadow duration-300 sm:w-64 lg:w-72",
              isCentre
                ? "h-72 border-white/50 bg-white/95 text-ink hover:shadow-[0_35px_70px_-20px_rgba(37,99,235,0.55)] sm:h-80 lg:h-[22rem]"
                : cx(
                    "h-64 border-white/10 bg-gradient-to-br text-white hover:shadow-[0_35px_70px_-20px_rgba(34,211,238,0.45)] sm:h-72 lg:h-80",
                    THEMES[category.id],
                  ),
            )}
          >
            <div>
              <span
                className={cx(
                  "inline-flex size-12 items-center justify-center rounded-2xl",
                  isCentre ? "bg-brand-600 text-white" : "bg-white/15 text-white backdrop-blur-md",
                )}
              >
                <Icon name={category.icon} className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-balance">
                {category.name}
              </h3>
              <p
                className={cx(
                  "mt-2.5 text-sm leading-relaxed",
                  isCentre ? "text-muted" : "text-white/75",
                )}
              >
                {category.blurb}
              </p>
            </div>
            <p className={cx("text-xs font-semibold", isCentre ? "text-brand-600" : "text-white/90")}>
              {count} course{count === 1 ? "" : "s"} →
            </p>
          </Link>
        );
      })}
    </div>
  );
}
