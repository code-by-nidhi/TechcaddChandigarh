"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
 * Seating order around the ring, read left to right. "ai" sits at index 3 so
 * the AI track is the card facing the viewer on first paint.
 */
const ORDER = ["cad", "marketing", "programming", "ai", "web", "cyber-cloud", "office"];

/** Poster gradient per track — the arc reads as artwork before it reads as text. */
const THEMES: Record<string, string> = {
  ai: "from-brand-500 via-hero-600 to-hero-900",
  programming: "from-slate-700 via-slate-800 to-slate-950",
  web: "from-emerald-400 via-teal-500 to-cyan-600",
  marketing: "from-rose-500 via-pink-500 to-orange-400",
  "cyber-cloud": "from-indigo-500 via-blue-900 to-slate-950",
  cad: "from-amber-400 via-orange-500 to-red-500",
  office: "from-violet-500 via-purple-600 to-fuchsia-600",
};

type Config = { radius: number; step: number; dragPx: number };

/** Widest query first — the first match wins. */
const CONFIGS: { query: string; config: Config }[] = [
  // radius × sin(step) is the on-screen pitch — kept well under the card width
  // so neighbours overlap the way they do on the reference site.
  { query: "(min-width: 1024px)", config: { radius: 575, step: 22, dragPx: 215 } },
  { query: "(min-width: 640px)", config: { radius: 440, step: 24, dragPx: 179 } },
  { query: "(min-width: 0px)", config: { radius: 310, step: 27, dragPx: 140 } },
];

const readConfig = (): Config =>
  CONFIGS.find((entry) => window.matchMedia(entry.query).matches)!.config;

/** Shortest signed distance from a ring position to a slot, over `count` slots. */
const wrap = (offset: number, count: number) => {
  const half = count / 2;
  return ((((offset + half) % count) + count) % count) - half;
};

/** Cards per second the ring turns on its own — roughly six seconds per card. */
const DRIFT = 0.17;
/**
 * Seconds for a fling to bleed back down to {@link DRIFT}. Releasing a drag
 * hands its momentum straight to the idle rotation rather than snapping, so
 * the ring never comes to a stop between the two.
 */
const MOMENTUM_TAU = 0.9;
/** Ceiling on fling speed, in cards per second, so a hard flick stays readable. */
const MAX_SPIN = 3.5;

export function CategoriesShowcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** `goTo` lives inside the animation effect; the card handlers reach it here. */
  const apiRef = useRef<{ goTo: (i: number) => void } | null>(null);
  const draggedRef = useRef(false);

  const cards = ORDER.map((id) => courseCategories.find((c) => c.id === id)!);
  const count = cards.length;
  const start = Math.max(0, cards.findIndex((c) => c.id === "ai"));

  const [active, setActive] = useState(start);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const reduced = prefersReducedMotion();
    const state = { pos: start, spread: reduced ? 1 : 0 };
    const drag = { active: false, startX: 0, startPos: 0, lastX: 0, lastT: 0, velocity: 0 };

    let config = readConfig();
    let visible = true;
    let snapping = false;
    let activeIndex = start;
    /** The ring's live angular velocity in cards/sec; rests at {@link DRIFT}. */
    let spin = DRIFT;

    /** Single writer for every card transform, driven off the GSAP ticker. */
    function render() {
      const { pos, spread } = state;
      const half = count / 2;

      els.forEach((el, i) => {
        const offset = wrap(i - pos, count);
        // Cards ride the outside of a cylinder, so the focused one faces us and
        // its neighbours turn away — the lens shape from the reference site.
        const angle = offset * config.step * spread;
        const rad = (angle * Math.PI) / 180;
        const x = Math.sin(rad) * config.radius;
        const z = (Math.cos(rad) - 1) * config.radius - (1 - spread) * 280;
        const focus = Math.max(0, 1 - Math.abs(offset));
        const scale = 1 + focus * 0.16;
        const lift = focus * -14;
        const fade = Math.min(1, Math.max(0, (half - Math.abs(offset)) / 0.9)) * spread;

        el.style.transform =
          `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${lift.toFixed(2)}px), ` +
          `${z.toFixed(2)}px) rotateY(${angle.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
        el.style.opacity = fade.toFixed(3);
        el.style.zIndex = String(Math.round(500 - Math.abs(offset) * 100));
        el.style.pointerEvents = fade > 0.4 ? "auto" : "none";
      });

      const next = ((Math.round(pos) % count) + count) % count;
      if (next !== activeIndex) {
        activeIndex = next;
        setActive(next);
      }
    }

    function tick(_time: number, delta: number) {
      if (!visible) return;
      // Hovering deliberately does NOT pause it — the ring is meant to keep
      // turning on its own; only an actual grab or snap takes the wheel.
      if (!reduced && !drag.active && !snapping) {
        // A background tab hands back one huge delta; clamp it so the ring
        // resumes where it left off instead of jumping a quarter turn.
        const dt = Math.min(delta, 64) / 1000;
        // Whatever momentum the fling left over eases back down to the base
        // drift, so letting go blends into the idle turn with no dead stop.
        spin += (DRIFT - spin) * (1 - Math.exp(-dt / MOMENTUM_TAU));
        state.pos += spin * dt;
      }
      render();
    }

    function settle(target: number, duration = 0.8) {
      gsap.killTweensOf(state);
      snapping = true;
      gsap.to(state, {
        pos: target,
        duration: reduced ? 0 : duration,
        ease: "power3.out",
        onComplete: () => {
          snapping = false;
          // Pick the idle turn straight back up out of the snap.
          spin = DRIFT;
        },
      });
    }

    function goTo(index: number) {
      // Clicking a card focuses its link mid-drag; a snap here would fight the pointer.
      if (drag.active) return;
      settle(state.pos + wrap(index - state.pos, count), 0.7);
    }

    function nudge(direction: number) {
      settle(Math.round(state.pos) + direction, 0.6);
    }

    apiRef.current = { goTo };

    /* ------------------------------- pointer drag ------------------------------ */

    function onPointerMove(event: PointerEvent) {
      if (!drag.active) return;
      const dx = event.clientX - drag.startX;
      if (Math.abs(dx) > 6) draggedRef.current = true;
      state.pos = drag.startPos - dx / config.dragPx;

      const now = performance.now();
      const dt = now - drag.lastT;
      if (dt > 0) {
        // Cards per second, smoothed so one jittery frame cannot fling it.
        const v = (-(event.clientX - drag.lastX) / config.dragPx / dt) * 1000;
        drag.velocity = drag.velocity * 0.75 + v * 0.25;
        drag.lastX = event.clientX;
        drag.lastT = now;
      }
    }

    function onPointerUp() {
      if (!drag.active) return;
      drag.active = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      // No snap on release. The throw becomes the ring's velocity and `tick`
      // eases it back to DRIFT, so the motion is continuous through the letting-go.
      spin = Math.max(-MAX_SPIN, Math.min(MAX_SPIN, drag.velocity));
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      gsap.killTweensOf(state);
      snapping = false;
      draggedRef.current = false;
      drag.active = true;
      drag.startX = event.clientX;
      drag.startPos = state.pos;
      drag.lastX = event.clientX;
      drag.lastT = performance.now();
      drag.velocity = 0;
      // Deliberately no pointer capture: it would retarget the click and break
      // the card links. Window listeners give the same reach without that.
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    }

    /* --------------------------- wheel / keys / hover -------------------------- */

    function onWheel(event: WheelEvent) {
      // Only claim clearly horizontal intent — a vertical wheel still scrolls the page.
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      gsap.killTweensOf(state);
      snapping = false;
      // Like the drag: the wheel moves the ring and hands off to the drift,
      // rather than snapping to a slot and stalling.
      state.pos += event.deltaX / config.dragPx;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        nudge(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nudge(1);
      }
    }

    const onResize = () => {
      config = readConfig();
      render();
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    // Nothing renders while the arc is parked off-screen.
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(stage);

    render();
    gsap.ticker.add(tick);

    const ctx = gsap.context(() => {
      if (reduced) return;
      // The ring blooms out of the centre the first time the section is reached.
      gsap.to(state, {
        spread: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: { trigger: stage, start: "top 85%", once: true },
      });
    }, stage);

    return () => {
      gsap.ticker.remove(tick);
      gsap.killTweensOf(state);
      ctx.revert();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("keydown", onKeyDown);
      apiRef.current = null;
    };
  }, [count, start]);

  return (
    <div className="relative select-none">
      {/* Floor glow the arc appears to stand on. */}
      <div
        aria-hidden="true"
        className="drift-slow pointer-events-none absolute bottom-10 left-1/2 -z-10 h-40 w-[80%] max-w-5xl -translate-x-1/2 rounded-[50%] bg-accent-400/12 blur-[90px]"
      />

      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Course categories"
        className="relative h-[280px] w-full cursor-grab touch-pan-y outline-none active:cursor-grabbing sm:h-[360px] lg:h-[430px]"
      >
        {/*
          Perspective sits on the direct parent and the stack stays flat, so the
          cards are composited in z-index order. With `preserve-3d` the browser
          sorts the rotated planes itself and a neighbour paints over the
          focused card's copy.
        */}
        <div className="absolute inset-0 [perspective:1500px] [perspective-origin:50%_45%]">
          {cards.map((category, i) => {
            const total = coursesByCategory(category.id).length;
            const isActive = i === active;
            return (
              <div
                key={category.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 h-[214px] w-[168px] will-change-transform [backface-visibility:hidden] sm:h-[266px] sm:w-[208px] lg:h-[320px] lg:w-[250px]"
              >
                <Link
                  href={`/courses#${category.id}`}
                  // Without this the browser starts its own link drag (ghost
                  // image) the moment you pull on a card, killing the grab.
                  draggable={false}
                  onClick={(event) => {
                    // A drag, or a tap on an off-centre card, recentres instead of navigating.
                    if (draggedRef.current || !isActive) {
                      event.preventDefault();
                      if (!draggedRef.current) apiRef.current?.goTo(i);
                    }
                  }}
                  onFocus={() => apiRef.current?.goTo(i)}
                  className={cx(
                    "group relative flex size-full flex-col justify-between overflow-hidden rounded-[26px] border bg-gradient-to-br p-4 text-white transition-[box-shadow,border-color] duration-500 sm:p-5",
                    THEMES[category.id],
                    isActive
                      ? "border-white/45 shadow-[0_50px_90px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12)]"
                      : "border-white/12 shadow-[0_40px_70px_-35px_rgba(0,0,0,0.85)]",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_-10%,rgba(255,255,255,0.3),transparent_62%)]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 to-transparent"
                  />

                  <span className="relative flex items-start justify-between">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-white/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md sm:size-10">
                      <Icon name={category.icon} className="size-4 sm:size-5" />
                    </span>
                  </span>

                  <span className="relative block">
                    <span className="block font-display text-base leading-tight font-bold tracking-tight text-balance sm:text-lg lg:text-xl">
                      {category.short}
                    </span>
                    <span
                      className={cx(
                        "mt-1.5 hidden text-xs leading-relaxed text-white/70 transition-opacity duration-500 lg:block",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {category.blurb}
                    </span>
                    <span className="mt-3 flex items-center justify-between gap-2 border-t border-white/20 pt-2.5 text-[11px] font-semibold text-white/85">
                      {total} course{total === 1 ? "" : "s"}
                      <Icon
                        name="arrow-right"
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
