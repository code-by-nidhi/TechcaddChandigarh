"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cx } from "@/components/ui";

/**
 * No cards, no icons, no stats — just the course names themselves, rendered
 * as a network. Hovering a name lights up everything it's directly wired to;
 * everything else recedes.
 */

type Cluster = "web" | "ai" | "cloud" | "cyber" | "design" | "cad" | "marketing" | "finance";
type Size = "sm" | "md" | "lg";

interface NetworkNode {
  id: string;
  label: string;
  cluster: Cluster;
  size: Size;
  /** Position as a percentage of the stage. */
  x: number;
  y: number;
}

const NODES: NetworkNode[] = [
  { id: "html", label: "HTML", cluster: "web", size: "sm", x: 13, y: 16 },
  { id: "css", label: "CSS", cluster: "web", size: "sm", x: 25, y: 11 },
  { id: "javascript", label: "JavaScript", cluster: "web", size: "lg", x: 12, y: 27 },
  { id: "react", label: "React.js", cluster: "web", size: "lg", x: 31, y: 22 },
  { id: "node", label: "Node.js", cluster: "web", size: "md", x: 37, y: 39 },
  { id: "express", label: "Express.js", cluster: "web", size: "sm", x: 29, y: 48 },
  { id: "mongodb", label: "MongoDB", cluster: "web", size: "md", x: 13, y: 47 },
  { id: "mern", label: "MERN Stack", cluster: "web", size: "lg", x: 27, y: 35 },

  { id: "python", label: "Python", cluster: "ai", size: "lg", x: 58, y: 14 },
  { id: "ml", label: "Machine Learning", cluster: "ai", size: "md", x: 70, y: 10 },
  { id: "ai", label: "Artificial Intelligence", cluster: "ai", size: "md", x: 76, y: 22 },
  { id: "data-science", label: "Data Science", cluster: "ai", size: "md", x: 62, y: 26 },

  { id: "aws", label: "AWS", cluster: "cloud", size: "lg", x: 82, y: 33 },
  { id: "azure", label: "Azure", cluster: "cloud", size: "sm", x: 91, y: 30 },
  { id: "devops", label: "DevOps", cluster: "cloud", size: "md", x: 87, y: 43 },
  { id: "docker", label: "Docker", cluster: "cloud", size: "lg", x: 93, y: 51 },
  { id: "kubernetes", label: "Kubernetes", cluster: "cloud", size: "sm", x: 83, y: 55 },

  { id: "cybersecurity", label: "Cyber Security", cluster: "cyber", size: "md", x: 47, y: 48 },
  { id: "ethical-hacking", label: "Ethical Hacking", cluster: "cyber", size: "sm", x: 54, y: 58 },

  { id: "uiux", label: "UI/UX Design", cluster: "design", size: "md", x: 12, y: 61 },
  { id: "figma", label: "Figma", cluster: "design", size: "sm", x: 21, y: 71 },

  { id: "autocad", label: "AutoCAD", cluster: "cad", size: "sm", x: 31, y: 80 },

  { id: "digital-marketing", label: "Digital Marketing", cluster: "marketing", size: "lg", x: 55, y: 70 },
  { id: "seo", label: "SEO", cluster: "marketing", size: "sm", x: 65, y: 66 },
  { id: "google-ads", label: "Google Ads", cluster: "marketing", size: "sm", x: 61, y: 81 },

  { id: "tally", label: "Tally", cluster: "finance", size: "sm", x: 79, y: 71 },
  { id: "gst", label: "GST", cluster: "finance", size: "sm", x: 87, y: 81 },
];

const EDGES: [string, string][] = [
  ["html", "css"],
  ["css", "javascript"],
  ["javascript", "react"],
  ["javascript", "node"],
  ["node", "express"],
  ["express", "mongodb"],
  ["react", "mern"],
  ["node", "mern"],
  ["mongodb", "mern"],

  ["python", "ml"],
  ["ml", "ai"],
  ["ml", "data-science"],
  ["python", "data-science"],
  ["ai", "data-science"],

  ["aws", "devops"],
  ["azure", "devops"],
  ["devops", "docker"],
  ["docker", "kubernetes"],
  ["aws", "docker"],

  ["cybersecurity", "ethical-hacking"],

  ["uiux", "figma"],
  ["autocad", "uiux"],

  ["digital-marketing", "seo"],
  ["digital-marketing", "google-ads"],
  ["seo", "google-ads"],

  ["tally", "gst"],

  // A few cross-domain bridges, so the network reads as one connected mind.
  ["python", "aws"],
  ["data-science", "digital-marketing"],
  ["mern", "devops"],
  ["javascript", "uiux"],
];

const CLUSTER_GLOW: Record<Cluster, string> = {
  web: "rgba(59,130,246,0.85)",
  ai: "rgba(168,85,247,0.85)",
  cloud: "rgba(56,189,248,0.85)",
  cyber: "rgba(34,211,238,0.85)",
  design: "rgba(217,70,239,0.85)",
  cad: "rgba(99,102,241,0.85)",
  marketing: "rgba(236,72,153,0.85)",
  finance: "rgba(45,212,191,0.85)",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "text-sm sm:text-base",
  md: "text-lg sm:text-xl",
  lg: "text-2xl sm:text-3xl",
};

const PARALLAX_SPRING = { stiffness: 100, damping: 22, mass: 0.6 };

export function NeuralCourseNetwork() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, PARALLAX_SPRING);
  const mouseY = useSpring(rawY, PARALLAX_SPRING);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    rawX.set((event.clientX - rect.left) / rect.width - 0.5);
    rawY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onPointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const neighbours = useMemo(() => {
    if (!hovered) return null;
    const set = new Set<string>();
    for (const [a, b] of EDGES) {
      if (a === hovered) set.add(b);
      if (b === hovered) set.add(a);
    }
    return set;
  }, [hovered]);

  const stateFor = (id: string): "active" | "dimmed" | "neutral" => {
    if (!hovered) return "neutral";
    if (id === hovered || neighbours?.has(id)) return "active";
    return "dimmed";
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#03050f] py-20 text-white lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="drift-slow absolute top-[10%] left-[8%] size-[28rem] rounded-full bg-blue-500/8 blur-[150px]" />
        <div className="drift-slow-reverse absolute right-[6%] bottom-[10%] size-[30rem] rounded-full bg-purple-500/8 blur-[160px]" />
      </div>

      <div className="rail relative mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-white/40">.00 NEURAL.&gt;</p>
        <h2 className="mt-5 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
          Every course, one connected mind
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/60 lg:text-lg">
          No cards, no icons — just the language of what you&rsquo;ll learn, and how it all wires
          together. Hover a name.
        </p>
        <Link
          href="/courses"
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60"
        >
          Explore all courses <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Below `lg` there isn't enough width for 27 freely-positioned nodes to
          avoid colliding, so the spatial network is desktop-only and narrower
          viewports get a reflowing cloud of the same glowing names instead. */}
      <div
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative mx-auto mt-16 hidden h-[56rem] w-full max-w-[1600px] lg:block"
      >
        <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <linearGradient id="neural-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {EDGES.map(([a, b], i) => {
            const from = NODES.find((n) => n.id === a)!;
            const to = NODES.find((n) => n.id === b)!;
            const touchesHover = hovered !== null && (a === hovered || b === hovered);
            const dimmed = hovered !== null && !touchesHover;
            return (
              <line
                key={`${a}-${b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={touchesHover ? "url(#neural-line)" : "#3b82f6"}
                strokeWidth={touchesHover ? 0.4 : 0.18}
                strokeOpacity={dimmed ? 0.08 : touchesHover ? 0.9 : 0.28}
                className="neural-flow transition-[stroke-opacity,stroke-width] duration-300"
                style={{ ["--flow-delay" as string]: `${(i % 10) * 0.4}s` }}
              />
            );
          })}
        </svg>

        {NODES.map((node, i) => (
          <NetworkNodeLabel
            key={node.id}
            node={node}
            index={i}
            state={stateFor(node.id)}
            mouseX={mouseX}
            mouseY={mouseY}
            onHoverStart={() => setHovered(node.id)}
            onHoverEnd={() => setHovered((h) => (h === node.id ? null : h))}
          />
        ))}
      </div>

      <div className="rail relative mt-14 flex flex-wrap justify-center gap-x-3 gap-y-4 lg:hidden">
        {NODES.map((node) => (
          <span
            key={node.id}
            className={cx(
              "inline-block rounded-full bg-white/[0.03] px-3 py-1 font-display font-bold tracking-tight text-white backdrop-blur-sm whitespace-nowrap",
              SIZE_CLASS[node.size],
            )}
            style={{
              textShadow: `0 0 14px ${CLUSTER_GLOW[node.cluster]}, 0 0 30px ${CLUSTER_GLOW[node.cluster]}`,
            }}
          >
            {node.label}
          </span>
        ))}
      </div>
    </section>
  );
}

function NetworkNodeLabel({
  node,
  index,
  state,
  mouseX,
  mouseY,
  onHoverStart,
  onHoverEnd,
}: {
  node: NetworkNode;
  index: number;
  state: "active" | "dimmed" | "neutral";
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const factor = 8 + (index % 5) * 3;
  const px = useTransform(mouseX, (v) => v * factor);
  const py = useTransform(mouseY, (v) => v * factor);
  const glow = CLUSTER_GLOW[node.cluster];

  return (
    <div className="absolute" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          style={{ x: px, y: py }}
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
          animate={{
            opacity: state === "dimmed" ? 0.22 : 1,
            scale: state === "active" ? 1.12 : 1,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="cursor-default"
        >
          <span
            className={cx(
              "inline-block rounded-full bg-white/[0.03] px-3 py-1 font-display font-bold tracking-tight text-white backdrop-blur-sm transition-[background-color] duration-300 whitespace-nowrap",
              SIZE_CLASS[node.size],
              state === "active" && "bg-white/[0.07]",
            )}
            style={{
              textShadow:
                state === "dimmed"
                  ? "none"
                  : `0 0 ${state === "active" ? 26 : 14}px ${glow}, 0 0 ${state === "active" ? 60 : 30}px ${glow}`,
            }}
          >
            {node.label}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
