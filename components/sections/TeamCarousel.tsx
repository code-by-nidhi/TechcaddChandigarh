"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, cx } from "@/components/ui";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const FOUNDER_DESCRIPTION =
  "Founded techcadd in 2016 to close the gap between what students are taught and what employers actually need.";
const MEMBER_DESCRIPTION =
  "Works directly with students in the lab — training, mentoring and keeping every batch on track.";

const BASE_WIDTH = 192;
const FOUNDER_WIDTH = 224;
const EXPAND_MULTIPLIER = 2.25;

/**
 * Each card's own flex-item box stays a fixed size at all times — only an
 * absolutely-positioned overlay child grows on hover. That keeps the track's
 * total content width constant, so the marquee's `translateX(-50%)` loop
 * never has to recompute mid-animation (which is what causes a visible jump
 * or a broken resume point when the hover state changes).
 */
export function TeamCarousel({ team }: { team: { name: string; title: string }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const cards = [...team, ...team];

  return (
    <div
      className="mt-16 w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div
        className="team-marquee flex w-max items-center gap-6"
        style={{
          animationDuration: "30s",
          animationPlayState: hovered !== null ? "paused" : "running",
        }}
      >
        {cards.map((member, pos) => {
          const isFounder = pos % team.length === 0;
          const width = isFounder ? FOUNDER_WIDTH : BASE_WIDTH;
          const height = isFounder ? 500 : 440;
          const isHovered = hovered === pos;
          const isNeighbor = hovered !== null && Math.abs(hovered - pos) === 1;
          const pushPx =
            hovered === null ? 0 : pos < hovered ? -14 : pos > hovered ? 14 : 0;

          return (
            <div
              key={`${member.name}-${pos}`}
              aria-hidden={pos >= team.length}
              onMouseEnter={() => setHovered(pos)}
              onMouseLeave={() => setHovered((h) => (h === pos ? null : h))}
              className="relative shrink-0 transition-transform duration-500 ease-out"
              style={{
                width,
                height,
                transform: isHovered
                  ? "scale(1.05)"
                  : isNeighbor
                    ? `scale(0.92) translateX(${pushPx}px)`
                    : "scale(1)",
                zIndex: isHovered ? 30 : 10,
              }}
            >
              {/* soft glow behind the active card */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-5 rounded-[100px] blur-2xl transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle, rgba(0,212,255,0.4), transparent 70%)",
                  opacity: isHovered ? 1 : 0,
                }}
              />

              {/* base capsule — normal state */}
              <div
                className={cx(
                  "absolute inset-0 flex flex-col items-center overflow-hidden rounded-[100px] border text-center backdrop-blur-xl transition-opacity duration-500",
                  isFounder
                    ? "border-[#00D4FF]/50 shadow-[0_35px_90px_-25px_rgba(0,212,255,0.55)]"
                    : "border-[rgba(255,255,255,0.1)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]",
                  isHovered ? "opacity-0" : "opacity-100",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute inset-0",
                    isFounder
                      ? "bg-gradient-to-b from-[#1E88FF] to-[#00D4FF]"
                      : "bg-gradient-to-b from-white/[0.07] to-white/[0.02]",
                  )}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-8 flex justify-center px-2 font-display text-3xl leading-[0.9] font-extrabold break-all text-white/10 uppercase select-none"
                >
                  {member.name.split(" ")[0]}
                </span>
                <span
                  className={cx(
                    "relative mt-auto grid size-20 shrink-0 place-items-center rounded-full font-display text-xl font-bold text-white shadow-[0_16px_30px_-12px_rgba(0,0,0,0.5)]",
                    isFounder ? "bg-white/20" : "bg-gradient-to-br from-[#1E88FF] to-[#00D4FF]",
                  )}
                >
                  {initials(member.name)}
                </span>
                <div className="relative mt-5 mb-7 px-4">
                  <p className="font-display text-sm leading-tight font-bold tracking-tight text-white">
                    {member.name}
                  </p>
                  <p className="mt-1 text-xs text-white/60">{member.title}</p>
                  <span className="mx-auto mt-3 block h-px w-8 bg-gradient-to-r from-[#00D4FF] to-[#1E88FF]" />
                  <span className="mx-auto mt-3 grid size-7 place-items-center rounded-full border border-white/15 text-white/50">
                    <Icon name="linkedin" className="size-3.5" />
                  </span>
                </div>
              </div>

              {/* expanded overlay — hover state, grows from the card's own width */}
              <div
                aria-hidden={!isHovered}
                className="absolute top-0 left-1/2 flex h-full flex-col items-center justify-center overflow-hidden rounded-[48px] border border-[#00D4FF]/50 bg-gradient-to-b from-[#0F2E6D]/95 to-[#050B1D]/95 text-center backdrop-blur-2xl"
                style={{
                  width: isHovered ? width * EXPAND_MULTIPLIER : width,
                  opacity: isHovered ? 1 : 0,
                  transform: "translateX(-50%)",
                  transitionProperty: "width, opacity",
                  transitionDuration: "0.6s",
                  transitionTimingFunction: "cubic-bezier(0.34, 1.3, 0.4, 1)",
                  boxShadow: isHovered
                    ? "0 40px 100px -20px rgba(0,212,255,0.6)"
                    : "none",
                  pointerEvents: isHovered ? "auto" : "none",
                }}
              >
                <span
                  className={cx(
                    "grid size-20 shrink-0 place-items-center rounded-full font-display text-xl font-bold text-white shadow-[0_16px_30px_-12px_rgba(0,0,0,0.5)] transition-opacity duration-300",
                    isFounder ? "bg-white/20" : "bg-gradient-to-br from-[#1E88FF] to-[#00D4FF]",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                >
                  {initials(member.name)}
                </span>
                <p
                  className={cx(
                    "mt-4 font-display text-lg font-bold tracking-tight text-white transition-opacity delay-100 duration-300",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                >
                  {member.name}
                </p>
                <p
                  className={cx(
                    "mt-1 text-xs font-semibold tracking-wide text-[#00D4FF] uppercase transition-opacity delay-100 duration-300",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                >
                  {member.title}
                </p>
                <p
                  className={cx(
                    "mt-3 max-w-[220px] px-4 text-xs leading-relaxed text-white/65 transition-opacity delay-150 duration-300",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                >
                  {member.title === "Founder & CEO" ? FOUNDER_DESCRIPTION : MEMBER_DESCRIPTION}
                </p>
                <div
                  className={cx(
                    "mt-5 flex items-center gap-3 transition-opacity delay-200 duration-300",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="grid size-8 place-items-center rounded-full border border-white/20 text-white/60 transition-colors duration-300 hover:border-[#00D4FF]/60 hover:text-[#00D4FF]">
                    <Icon name="linkedin" className="size-4" />
                  </span>
                  <Link
                    href="/contact#enquire"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-hero-950 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    View Profile
                    <Icon name="arrow-right" className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
