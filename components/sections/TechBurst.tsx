"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { techGroups } from "@/data/content";
import { TechLogo } from "@/components/TechLogo";
import { Icon, cx } from "@/components/ui";

import logo from "@/public/assets/logo.png";

/* ==========================================================================
   CONFIG — the nav itself is `techGroups` (data/content.ts). This map only
   gives each category its glyph, so adding a category there plus one line
   here is all it takes to extend the tab bar.
   ========================================================================== */
const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Programming: { icon: "code", color: "#2563eb" },
  Frameworks: { icon: "layers", color: "#0891b2" },
  "AI & ML": { icon: "sparkles", color: "#7c3aed" },
  "Cyber Security": { icon: "shield", color: "#dc2626" },
  Databases: { icon: "box", color: "#0369a1" },
  DevOps: { icon: "refresh", color: "#16a34a" },
  Cloud: { icon: "cloud", color: "#0ea5e9" },
  "CAD & Design": { icon: "compass", color: "#ea580c" },
  "Marketing & Analytics": { icon: "chart", color: "#db2777" },
};

const FALLBACK_META = { icon: "spark", color: "#2563eb" };

/** Most tools shown at once. Past this the rings stop reading as a set. */
const MAX_TILES = 12;

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Ring targets for a circular stage, as offsets from the centre.
 *
 * Radii come from the stage's measured size rather than breakpoints, so the
 * tools always clear the logo and always stay inside the circle. `compact`
 * mirrors the CSS core/tile sizes; where the two disagree it only ever pushes
 * tools further out, never into the logo.
 */
function ringTargets(count: number, size: number) {
  const R = size / 2;
  const compact = size < 480;
  const tileHalf = compact ? 34 : 46;
  const coreR = compact ? 46 : 76;

  const minR = coreR + tileHalf + 10;
  const maxR = Math.max(minR + 12, R - tileHalf - 18);

  // One ring reads better up to six; past that a second ring keeps the
  // spacing along each arc wide enough for the labels.
  const inner = Math.floor(count * 0.4);
  const rings =
    count <= 6
      ? [{ n: count, r: (minR + maxR) / 2, turn: 0 }]
      : [
          { n: inner, r: minR + (maxR - minR) * 0.1, turn: 0 },
          // Half a step round, so the outer ring sits in the inner one's gaps.
          { n: count - inner, r: maxR, turn: 0.5 },
        ];

  const out: { x: number; y: number; rot: number; depth: number }[] = [];

  for (const ring of rings) {
    const step = (Math.PI * 2) / ring.n;
    for (let i = 0; i < ring.n; i++) {
      // Start at 12 o'clock, then jitter so the ring is not mechanical.
      const angle = (i + ring.turn) * step - Math.PI / 2 + (Math.random() - 0.5) * step * 0.25;
      const r = ring.r + (Math.random() - 0.5) * 14;

      out.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        rot: Math.random() * 10 - 5,
        depth: 0.4 + Math.random() * 0.9,
      });
    }
  }

  return out;
}

/** TechTile sizes itself in `cqw`, so each one gets its own sizing container. */
const tileBox: CSSProperties = { containerType: "inline-size" };

export function TechBurst() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(techGroups[0].name);
  const [inView, setInView] = useState(false);
  /* Bumped on a click of the already-active tab, to replay the same set. */
  const [replay, setReplay] = useState(0);

  const group = techGroups.find((g) => g.name === active) ?? techGroups[0];
  const items = group.items.slice(0, MAX_TILES);

  /* ------------------------------ play when seen ------------------------------ */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.35 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  /* --------------------------------- the burst --------------------------------- */
  /*
   * Tiles are read from the DOM rather than a ref array: the count changes with
   * every category, and a ref array indexed by position goes stale the moment a
   * shorter set replaces a longer one.
   */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !inView) return;

    const tiles = Array.from(stage.querySelectorAll<HTMLElement>("[data-tile]"));
    if (!tiles.length) return;

    const { width } = stage.getBoundingClientRect();
    const targets = ringTargets(tiles.length, width);
    const quick = reduced();

    gsap.killTweensOf(tiles);
    // GSAP owns the transform outright — no Tailwind translate/scale on the
    // tiles, or the two would compound into a double offset.
    gsap.set(tiles, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 0.2,
      opacity: 0,
    });

    const floats = Array.from(stage.querySelectorAll<HTMLElement>("[data-float]"));
    gsap.killTweensOf(floats);
    gsap.set(floats, { y: 0, x: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tiles.forEach((el, i) => {
      const t = targets[i];
      el.dataset.depth = String(t.depth);
      tl.to(
        el,
        {
          x: t.x,
          y: t.y,
          rotation: t.rot,
          scale: 1,
          opacity: 1,
          duration: quick ? 0 : 1,
          ease: "back.out(1.5)",
        },
        quick ? 0 : i * 0.06,
      );
    });

    /*
     * Once a tool has landed it keeps drifting. The bob runs on the inner
     * `[data-float]` element, not the tile, because the burst and the parallax
     * already own x/y and rotationX/Y up there.
     *
     * Each gets its own period and phase, so the ring never falls into step and
     * pulses as one — which is what makes it read as floating rather than
     * blinking. `x` drifts on a different period again, so the path is a slow
     * figure rather than a straight bounce.
     */
    const drifts: gsap.core.Tween[] = [];
    if (!quick) {
      floats.forEach((el) => {
        drifts.push(
          gsap.to(el, {
            y: gsap.utils.random(-9, -5),
            duration: gsap.utils.random(2.1, 3.4),
            delay: gsap.utils.random(0, 1.6),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          gsap.to(el, {
            x: gsap.utils.random(-5, 5),
            duration: gsap.utils.random(3.2, 4.8),
            delay: gsap.utils.random(0, 1.6),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
        );
      });
    }

    return () => {
      tl.kill();
      drifts.forEach((t) => t.kill());
    };
  }, [active, inView, replay]);

  /* ------------------------------ parallax on tilt ------------------------------ */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !inView || reduced()) return;

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      stage.querySelectorAll<HTMLElement>("[data-tile]").forEach((el) => {
        const depth = Number(el.dataset.depth) || 0.6;
        gsap.to(el, {
          rotationY: dx * 14 * depth,
          rotationX: -dy * 14 * depth,
          duration: 0.6,
          ease: "power2.out",
          // Only these two properties tween, so the burst's x/y survive.
          overwrite: "auto",
        });
      });
    };

    stage.addEventListener("pointermove", onMove);
    return () => stage.removeEventListener("pointermove", onMove);
  }, [inView]);

  const pick = useCallback(
    (name: string) => {
      if (name === active) setReplay((n) => n + 1);
      else setActive(name);
    },
    [active],
  );

  return (
    <div>
      {/* ---------------------------------- tab bar ---------------------------------- */}
      <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div
          role="tablist"
          aria-label="Technology categories"
          className="mx-auto flex w-max gap-1 rounded-full bg-white p-1.5 shadow-[0_10px_30px_-12px_rgba(18,63,102,0.28)] ring-1 ring-brand-100"
        >
          {techGroups.map((item) => {
            const selected = item.name === active;
            const meta = CATEGORY_META[item.name] ?? FALLBACK_META;
            return (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => pick(item.name)}
                className={cx(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-200",
                  selected
                    ? "bg-gradient-to-r from-brand-600 to-brand-400 text-white shadow-[0_6px_16px_-6px_rgba(37,99,235,0.7)]"
                    : "text-muted hover:text-foreground",
                )}
              >
                {/* Each category keeps its own hue; only the selected pill,
                    which sits on the blue gradient, knocks out to white. */}
                <Icon
                  name={meta.icon}
                  className="size-4"
                  style={selected ? undefined : { color: meta.color }}
                />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------- circular stage ------------------------------- */}
      <div
        ref={stageRef}
        className="relative isolate mx-auto mt-10 aspect-square w-full max-w-[640px] overflow-hidden rounded-full border border-brand-100 bg-[radial-gradient(circle_at_50%_45%,#f2f9ff_0%,#e2effb_58%,#cfe4f7_100%)] [perspective:1400px]"
      >
        {/* Static guides, not animation — they give the tools a ring to sit on
            so the circle reads as an orbit rather than a plain disc. */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 size-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand-600/15"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 size-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand-600/12"
        />

        {/* ---------------------------------- the core ---------------------------------- */}
        <div className="absolute top-1/2 left-1/2 z-[3] grid size-[92px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-white to-brand-50 shadow-[0_10px_30px_rgba(18,63,102,0.18),inset_0_0_0_1px_rgba(255,255,255,0.7)] sm:size-[152px]">
          <Image src={logo} alt="techcadd" priority className="h-auto w-[64%] max-w-none" />
        </div>

        {/* ---------------------------------- the tools ---------------------------------- */}
        {items.map((tool) => (
          <div
            key={`${group.name}-${tool}`}
            data-tile
            className="group absolute top-1/2 left-1/2 z-[2] opacity-0 [transform-style:preserve-3d] will-change-transform hover:z-[4]"
          >
            {/*
              The float lives on its own element. The burst and the parallax
              both write x/y and rotationX/Y on the tile above, so a bob tween
              sharing that element would fight them for the same properties.
            */}
            <div data-float className="relative">
              <TechLogo name={tool} className="size-11 sm:size-14" />

              {/* Name is a tooltip now — it only appears on hover. */}
              <span
                role="tooltip"
                className="pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 translate-y-full rounded-md bg-hero-950 px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
              >
                {tool}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
