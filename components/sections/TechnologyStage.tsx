"use client";

import { useState } from "react";
import { techGroups } from "@/data/content";
import { TechTile } from "@/components/TechTile";
import { cx } from "@/components/ui";

/* -------------------------------------------------------------------------- */
/*                              Stage geometry                                 */
/* -------------------------------------------------------------------------- */

/** Design box everything is positioned inside, then scaled to the stage width. */
const BOX = { w: 546, h: 350 };
/** The folder, given by its centre. Drawn as its own SVG so it never skews. */
const FOLDER = { x: 273, y: 272, w: 216, h: 118 };

/**
 * Everything above the folder radiates from one point just inside its mouth, so
 * the rings, the spokes and the tools all share a single origin — that shared
 * origin is what makes the tools read as rays thrown out of the folder rather
 * than a cluster that happens to sit above it.
 */
const ORIGIN = { x: 273, y: 252 };
/** Half-axes of the outermost ring. Every other distance is a share of these. */
const REACH = { x: 262, y: 212 };
/**
 * How many tools ride each ring, from the folder outwards, for a stack of that
 * size. A fixed set of seats left the sparse stacks lopsided — seats fill in
 * order, so a seven-tool stack simply never reached the ones on the right. Every
 * plan here is symmetric and widens as it goes out, so the dome fills evenly
 * whether a stack has six tools or ten.
 */
const TIERS: Record<number, number[]> = {
  1: [1],
  2: [2],
  3: [1, 2],
  4: [1, 3],
  5: [2, 3],
  6: [1, 2, 3],
  7: [1, 2, 4],
  8: [1, 3, 4],
  9: [2, 3, 4],
  10: [2, 3, 4, 1],
};

/** How far out each ring sits, keyed by how many rings the plan uses. */
const REACHES: Record<number, number[]> = {
  1: [0.36],
  2: [0.26, 0.68],
  3: [0.16, 0.5, 0.8],
  4: [0.2, 0.5, 0.78, 0.97],
};

/**
 * Degrees between neighbours on a tier of this size. A pair straddles widely so
 * it holds both flanks of the dome; three or more pack evenly, since the tier
 * has enough tools to cover the arc on its own.
 */
const SPREAD: Record<number, number> = { 1: 0, 2: 90, 3: 34, 4: 35 };

interface Ray {
  angle: number;
  reach: number;
  size: number;
}

/**
 * Builds the rays for a stack of `count` tools: tiers fan symmetrically about
 * 270° (straight up), tools shrink as they travel further out, and a smaller
 * stack sizes its tools up a little so it still fills the dome.
 *
 * Neighbours sit {@link SPREAD} degrees apart, or further when the tiles are
 * physically too wide for that at this radius — an inner ring is short, so the
 * same gap in pixels costs far more degrees there than on an outer one.
 */
function rayLayout(count: number): Ray[] {
  const plan = TIERS[Math.min(Math.max(count, 1), 10)];
  const reaches = REACHES[plan.length];
  const scale = 1 + (10 - count) * 0.02;

  return plan.flatMap((seats, tier) => {
    const reach = reaches[tier];
    const size = (11.8 - 3.7 * reach) * scale;
    const clearance = (((size / 100) * BOX.w + 12) / (REACH.x * reach)) * (180 / Math.PI);
    const spacing = Math.max(SPREAD[seats] ?? 34, clearance);

    return Array.from({ length: seats }, (_, i) => ({
      angle: seats === 1 ? 270 : 270 + (i - (seats - 1) / 2) * spacing,
      reach,
      size,
    }));
  });
}

/**
 * The dashed rings for a layout: one under every tier far enough out to clear
 * the folder, plus a mid and an outer ring so the backdrop never thins out when
 * a stack uses only a couple of tiers.
 */
const ringsFor = (rays: Ray[]) =>
  [...new Set([...rays.map((ray) => ray.reach).filter((reach) => reach >= 0.4), 0.5, 0.97])].sort(
    (a, b) => a - b,
  );

/** A point at `reach` along `angle`, in design units. */
const along = (angle: number, reach: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: ORIGIN.x + REACH.x * reach * Math.cos(rad),
    y: ORIGIN.y + REACH.y * reach * Math.sin(rad),
  };
};

/** Faint marks drifting in the background, purely decorative. */
const GHOSTS = [
  { x: 92, y: 44, size: 4.4 },
  { x: 452, y: 60, size: 3.6 },
  { x: 60, y: 176, size: 3.4 },
  { x: 486, y: 196, size: 4.6 },
  { x: 118, y: 268, size: 3.2 },
  { x: 430, y: 274, size: 3.8 },
];

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/* -------------------------------------------------------------------------- */
/*                                   Section                                   */
/* -------------------------------------------------------------------------- */

export function TechnologyStage() {
  const [active, setActive] = useState(techGroups[0].name);
  const group = techGroups.find((item) => item.name === active) ?? techGroups[0];
  // A stack shows at most ten tools, and the dome is rebuilt around however
  // many that turns out to be.
  const shown = group.items.slice(0, 10);
  const rays = rayLayout(shown.length);
  const rings = ringsFor(rays);

  return (
    <div>
      {/* The nav. Each tab reloads the folder with that stack. */}
      <div
        role="tablist"
        aria-label="Technology stacks"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {techGroups.map((item) => {
          const selected = item.name === active;
          return (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(item.name)}
              className={cx(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-200",
                selected
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-line bg-white text-muted hover:border-brand-300 hover:text-foreground",
              )}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <div
          className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[28px] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-accent-500/10"
          style={{ aspectRatio: `${BOX.w} / ${BOX.h}`, containerType: "inline-size" }}
        >
          {/* The rings the tools settle on, and the spokes they travel out along,
              both struck from the folder mouth. */}
          <svg
            viewBox={`0 0 ${BOX.w} ${BOX.h}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full text-brand-300"
            aria-hidden="true"
          >
            {rays.map((ray) => {
              const end = along(ray.angle, rings[rings.length - 1]);
              return (
                <line
                  key={`${ray.angle}-${ray.reach}`}
                  x1={ORIGIN.x}
                  y1={ORIGIN.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="currentColor"
                  strokeWidth={0.7}
                  strokeDasharray="2 7"
                  opacity={0.4}
                />
              );
            })}
            {rings.map((ring) => (
              <ellipse
                key={ring}
                cx={ORIGIN.x}
                cy={ORIGIN.y}
                rx={REACH.x * ring}
                ry={REACH.y * ring}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.8}
                strokeDasharray="3 6"
                opacity={0.5}
              />
            ))}
          </svg>

          {GHOSTS.map((ghost) => (
            <span
              key={`${ghost.x}-${ghost.y}`}
              aria-hidden="true"
              style={{
                left: pct(ghost.x, BOX.w),
                top: pct(ghost.y, BOX.h),
                width: `${ghost.size}cqw`,
                height: `${ghost.size}cqw`,
                borderRadius: `${ghost.size * 0.3}cqw`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 border border-brand-200/70 bg-brand-100/40"
            />
          ))}

          {/* Folder back leaf — painted under the tools. */}
          <FolderPart layer="back" />

          {/* The software for the selected stack. Remounting on `active` is what
              replays the entrance, so switching tabs refills the folder. */}
          <div key={active} className="absolute inset-0">
            {shown.map((item, i) => {
              const ray = rays[i];
              const seat = along(ray.angle, ray.reach);
              return (
                <span
                  key={item}
                  style={{ left: pct(seat.x, BOX.w), top: pct(seat.y, BOX.h) }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  {/* Entrance and idle float are separate elements because both
                      animate `transform`, and the seat itself is already using
                      one to centre the tile. */}
                  <span style={{ animationDelay: `${i * 60}ms` }} className="tool-in block">
                    <span
                      style={{ animationDelay: `${i * 220}ms` }}
                      className="float-slow group/tile relative block"
                    >
                      {/* The label sits below the tile: the outermost tool is
                          flush with the top of the stage, and a label above it
                          would be cut off by the panel's rounded clip. */}
                      <span className="pointer-events-none absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-[11px] leading-none font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tile:opacity-100">
                        {item}
                      </span>
                      <TechTile
                        name={item}
                        size={ray.size}
                        className="transition-transform duration-200 group-hover/tile:scale-110"
                      />
                    </span>
                  </span>
                </span>
              );
            })}
          </div>

          {/* Folder front pocket — painted over the tools, so the lowest two are
              cropped by its lip and read as dropping inside. */}
          <FolderPart layer="front" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Folder                                    */
/* -------------------------------------------------------------------------- */

/**
 * The folder is split in two so the tool layer can be sandwiched between its
 * halves. Both are positioned identically and keep their own aspect ratio, so
 * the curves never stretch with the stage.
 */
function FolderPart({ layer }: { layer: "back" | "front" }) {
  return (
    <span
      aria-hidden="true"
      style={{
        left: pct(FOLDER.x, BOX.w),
        top: pct(FOLDER.y, BOX.h),
        width: pct(FOLDER.w, BOX.w),
      }}
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
    >
      <svg viewBox="0 0 168 92" className="w-full">
        <defs>
          <linearGradient id={`folder-${layer}`} x1="0" y1="0" x2="0.45" y2="1">
            {layer === "back" ? (
              <>
                <stop offset="0" stopColor="#bcd9f8" />
                <stop offset="1" stopColor="#8fbcf0" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#7db2f2" />
                <stop offset="1" stopColor="#3f7fd4" />
              </>
            )}
          </linearGradient>
        </defs>

        {layer === "back" ? (
          <path
            d="M20 6h44l9 10h68a8 8 0 0 1 8 8v44H12V14a8 8 0 0 1 8-8Z"
            fill={`url(#folder-${layer})`}
          />
        ) : (
          <path
            d="M2 34a10 10 0 0 1 10-10h144a10 10 0 0 1 10 10l-8 46a10 10 0 0 1-10 8H20a10 10 0 0 1-10-8Z"
            fill={`url(#folder-${layer})`}
          />
        )}
      </svg>
    </span>
  );
}
