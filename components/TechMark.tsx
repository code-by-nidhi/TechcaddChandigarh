import type { ReactNode } from "react";

/**
 * Monochrome marks for the technologies taught, drawn in a 24×24 box so they
 * drop straight into the hero circuit at any scale.
 *
 * Everything inherits `currentColor`, so a mark takes the colour of whatever
 * node it sits in. Kept here rather than in the general `Icon` set because these
 * are product logos rather than UI glyphs, and they are stroked at a heavier
 * weight so they stay legible at 26px on a dark surface.
 */
export type TechName =
  | "react"
  | "python"
  | "node"
  | "javascript"
  | "typescript"
  | "docker"
  | "kubernetes"
  | "aws"
  | "git"
  | "figma"
  | "sql"
  | "java"
  | "cloud"
  | "ai"
  | "chip";

/** The Python mark is its own 180° rotation, so only half of it is authored. */
const PYTHON_HALF =
  "M12 2c-2.7 0-4.6.5-4.6 2.6v2.1h4.8v1.1H5.5C3.4 7.8 2 9.5 2 12s1.4 4.2 3.5 4.2h1.4v-2.7c0-2.1 " +
  "1.7-3.8 3.8-3.8h4c1.7 0 3.1-1.4 3.1-3.1V4.6C17.8 2.6 15.6 2 12 2Z M9.5 5.3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z";

/** Kubernetes is a seven-sided helm — computed so the vertices stay exact. */
const HEPTAGON = Array.from({ length: 7 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
  return `${(12 + 9.4 * Math.cos(angle)).toFixed(2)} ${(12 + 9.4 * Math.sin(angle)).toFixed(2)}`;
}).join("L");

const SPOKES = Array.from({ length: 7 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return `M${(12 + 3.2 * cos).toFixed(2)} ${(12 + 3.2 * sin).toFixed(2)}L${(12 + 6.4 * cos).toFixed(2)} ${(
    12 +
    6.4 * sin
  ).toFixed(2)}`;
}).join("");

const LETTER = {
  fontSize: 8.4,
  fontWeight: 700,
  textAnchor: "middle" as const,
  fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
};

const MARKS: Record<TechName, ReactNode> = {
  react: (
    <>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10.2" ry="3.9" />
      <ellipse cx="12" cy="12" rx="10.2" ry="3.9" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10.2" ry="3.9" transform="rotate(120 12 12)" />
    </>
  ),

  python: (
    <g fill="currentColor" fillRule="evenodd" stroke="none">
      <path d={PYTHON_HALF} />
      <path d={PYTHON_HALF} transform="rotate(180 12 12)" />
    </g>
  ),

  node: (
    <>
      <path d="M12 2.3 20.4 7v10L12 21.7 3.6 17V7Z" />
      <path d="M12 7.6 16.2 10v4L12 16.4 7.8 14v-4Z" />
    </>
  ),

  javascript: (
    <>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="3.6" />
      <text x="12" y="15.6" fill="currentColor" stroke="none" {...LETTER}>
        JS
      </text>
    </>
  ),

  typescript: (
    <>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="3.6" />
      <text x="12" y="15.6" fill="currentColor" stroke="none" {...LETTER}>
        TS
      </text>
    </>
  ),

  docker: (
    <>
      <rect x="4.6" y="10.4" width="3.3" height="3.3" rx="0.4" />
      <rect x="8.3" y="10.4" width="3.3" height="3.3" rx="0.4" />
      <rect x="12" y="10.4" width="3.3" height="3.3" rx="0.4" />
      <rect x="8.3" y="6.8" width="3.3" height="3.3" rx="0.4" />
      <rect x="12" y="6.8" width="3.3" height="3.3" rx="0.4" />
      <path d="M2.4 14.6h17.9c-.5 3-2.9 5-6.4 5H8.7c-3.4 0-5.8-2-6.3-5Z" />
      <path d="M17.2 9.7c1.1-.8 2.6-.5 3.2.4" />
    </>
  ),

  kubernetes: (
    <>
      <path d={`M${HEPTAGON}Z`} />
      <circle cx="12" cy="12" r="3.2" />
      <path d={SPOKES} />
    </>
  ),

  aws: (
    <>
      <text x="12" y="12.4" fill="currentColor" stroke="none" {...LETTER} fontSize={8}>
        aws
      </text>
      <path d="M3.6 16.4c5 2.9 11.8 2.9 16.8 0" />
      <path d="m17.9 15.4 2.9.8-.7 2.8" />
    </>
  ),

  git: (
    <>
      <rect x="5.05" y="5.05" width="13.9" height="13.9" rx="2" transform="rotate(45 12 12)" />
      <circle cx="12" cy="15.7" r="1.5" />
      <circle cx="12" cy="9.7" r="1.5" />
      <circle cx="15.5" cy="12.6" r="1.5" />
      <path d="M12 14.2v-3M12.9 13.3l1.4-.9" />
    </>
  ),

  figma: (
    <g fill="currentColor" stroke="none">
      <path d="M8.6 2H12v6H8.6a3 3 0 1 1 0-6Z" fillOpacity="0.95" />
      <path d="M12 2h3.4a3 3 0 1 1 0 6H12V2Z" fillOpacity="0.7" />
      <path d="M8.6 8H12v6H8.6a3 3 0 1 1 0-6Z" fillOpacity="0.85" />
      <circle cx="15.4" cy="11" r="3" fillOpacity="0.6" />
      <path d="M12 14v3a3 3 0 1 1-3-3h3Z" fillOpacity="0.95" />
    </g>
  ),

  sql: (
    <>
      <ellipse cx="12" cy="5.8" rx="7.4" ry="2.9" />
      <path d="M4.6 5.8v12.4c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V5.8" />
      <path d="M4.6 12c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9" />
    </>
  ),

  java: (
    <>
      <path d="M6.2 12.6h9.6v4a3.4 3.4 0 0 1-3.4 3.4H9.6a3.4 3.4 0 0 1-3.4-3.4v-4Z" />
      <path d="M15.8 14h1.4a2.1 2.1 0 1 1 0 4.2h-1.4" />
      <path d="M10.2 10.2c-1.3-1.5.5-2.5 1.1-3.6.5-1 .2-2-.7-2.8" />
      <path d="M13.8 10.2c-.8-1 .4-1.8.8-2.6" />
      <path d="M5.4 22h13.2" />
    </>
  ),

  cloud: [{ d: "M7 18a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1 .5 7L7 18Z" }].map((p) => (
    <path key={p.d} d={p.d} />
  )),

  ai: (
    <g fill="currentColor" stroke="none">
      <path d="M12 3.2 13.8 8.2 18.8 10 13.8 11.8 12 16.8 10.2 11.8 5.2 10 10.2 8.2 12 3.2Z" />
      <path d="M18.4 15.4 19.2 17.5 21.3 18.3 19.2 19.1 18.4 21.2 17.6 19.1 15.5 18.3 17.6 17.5 18.4 15.4Z" />
    </g>
  ),

  chip: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.2" />
      <rect x="9" y="9" width="6" height="6" rx="1.2" />
      <path d="M9.5 1.8v2.2M14.5 1.8v2.2M9.5 20v2.2M14.5 20v2.2M1.8 9.5H4M1.8 14.5H4M20 9.5h2.2M20 14.5h2.2" />
    </>
  ),
};

export function TechMark({ name }: { name: TechName }) {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {MARKS[name]}
    </g>
  );
}
