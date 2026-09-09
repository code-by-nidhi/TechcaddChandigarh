"use client";

import { useEffect, useRef } from "react";
import { TechTile } from "./TechTile";
import { cx } from "./ui";

/** Distance, in px, between two neighbouring cards' centres at scale 1. */
const CARD_GAP = 158;
/** Idle auto-drift speed, in "card units" per second. */
const AUTO_SPEED = 0.09;
/** How long after the last interaction before auto-drift resumes, in ms. */
const RESUME_DELAY = 1100;

/** Shortest signed distance from `position` to card `i` around an `n`-card loop. */
function wrappedOffset(i: number, position: number, n: number): number {
  let d = (i - position) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

/**
 * A horizontal, infinitely-looping "centre stage" carousel: every card sits
 * at the same DOM position and is moved purely with `transform`, so looping
 * is just arithmetic (`wrappedOffset`) rather than cloning cards at the ends.
 * Position lives in a ref and is painted straight to the DOM every animation
 * frame — committing it to React state would re-render on every drag pixel
 * and every auto-scroll tick, which is exactly the kind of thing that makes
 * a "premium, smooth" interaction stutter instead.
 */
export function A12ToolCarousel({ tools }: { tools: string[] }) {
  const n = tools.length;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const position = useRef(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPosition = useRef(0);
  const moved = useRef(false);
  const lastInteraction = useRef(0);

  useEffect(() => {
    if (n === 0) return;

    const paint = () => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const offset = wrappedOffset(i, position.current, n);
        const abs = Math.abs(offset);
        const scale = Math.max(0.52, 1 - abs * 0.17);
        const opacity = Math.max(0.3, 1 - abs * 0.24);
        const z = Math.round(200 - abs * 10);
        el.style.transform = `translate(-50%, -50%) translateX(${offset * CARD_GAP}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(z);
        el.classList.toggle("a12-tool-active", abs < 0.5);
      });
    };

    let raf = 0;
    let last = performance.now();
    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000);
      last = time;
      if (!dragging.current && time - lastInteraction.current > RESUME_DELAY) {
        position.current += AUTO_SPEED * dt;
      }
      paint();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n]);

  function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    moved.current = false;
    dragStartX.current = e.clientX;
    dragStartPosition.current = position.current;
    lastInteraction.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 4) moved.current = true;
    position.current = dragStartPosition.current - dx / CARD_GAP;
    lastInteraction.current = performance.now();
  }

  function pointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    position.current = Math.round(position.current);
    lastInteraction.current = performance.now();
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    position.current += delta / (CARD_GAP * 2.2);
    lastInteraction.current = performance.now();
  }

  function selectCard(i: number) {
    if (moved.current) return; // this click ended a drag, not a tap
    position.current += wrappedOffset(i, position.current, n);
    lastInteraction.current = performance.now();
  }

  return (
    <div
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerLeave={pointerUp}
      onWheel={handleWheel}
      className="relative isolate mx-auto mt-10 h-[210px] max-w-4xl touch-pan-y [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] select-none"
    >
      {tools.map((tool, i) => (
        <div
          key={tool}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          onClick={() => selectCard(i)}
          className={cx(
            "a12-tool-card absolute top-1/2 left-1/2 grid size-24 shrink-0 cursor-pointer",
            "place-items-center rounded-3xl border border-white/15 bg-white/95",
            "shadow-[0_20px_40px_-16px_rgba(0,0,0,0.55)] backdrop-blur-sm will-change-transform",
          )}
        >
          <TechTile name={tool} size={52} />
          <span className="absolute inset-x-0 -bottom-8 text-center text-[11px] font-semibold whitespace-nowrap text-white/70">
            {tool}
          </span>
        </div>
      ))}
    </div>
  );
}
