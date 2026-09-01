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
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className={cx("divide-y divide-line border-y border-line", className)}>
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
                    isOpen ? "text-brand-600" : "text-foreground",
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cx(
                    "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isOpen
                      ? "border-brand-600 bg-brand-600 text-white"
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
                <p className="pr-12 pb-5 text-sm leading-relaxed text-muted lg:text-base">
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
