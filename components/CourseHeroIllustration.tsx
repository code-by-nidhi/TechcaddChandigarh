"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Icon } from "./ui";
import { getCategory, type Course } from "@/data/courses";

const ORBIT_ICONS = ["mail", "monitor", "cloud", "chart", "shield", "box"];

/** Distinct duration/delay per orbiting chip so they read as independent, not synced. */
const DRIFT = [
  { duration: 6.5, delay: 0 },
  { duration: 8.2, delay: 0.4 },
  { duration: 7.1, delay: 0.9 },
  { duration: 9.4, delay: 0.2 },
  { duration: 6.8, delay: 0.7 },
  { duration: 8.6, delay: 0.5 },
];

/** Fixed (not randomised) positions — this renders on the server-hydrated
 * client on first paint too, and `Math.random()` there would mismatch. */
const PARTICLES = [
  { top: "6%", left: "14%", size: 5, duration: 7, delay: 0 },
  { top: "16%", left: "84%", size: 4, duration: 9, delay: 1.2 },
  { top: "74%", left: "8%", size: 5, duration: 8, delay: 0.6 },
  { top: "88%", left: "76%", size: 4, duration: 6.5, delay: 1.8 },
  { top: "42%", left: "94%", size: 3, duration: 10, delay: 0.3 },
  { top: "52%", left: "2%", size: 3, duration: 7.5, delay: 1.5 },
];

/** The site's established premium ease — used for every hover transition elsewhere. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Wraps a course's hero artwork (real photo or the generic icon fallback) in
 * a floating, parallax, glowing "alive" illustration — the artwork itself is
 * never touched, only the motion layers around and behind it.
 */
export function CourseHeroIllustration({ course }: { course: Course }) {
  const category = getCategory(course.category);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(mvY, { stiffness: 120, damping: 20, mass: 0.5 });
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleMouseLeave() {
    mvX.set(0);
    mvY.set(0);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative isolate mx-auto hidden aspect-square w-full max-w-sm lg:block"
    >
      {/* Soft radial glow behind everything, slowly pulsing */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-8 rounded-full bg-gradient-to-br from-[#1E88FF] to-[#00D4FF] opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
        animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft floating particles */}
      {!reduced &&
        PARTICLES.map((p, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="twinkle float-slow pointer-events-none absolute rounded-full bg-[#00D4FF] shadow-[0_0_10px_2px_rgba(0,212,255,0.7)]"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ["--twinkle-delay" as string]: `${p.delay}s`,
            }}
          />
        ))}

      {/* Slow up/down float for the whole illustration */}
      <motion.div
        className="absolute inset-0"
        animate={reduced ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      >
        {/* Mouse parallax */}
        <motion.div className="relative size-full" style={{ x: parallaxX, y: parallaxY }}>
          {/* Hover lift + scale */}
          <motion.div
            className="relative isolate size-full"
            whileHover={{ scale: 1.045, y: -6 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {course.heroImage ? (
              <Image
                src={course.heroImage}
                alt={`${course.name} course illustration`}
                fill
                sizes="384px"
                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.45)] transition-[filter] duration-500 group-hover:drop-shadow-[0_35px_60px_rgba(0,212,255,0.4)]"
                priority
              />
            ) : (
              <span className="absolute top-1/2 left-1/2 grid size-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#1E88FF] to-[#00D4FF] shadow-[0_30px_70px_-20px_rgba(0,212,255,0.6)] transition-shadow duration-500 group-hover:shadow-[0_35px_85px_-15px_rgba(0,212,255,0.9)]">
                <Icon name={category.icon} className="size-16 text-white" />
              </span>
            )}
          </motion.div>

          {/* Surrounding accessory icons — independent drift, different speeds */}
          {ORBIT_ICONS.map((iconName, i) => {
            const angle = (i / ORBIT_ICONS.length) * Math.PI * 2;
            const x = 50 + Math.cos(angle) * 38;
            const y = 50 + Math.sin(angle) * 38;
            const drift = DRIFT[i % DRIFT.length]!;
            return (
              <span
                key={iconName}
                aria-hidden="true"
                className="float-slow absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-sm"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDuration: reduced ? "0s" : `${drift.duration}s`,
                  animationDelay: `${drift.delay}s`,
                }}
              >
                <Icon name={iconName} className="size-5" />
              </span>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
