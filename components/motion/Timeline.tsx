"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Marks each milestone `passed` / `current` / `upcoming` as the list scrolls,
 * which is what drives the dimming and the blue year cards in `globals.css`.
 *
 * The `timeline-ready` class is only added once the observer is wired up, so a
 * visitor without JavaScript sees every milestone at full contrast instead of
 * a column of blurred cards.
 */
export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-timeline-item]"));
    if (!items.length) return;

    root.classList.add("timeline-ready");

    const paint = () => {
      const line = window.innerHeight * 0.62;
      let current = -1;

      items.forEach((item, i) => {
        if (item.getBoundingClientRect().top <= line) current = i;
      });

      items.forEach((item, i) => {
        item.dataset.state = i < current ? "passed" : i === current ? "current" : "upcoming";
      });
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        paint();
      });
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.classList.remove("timeline-ready");
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
