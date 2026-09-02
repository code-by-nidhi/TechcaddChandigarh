"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SELECTOR =
  "[data-reveal], [data-reveal-words], [data-reveal-line], [data-reveal-draw], [data-reveal-pop], [data-reveal-fade]";

/**
 * Drives the `data-reveal*` transitions defined in `globals.css`.
 *
 * The hidden state only exists while `reveal-ready` is on the document, and
 * that class is added in a layout effect — before the first paint, and only on
 * the client. So the server render is fully visible, there is no flash, and a
 * visitor without JavaScript never ends up with a blank page.
 *
 * Elements are unobserved once revealed: this plays once, not on every pass.
 */
export function RevealScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR));
    if (!targets.length) return;

    const reveal = (el: HTMLElement) => el.setAttribute("data-revealed", "");

    // No IntersectionObserver (or reduced motion): show everything, skip the work.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targets.forEach(reveal);
      return;
    }

    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      // threshold 0 rather than a ratio: an element taller than the viewport
      // would never reach one, and the timeline column is exactly that.
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
