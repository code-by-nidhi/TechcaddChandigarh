"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TechMark, type TechName } from "@/components/TechMark";

gsap.registerPlugin(MotionPathPlugin);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------------------
   Board geometry
   --------------------------------------------------------------------------- */
const W = 1200;
const H = 700;

/** Where every trace converges — the centre of the board. */
const HUB: [number, number] = [600, 600];

type Point = [number, number];

/**
 * Turns an orthogonal polyline into a path with rounded corners, the way a
 * circuit trace bends. Authoring the corners by hand is fiddly and easy to get
 * subtly wrong, and this keeps every bend identical.
 *
 * The radius shrinks on short segments so a corner can never overshoot the
 * segment it sits on and fold the path back on itself.
 */
function trace(points: Point[], radius = 20): string {
  let d = `M${points[0][0]} ${points[0][1]}`;

  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];

    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radius, inLen / 2, outLen / 2);

    const inX = Math.sign(cx - px);
    const inY = Math.sign(cy - py);
    const outX = Math.sign(nx - cx);
    const outY = Math.sign(ny - cy);

    d += `L${cx - inX * r} ${cy - inY * r}`;
    d += `Q${cx} ${cy} ${cx + outX * r} ${cy + outY * r}`;
  }

  const [lx, ly] = points[points.length - 1];
  return `${d}L${lx} ${ly}`;
}

/**
 * Traces run off the edge of the board wherever possible, so a pulse resetting
 * to the start of its loop happens out of frame. `speed` is seconds end to end.
 */
const TRACES: { points: Point[]; speed: number; delay: number }[] = [
  { points: [HUB, [400, 600], [400, 510], [150, 510], [150, 340], [-40, 340]], speed: 7.5, delay: 0 },
  { points: [HUB, [800, 600], [800, 510], [1050, 510], [1050, 340], [1240, 340]], speed: 7.5, delay: 1.6 },
  { points: [HUB, [600, 670], [300, 670], [300, 760]], speed: 5, delay: 3.2 },
  { points: [HUB, [600, 655], [900, 655], [900, 760]], speed: 5, delay: 0.8 },
  { points: [[-40, 520], [180, 520], [180, 615], [500, 615], [500, 760]], speed: 6.5, delay: 2.4 },
  { points: [[1240, 530], [1010, 530], [1010, 615], [760, 615], [760, 760]], speed: 6.5, delay: 4 },
  { points: [[90, -40], [90, 230], [250, 230], [250, 400]], speed: 5.5, delay: 1.2 },
  { points: [[1110, -40], [1110, 220], [950, 220], [950, 400]], speed: 5.5, delay: 2.8 },
];

/** Every node sits on a straight run of a trace, never on a bend. */
const NODES: { tech: TechName; x: number; y: number; label: string }[] = [
  { tech: "react", x: 500, y: 600, label: "React" },
  { tech: "python", x: 275, y: 510, label: "Python" },
  { tech: "node", x: 150, y: 425, label: "Node.js" },
  { tech: "javascript", x: 60, y: 340, label: "JavaScript" },
  { tech: "docker", x: 700, y: 600, label: "Docker" },
  { tech: "kubernetes", x: 930, y: 510, label: "Kubernetes" },
  { tech: "aws", x: 1050, y: 425, label: "AWS" },
  { tech: "git", x: 1140, y: 340, label: "Git" },
  { tech: "figma", x: 400, y: 670, label: "Figma" },
  { tech: "sql", x: 780, y: 655, label: "SQL" },
  { tech: "java", x: 180, y: 565, label: "Java" },
  { tech: "cloud", x: 880, y: 615, label: "Cloud" },
  { tech: "ai", x: 250, y: 400, label: "Artificial intelligence" },
  { tech: "typescript", x: 950, y: 400, label: "TypeScript" },
  { tech: "chip", x: 90, y: 130, label: "Machine learning" },
];

const TILE = 54;
const HUB_R = 30;

/** Traces whose pulse runs gold, tying the board to the headline highlight. */
const GOLD_PULSES = new Set([1, 4, 7]);

/* --------------------------------------------------------------------------- */

export function HeroCircuit({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Each node bobs on its own loop. Seeding the offsets from the index keeps
      // the drift irregular without a random value that would differ between the
      // server render and the client.
      gsap.utils.toArray<SVGGElement>("[data-node]").forEach((node, i) => {
        gsap.to(node, {
          y: i % 2 ? 7 : -8,
          duration: 3 + (i % 4) * 0.45,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: (i % 5) * 0.4,
        });
      });

      // A pulse rides each trace, so the board reads as live traffic rather than
      // decoration. It fades at both ends to hide the loop reset.
      TRACES.forEach((spec, i) => {
        const path = el.querySelector<SVGPathElement>(`#hc-trace-${i}`);
        const pulse = el.querySelector<SVGCircleElement>(`#hc-pulse-${i}`);
        if (!path || !pulse) return;

        gsap
          .timeline({ repeat: -1, delay: spec.delay })
          .set(pulse, { opacity: 0 })
          .to(
            pulse,
            {
              motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
              duration: spec.speed,
              ease: "none",
            },
            0,
          )
          .to(pulse, { opacity: 1, duration: 0.5 }, 0)
          .to(pulse, { opacity: 0, duration: 0.5 }, spec.speed - 0.5);
      });

      gsap.to("[data-hub-ring]", {
        scale: 1.35,
        opacity: 0,
        duration: 2.6,
        repeat: -1,
        ease: "power1.out",
        svgOrigin: `${HUB[0]} ${HUB[1]}`,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hc-glow">
          <stop offset="0%" stopColor="#2f7dff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2f7dff" stopOpacity="0" />
        </radialGradient>
        <filter id="hc-pulse-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Light pooling around the hub so the centre of the board reads first */}
      <circle cx={HUB[0]} cy={HUB[1]} r="330" fill="url(#hc-glow)" />

      {/* The traces themselves */}
      <g fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="2" strokeLinecap="round">
        {TRACES.map((spec, i) => (
          <path key={i} id={`hc-trace-${i}`} d={trace(spec.points)} />
        ))}
      </g>

      {/* Travelling pulses — a soft halo behind a hard dot */}
      <g>
        {TRACES.map((_, i) => (
          <g key={i} id={`hc-pulse-${i}`} opacity="0">
            <circle
              r="7"
              fill={GOLD_PULSES.has(i) ? "#ffd23f" : "#22d3ee"}
              fillOpacity="0.55"
              filter="url(#hc-pulse-glow)"
            />
            <circle r="3.4" fill="#ffffff" />
          </g>
        ))}
      </g>

      {/* Technology nodes */}
      {NODES.map((node) => (
        <g key={node.label} transform={`translate(${node.x} ${node.y})`}>
          <g data-node className="text-white/70">
            <rect
              x={-TILE / 2}
              y={-TILE / 2}
              width={TILE}
              height={TILE}
              rx="16"
              fill="#0b1a4d"
              fillOpacity="0.75"
              stroke="#ffffff"
              strokeOpacity="0.16"
            />
            <g transform="translate(-13 -13) scale(1.0833)">
              <TechMark name={node.tech} />
            </g>
          </g>
        </g>
      ))}

      {/* The hub every trace runs into — the techcadd mark itself */}
      <g>
        <circle
          data-hub-ring
          cx={HUB[0]}
          cy={HUB[1]}
          r={HUB_R}
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.6"
          strokeWidth="2"
        />
        <circle
          cx={HUB[0]}
          cy={HUB[1]}
          r={HUB_R}
          fill="#060e2b"
          stroke="#22d3ee"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
        <text
          x={HUB[0]}
          y={HUB[1]}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-inter), ui-sans-serif, system-ui, sans-serif"
          fontSize="34"
          fontWeight="800"
          fill="#22d3ee"
        >
          t
        </text>
      </g>
    </svg>
  );
}
