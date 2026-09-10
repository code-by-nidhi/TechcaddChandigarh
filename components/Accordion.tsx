"use client";

import { useState } from "react";
import { Icon, cx } from "./ui";

export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({
  items,
  defaultOpen = 0,
  className,
  onDark = false,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
  /** Invert the rules, labels and marker for a dark section. */
  onDark?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div
      className={cx(
        "divide-y border-y",
        onDark ? "divide-white/12 border-white/12" : "divide-line border-line",
        className,
      )}
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cx(
                    "font-display text-base font-semibold transition-colors lg:text-lg",
                    isOpen
                      ? onDark
                        ? "text-accent-400"
                        : "text-brand-600"
                      : onDark
                        ? "text-white"
                        : "text-foreground",
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cx(
                    "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isOpen
                      ? onDark
                        ? "border-accent-400 bg-accent-400 text-hero-950"
                        : "border-brand-600 bg-brand-600 text-white"
                      : onDark
                        ? "border-white/25 text-brand-100/70"
                        : "border-line text-muted",
                  )}
                >
                  <Icon name={isOpen ? "minus" : "plus"} className="size-3.5" />
                </span>
              </button>
            </h3>
            <div
              className={cx(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cx(
                    "pr-12 pb-5 text-sm leading-relaxed lg:text-base",
                    onDark ? "text-brand-100/70" : "text-muted",
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
