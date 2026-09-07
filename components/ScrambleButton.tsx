"use client";

import { useRef } from "react";
import Link from "next/link";
import { cx, Icon } from "@/components/ui";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SCRAMBLE_DURATION_MS = 550;

/**
 * Rapidly cycles random characters before locking each one in, left to
 * right. Timed against the wall clock (not a frame count) so it always
 * finishes in ~550ms regardless of the device's actual frame rate, and
 * `token` lets a fresh hover cancel whatever scramble is still mid-flight.
 */
function scramble(el: HTMLElement, text: string, token: { current: number }, myToken: number) {
  const start = performance.now();

  const tick = (now: number) => {
    if (token.current !== myToken) return;
    const progress = Math.min(1, (now - start) / SCRAMBLE_DURATION_MS);

    let out = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === " ") {
        out += " ";
        continue;
      }
      const charThreshold = i / text.length;
      out += progress >= charThreshold ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    el.textContent = out;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = text;
    }
  };
  requestAnimationFrame(tick);
}

/**
 * A pill button styled like `ButtonLink`'s `onDarkGhost` variant, with a
 * hover-triggered letter-scramble reveal and a crossfading icon pair —
 * modelled on Taste Labs' hero CTA.
 */
export function ScrambleButton({
  href,
  children,
  className,
}: {
  href: string;
  children: string;
  className?: string;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const tokenRef = useRef(0);

  function onHover() {
    const el = textRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tokenRef.current += 1;
    scramble(el, children, tokenRef, tokenRef.current);
  }

  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cx(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-white/50 hover:bg-white/10",
        className,
      )}
    >
      <span ref={textRef}>{children}</span>
      <span className="relative inline-flex size-4 shrink-0">
        <Icon
          name="arrow-right"
          className="absolute inset-0 size-4 transition-opacity duration-300 group-hover:opacity-0"
        />
        <Icon
          name="arrow-up-right"
          className="absolute inset-0 size-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </span>
    </Link>
  );
}
