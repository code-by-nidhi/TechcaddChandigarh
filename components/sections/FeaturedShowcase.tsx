"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactElement } from "react";
import Link from "next/link";
import gsap from "gsap";
import { courseSlug, courses } from "@/data/courses";
import { cx, Icon } from "@/components/ui";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -------------------------------------------------------------------------- */
/*                                   The deck                                  */
/* -------------------------------------------------------------------------- */

type Variant =
  | "minimal"
  | "editorial"
  | "typo"
  | "gradient"
  | "grid"
  | "screen"
  | "mono"
  | "blocks"
  | "photo"
  | "typoDark"
  | "neon";

interface Slot {
  /** Course id from `data/courses`. Every card is a real link to that course. */
  course: string;
  variant: Variant;
}

/**
 * Left to right along the arc — also the order the arrow keys walk through.
 * Tones alternate so neighbouring cards stay legible as separate objects:
 * the pale centre card is flanked by saturated mid-tones, and the near-black
 * poster sits further out where it would otherwise vanish into the background.
 */
const DECK: Slot[] = [
  { course: "cloud-computing", variant: "minimal" },
  { course: "cyber-security", variant: "typoDark" },
  { course: "full-stack-development", variant: "blocks" },
  { course: "agentic-ai", variant: "neon" },
  { course: "data-science", variant: "gradient" },
  { course: "artificial-intelligence", variant: "screen" },
  { course: "digital-marketing", variant: "photo" },
  { course: "data-analytics", variant: "grid" },
  { course: "generative-ai", variant: "mono" },
  { course: "mern-stack", variant: "editorial" },
  { course: "python", variant: "typo" },
];

const byId = new Map(courses.map((c) => [c.id, c]));
/** Anything missing from the data file is dropped rather than rendered empty. */
const SLOTS = DECK.filter((s) => byId.has(s.course));
/** Opens on the middle card rather than at one end. */
const START = Math.floor(SLOTS.length / 2);

/* -------------------------------------------------------------------------- */
/*                              Geometry and easing                            */
/* -------------------------------------------------------------------------- */

/** Card size at the widest breakpoint, in px — a 3:4 poster. */
const CARD = { w: 300, h: 400 };

interface Layout {
  /** Multiplier on the cards and on every distance below. */
  unit: number;
  /** Centre-to-neighbour offset, in px. */
  gap: number;
  /** Extra offset each card further out adds — small, so they stack. */
  step: number;
  /** Cards further out than this are not drawn at all. */
  reach: number;
}

/** Widest query first — the first match wins. */
const LAYOUTS: { query: string; layout: Layout }[] = [
  { query: "(min-width: 1536px)", layout: { unit: 1, gap: 224, step: 88, reach: 4 } },
  { query: "(min-width: 1280px)", layout: { unit: 0.92, gap: 210, step: 82, reach: 4 } },
  { query: "(min-width: 1024px)", layout: { unit: 0.84, gap: 192, step: 74, reach: 3 } },
  { query: "(min-width: 768px)", layout: { unit: 0.72, gap: 168, step: 62, reach: 3 } },
  { query: "(min-width: 0px)", layout: { unit: 0.58, gap: 134, step: 46, reach: 2 } },
];

const readLayout = (): Layout =>
  LAYOUTS.find((entry) => window.matchMedia(entry.query).matches)!.layout;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const clamp01 = (n: number) => clamp(n, 0, 1);

/**
 * `cubic-bezier(0.25, 1, 0.5, 1)` solved per frame. The browser only applies
 * that curve to CSS transitions, and every transform here is written from
 * script, so the curve has to be evaluated rather than declared.
 */
const easeOut = (() => {
  const x1 = 0.25;
  const y1 = 1;
  const x2 = 0.5;
  const y2 = 1;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (p: number) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    // Newton–Raphson: find the parameter whose x is p, then read its y.
    let t = p;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - p;
      if (Math.abs(dx) < 1e-5) break;
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= dx / slope;
    }
    return sampleY(t);
  };
})();

/**
 * Y rotation for a card `offset` slots from centre. Flat in the middle, ramping
 * to 25° at the neighbours and easing out toward 45° further along the arc.
 */
const angleFor = (offset: number) => {
  const d = Math.abs(offset);
  if (d < 1) return -offset * 25;
  return -Math.sign(offset) * (25 + 20 * (1 - Math.exp(-(d - 1) * 0.85)));
};

/** Horizontal offset. Beyond the first neighbour the cards stack tightly. */
const xFor = (offset: number, gap: number, step: number) => {
  const d = Math.abs(offset);
  if (d < 1) return offset * gap;
  return Math.sign(offset) * (gap + (d - 1) * step);
};

/** Depth. The centre card is pulled toward the viewer; the rest fall back. */
const zFor = (offset: number) => {
  const d = Math.abs(offset);
  return 100 - Math.min(1, d) * 100 - d * 90;
};

/** Depth-of-field scaling: 1 at centre, 0.85 at the neighbours, down to 0.7. */
const scaleFor = (offset: number) => {
  const d = Math.abs(offset);
  if (d < 1) return 1 - d * 0.15;
  return Math.max(0.7, 0.85 - (d - 1) * 0.075);
};

/** How many px of drag advances the carousel by one card. */
const DRAG_PER_CARD = 220;
/** Seconds of throw folded into the release, before snapping to a card. */
const INERTIA = 0.34;

/* -------------------------------------------------------------------------- */
/*                                  Component                                  */
/* -------------------------------------------------------------------------- */

export function FeaturedShowcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** `goTo` lives inside the animation effect; React handlers reach it here. */
  const apiRef = useRef<((index: number) => void) | null>(null);
  /** Set once a pointer has travelled far enough to count as a drag, not a tap. */
  const draggedRef = useRef(false);
  const [active, setActive] = useState(START);

  const count = SLOTS.length;

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    const els = cardRefs.current.slice(0, count);
    const reduced = prefersReducedMotion();
    const last = count - 1;

    let layout = readLayout();
    let visible = true;
    let position = START;
    let activeIndex = START;

    /** In-flight snap. Written by `goTo`, advanced by `tick`. */
    const tween = { active: false, from: START, to: START, start: 0, duration: 0 };
    const drag = { active: false, startX: 0, startPos: 0, lastX: 0, lastT: 0, velocity: 0 };

    /** Sizes change only on resize, so they stay out of the per-frame writer. */
    const measure = () => {
      const { unit } = layout;
      const w = Math.round(CARD.w * unit);
      const h = Math.round(CARD.h * unit);
      els.forEach((el) => {
        if (!el) return;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
      });
      // The frame is an outline around the centre card, not a crop of it.
      const pad = Math.round(16 * unit);
      frame.style.width = `${w + pad * 2}px`;
      frame.style.height = `${h + pad * 2}px`;
    };

    /** Single writer for every transform on the stage. */
    const render = () => {
      const { gap, step, reach, unit } = layout;

      els.forEach((el, i) => {
        if (!el) return;
        const offset = i - position;
        const d = Math.abs(offset);

        if (d > reach + 1) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          return;
        }

        const x = xFor(offset, gap, step) * unit;
        const z = zFor(offset) * unit;
        const opacity = clamp01(reach + 1 - d);

        el.style.transform =
          `translate3d(calc(-50% + ${x.toFixed(2)}px), -50%, ${z.toFixed(2)}px) ` +
          `rotateY(${angleFor(offset).toFixed(2)}deg) scale(${scaleFor(offset).toFixed(4)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(100 - Math.round(d * 10));
        el.style.pointerEvents = opacity > 0.35 ? "auto" : "none";
      });

      // The frame shares the centre card's plane, so it lines up under
      // perspective instead of reading as a smaller rectangle in front of it.
      const settled = clamp01(1 - Math.abs(position - Math.round(position)) * 2);
      frame.style.transform =
        `translate(-50%, -50%) translateZ(${(100 * layout.unit).toFixed(2)}px) ` +
        `scale(${(0.97 + 0.03 * settled).toFixed(4)})`;
      frame.style.opacity = (0.25 + 0.75 * settled).toFixed(3);

      const next = clamp(Math.round(position), 0, last);
      if (next !== activeIndex) {
        activeIndex = next;
        setActive(next);
      }
    };

    function tick() {
      if (!visible) return;
      if (tween.active) {
        const p = clamp01((performance.now() - tween.start) / tween.duration);
        position = tween.from + (tween.to - tween.from) * easeOut(p);
        if (p >= 1) tween.active = false;
      }
      render();
    }

    /** Snap to a card. Longer throws get a little more time, so they stay even. */
    const goTo = (index: number) => {
      const target = clamp(index, 0, last);
      const distance = Math.abs(target - position);
      if (reduced) {
        tween.active = false;
        position = target;
        render();
        return;
      }
      tween.from = position;
      tween.to = target;
      tween.start = performance.now();
      tween.duration = (0.52 + Math.min(distance, 4) * 0.09) * 1000;
      tween.active = true;
    };

    /**
     * Where the carousel is heading, not where it currently is. Rounding the
     * live position instead would make a second key press during a snap
     * re-target the card already being flown to, so held or rapid arrow
     * presses would stall on one card.
     */
    const targetIndex = () => (tween.active ? tween.to : Math.round(position));

    apiRef.current = goTo;

    /* ------------------------------ pointer drag ----------------------------- */

    const onPointerMove = (event: PointerEvent) => {
      if (!drag.active) return;
      const dx = event.clientX - drag.startX;
      if (Math.abs(dx) > 5) draggedRef.current = true;

      let next = drag.startPos - dx / (DRAG_PER_CARD * layout.unit);
      // Rubber-banding past either end, so the ends feel like ends.
      if (next < 0) next = next / 3;
      else if (next > last) next = last + (next - last) / 3;
      position = next;

      const now = performance.now();
      const dt = now - drag.lastT;
      if (dt > 0) {
        // Cards per second, smoothed so one jittery frame cannot fling it.
        const v = (-(event.clientX - drag.lastX) / (DRAG_PER_CARD * layout.unit) / dt) * 1000;
        drag.velocity = drag.velocity * 0.7 + v * 0.3;
        drag.lastX = event.clientX;
        drag.lastT = now;
      }
    };

    const onPointerUp = () => {
      if (!drag.active) return;
      drag.active = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      // Carry the throw, but never more than a few cards — a flick should not
      // send the arc spinning to the far end.
      const projected = position + clamp(drag.velocity * INERTIA, -3, 3);
      goTo(Math.round(projected));
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      tween.active = false;
      draggedRef.current = false;
      drag.active = true;
      drag.startX = event.clientX;
      drag.startPos = position;
      drag.lastX = event.clientX;
      drag.lastT = performance.now();
      drag.velocity = 0;
      // Deliberately no pointer capture: it would retarget the click and break
      // the card links. Window listeners give the same reach without that.
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    };

    /* -------------------------------- keyboard ------------------------------- */

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(targetIndex() - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(targetIndex() + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(last);
      }
    };

    const onResize = () => {
      layout = readLayout();
      measure();
      render();
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    // Nothing is computed while the carousel is parked off-screen.
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(stage);

    measure();
    render();
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("keydown", onKeyDown);
      apiRef.current = null;
    };
  }, [count]);

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Index readout, centred above the arc. */}
      <p className="text-center font-mono text-[11px] tracking-[0.42em] text-white/35 uppercase">
        <span className="text-white/20">&lt;.</span>
        <span className="mx-2 text-white/80">{String(active + 1).padStart(2, "0")}</span>
        <span className="text-white/25">/ {String(count).padStart(2, "0")}</span>
        <span className="ml-2">selc</span>
        <span className="ml-2 text-white/20">.&gt;</span>
      </p>

      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Featured courses"
        className={cx(
          "relative mt-8 h-[300px] w-full cursor-grab touch-pan-y outline-none",
          "active:cursor-grabbing sm:h-[380px] lg:h-[460px] xl:h-[520px]",
          "[perspective:1200px] [perspective-origin:50%_50%]",
        )}
      >
        {SLOTS.map((slot, i) => (
          <div
            key={slot.course}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 will-change-transform [backface-visibility:hidden]"
          >
            <CardFace
              slot={slot}
              isActive={i === active}
              onSelect={(event) => {
                // A drag, or a tap on a background card, recentres rather than
                // following the link.
                if (draggedRef.current || i !== active) {
                  event.preventDefault();
                  if (!draggedRef.current) apiRef.current?.(i);
                }
              }}
            />
          </div>
        ))}

        {/* Sits in the centre card's own plane so the outline registers with it. */}
        <div
          ref={frameRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 z-[95] rounded-[42px] border-2 border-white/75 shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_0_28px_rgba(255,255,255,0.28),inset_0_0_24px_rgba(255,255,255,0.10)] will-change-transform"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Cards                                    */
/* -------------------------------------------------------------------------- */

function CardFace({
  slot,
  isActive,
  onSelect,
}: {
  slot: Slot;
  isActive: boolean;
  onSelect: (event: React.MouseEvent) => void;
}) {
  const course = byId.get(slot.course)!;
  const Art = ART[slot.variant];

  return (
    <Link
      href={`/${courseSlug(course.id)}`}
      draggable={false}
      onClick={onSelect}
      className={cx(
        "group relative block size-full overflow-hidden rounded-[28px] outline-none",
        "shadow-[0_30px_60px_-26px_rgba(0,0,0,0.95)]",
        "transition-shadow duration-500",
        "focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[#111111]",
      )}
      aria-label={`${course.name} — ${course.duration}, ${course.level}`}
      aria-current={isActive ? "true" : undefined}
      tabIndex={isActive ? 0 : -1}
    >
      <Art course={course} />
      <CardLabel course={course} isActive={isActive} />
      <span className="sr-only">
        {course.name}. {course.duration}. {course.level}.
      </span>
    </Link>
  );
}

type Course = (typeof courses)[number];
type ArtProps = { course: Course };

/** Always legible on the focused card; on hover for the rest. */
function CardLabel({ course, isActive }: ArtProps & { isActive: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2",
        "bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 pt-9",
        "transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
      )}
    >
      <span className="min-w-0">
        <span className="block truncate text-[13px] leading-tight font-semibold tracking-tight text-white">
          {course.name}
        </span>
        <span className="mt-0.5 block truncate text-[10px] tracking-wide text-white/60 uppercase">
          {course.duration}
        </span>
      </span>
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-0.5">
        <Icon name="arrow-right" className="size-3.5" />
      </span>
    </span>
  );
}

/* ------------------------------- Card artwork ------------------------------ */

/**
 * A minimal product screen. Sized in `cqw` against the card so it holds up at
 * every breakpoint; the container has to be a wrapper, because an element that
 * declares `container-type` is not its own container.
 */
function ScreenCard({ course }: ArtProps) {
  return (
    <div className="size-full" style={{ containerType: "inline-size" }}>
      <div className="relative size-full overflow-hidden bg-[#fbfaf7]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-90">
          <div className="absolute -top-1/3 left-[8%] size-[62%] rounded-full bg-[#9db8ff] blur-[18cqw]" />
          <div className="absolute top-[18%] right-[-6%] size-[55%] rounded-full bg-[#ffd0b0] blur-[18.5cqw]" />
          <div className="absolute bottom-[-18%] left-[26%] size-[58%] rounded-full bg-[#bfe6d2] blur-[19cqw]" />
        </div>

        <div className="relative flex size-full flex-col p-[5.5cqw]">
          <nav
            aria-hidden="true"
            className="mx-auto flex items-center gap-[0.7cqw] rounded-full border border-black/8 bg-white/80 p-[1.3cqw] text-[3.2cqw] font-medium tracking-wide text-black/55 backdrop-blur-md"
          >
            {["Home", "Tasks", "Studio", "Connect"].map((label, i) => (
              <span
                key={label}
                className={cx(
                  "rounded-full px-[3.2cqw] py-[1.3cqw]",
                  i === 0 && "bg-[#141414] text-white",
                )}
              >
                {label}
              </span>
            ))}
          </nav>

          <div className="mt-[4.8cqw] flex gap-[2.8cqw]">
            <div className="flex w-[38%] flex-col justify-between rounded-[4.2cqw] bg-[#dfe9c4] p-[3.4cqw]">
              <span className="text-[2.8cqw] font-medium tracking-[0.18em] text-black/40 uppercase">
                Cohort
              </span>
              <span className="font-display text-[9cqw] leading-none font-bold tracking-tight text-[#141414]">
                {course.duration.replace(/[^0-9]/g, "").slice(0, 2) || "24"}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center rounded-[4.2cqw] bg-white/85 p-[3.4cqw] backdrop-blur-sm">
              <span className="font-display text-[5.2cqw] leading-[1.15] font-bold tracking-tight text-[#141414]">
                Creative
                <br />
                Systems
              </span>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="mt-[2.8cqw] flex items-center gap-[2.1cqw] rounded-[4.2cqw] bg-white/85 p-[2.1cqw] backdrop-blur-sm"
          >
            <span className="flex-1 truncate rounded-[2.8cqw] bg-black/4 px-[2.8cqw] py-[2.1cqw] text-[3.1cqw] text-black/35">
              you@example.com
            </span>
            <span className="rounded-[2.8cqw] bg-[#f26b3a] px-[3.4cqw] py-[2.1cqw] text-[3.1cqw] font-semibold text-white">
              Send
            </span>
          </div>

          <div className="mt-[2.8cqw] flex flex-1 flex-col rounded-[4.2cqw] bg-white/85 p-[3.4cqw] backdrop-blur-sm">
            <p className="text-[3.4cqw] leading-[1.35] font-medium text-[#141414]">
              {course.name}: a hands-on track with lab hours and a live client project.
            </p>
            <span className="mt-auto flex items-center justify-between gap-[2.8cqw] border-t border-black/8 pt-[2.8cqw] text-[2.9cqw] tracking-wide text-black/45 uppercase">
              {course.duration}
              <span className="truncate text-black/30">{course.tools[0]}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalCard() {
  return (
    <div className="relative size-full bg-[#f4f2ec]">
      <div aria-hidden="true" className="absolute inset-0 p-6">
        <div className="h-[62%] rounded-xl bg-white" />
        <div className="mt-4 h-1 w-2/3 rounded-full bg-black/10" />
        <div className="mt-2 h-1 w-1/2 rounded-full bg-black/8" />
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-5 left-5 inline-flex size-9 items-center justify-center rounded-lg bg-[#141414] text-white"
      >
        <Icon name="arrow-right" className="size-4 rotate-90" />
      </span>
    </div>
  );
}

function EditorialCard({ course }: ArtProps) {
  return (
    <div aria-hidden="true" className="relative size-full bg-[#f5d90a]">
      <div className="absolute inset-y-0 left-0 w-[26%] bg-[#2fbf5f]" />
      <div className="absolute inset-y-0 right-0 w-[22%] bg-[#141414]" />
      <div className="absolute top-7 left-[32%] space-y-2">
        {[70, 52, 64].map((w, i) => (
          <div key={i} className="h-[3px] rounded-full bg-black/25" style={{ width: `${w}px` }} />
        ))}
      </div>
      <span className="absolute bottom-7 left-[32%] font-display text-[17px] leading-none font-bold tracking-tight text-[#141414]">
        {course.duration.replace(/[^0-9–-]/g, "").trim() || "12"}
      </span>
    </div>
  );
}

function TypoCard({ course }: ArtProps) {
  const word = course.name.split(" ")[0].toUpperCase();
  return (
    <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#1f4fd8]">
      <div className="absolute inset-0 flex flex-col justify-center gap-[4px]">
        {Array.from({ length: 14 }).map((_, row) => (
          <div
            key={row}
            className="font-display text-[16px] leading-none font-bold tracking-tighter whitespace-nowrap text-white/85"
            style={{ transform: `translateX(${(row % 3) * -22}px)` }}
          >
            {`${word} `.repeat(8)}
          </div>
        ))}
      </div>
    </div>
  );
}

function GradientCard() {
  return (
    <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#0a1b3d]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-12%] left-[-8%] size-[72%] rounded-full bg-[#2f7dff] blur-[46px]" />
        <div className="absolute right-[-10%] bottom-[14%] size-[68%] rounded-full bg-[#22d3ee] blur-[50px]" />
        <div className="absolute bottom-[-18%] left-[16%] size-[64%] rounded-full bg-[#3ddc97] blur-[52px]" />
        <div className="absolute top-[34%] left-[30%] size-[34%] rounded-full bg-[#ffd23f] blur-[42px]" />
      </div>
    </div>
  );
}

function MonoCard() {
  return (
    <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#f7f7f5]">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center">
          <span className="size-[88px] rounded-full border-[18px] border-[#141414]" />
          <span className="-ml-3 h-[18px] w-[66px] rounded-full bg-[#141414]" />
        </span>
      </div>
    </div>
  );
}

function BlocksCard() {
  return (
    <div aria-hidden="true" className="relative size-full overflow-hidden bg-white">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-5">
        <div className="rounded-xl bg-[#1f5cf0]" />
        <div className="rounded-xl bg-[#eceff5]" />
        <div className="rounded-xl bg-[#eceff5]" />
        <div className="rounded-xl bg-[#e8402c]" />
      </div>
    </div>
  );
}

function GridCard() {
  return (
    <div aria-hidden="true" className="relative size-full overflow-hidden bg-white">
      <div className="absolute inset-0 p-6">
        <div className="grid h-full grid-cols-3 grid-rows-4 gap-[5px]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={cx(
                "rounded-[4px]",
                [1, 3, 5, 7, 9, 11].includes(i) ? "bg-[#e8402c]" : "border border-[#e8402c]/25",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PhotoCard() {
  return (
    <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#2b1410]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-18%] left-[-6%] size-[78%] rounded-full bg-[#ff7a4d] blur-[42px]" />
        <div className="absolute top-[24%] right-[-14%] size-[66%] rounded-full bg-[#ffb37a] blur-[48px]" />
        <div className="absolute bottom-[-22%] left-[12%] size-[70%] rounded-full bg-[#c8403a] blur-[50px]" />
        <div className="absolute top-[46%] left-[38%] size-[30%] rounded-full bg-[#ffe0c2] blur-[36px]" />
      </div>
    </div>
  );
}

function TypoDarkCard({ course }: ArtProps) {
  return (
    <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#111111]">
      <span className="absolute top-1/2 left-5 -translate-y-1/2 rotate-180 font-display text-[52px] leading-none font-bold tracking-tighter text-[#ffd23f] [writing-mode:vertical-rl]">
        {course.duration.replace(/[^0-9–-]/g, "").trim() || "12"}
      </span>
      <span className="absolute top-6 right-6 size-11 rounded-full border-2 border-[#ffd23f]" />
    </div>
  );
}

function NeonCard() {
  return (
    <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#dcf24a]">
      <div className="absolute inset-x-0 top-0 h-[34%] bg-[#141414]" />
      <span className="absolute top-[10%] left-6 font-display text-[19px] leading-none font-bold tracking-tight text-[#dcf24a]">
        24/7
      </span>
      <span className="absolute right-6 bottom-6 inline-flex size-14 items-center justify-center rounded-full bg-[#141414] text-[#dcf24a]">
        <Icon name="arrow-up-right" className="size-6" />
      </span>
    </div>
  );
}

const ART: Record<Variant, (props: ArtProps) => ReactElement> = {
  minimal: MinimalCard,
  editorial: EditorialCard,
  typo: TypoCard,
  gradient: GradientCard,
  grid: GridCard,
  screen: ScreenCard,
  mono: MonoCard,
  blocks: BlocksCard,
  photo: PhotoCard,
  typoDark: TypoDarkCard,
  neon: NeonCard,
};
