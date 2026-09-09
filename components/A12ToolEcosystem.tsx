"use client";

import { useMemo, useState } from "react";
import type { Course } from "@/data/courses";
import { getCategory } from "@/data/courses";
import type { Program } from "@/data/programs";
import { TechTile } from "./TechTile";
import { Icon, cx } from "./ui";

/**
 * Short, general-knowledge descriptions of what each tool actually does —
 * industry facts, not claims about this specific course — plus a generic
 * fallback for anything not in the list, so the section never blocks on
 * covering every tool name that could appear across 44 courses.
 */
const TOOL_PURPOSE: Record<string, string> = {
  AWS: "Cloud infrastructure for hosting, storage and compute at scale.",
  Azure: "Microsoft's cloud platform for hosting and enterprise services.",
  Linux: "The operating system most servers and cloud instances run on.",
  Docker: "Packages an app and its dependencies into one portable container.",
  Git: "Tracks every change to your code so nothing is ever lost.",
  GitHub: "Hosts your Git repositories and runs team collaboration on top.",
  Terraform: "Defines cloud infrastructure as code instead of manual setup.",
  Jenkins: "Automates building, testing and deploying code on every change.",
  Kubernetes: "Runs and scales many containers across a cluster of machines.",
  Nginx: "Serves web traffic and routes requests to the right service.",
  HTML: "Structures the content of every web page.",
  CSS: "Styles layout, colour and typography on the page.",
  JavaScript: "Makes web pages interactive in the browser.",
  React: "Builds interactive user interfaces from reusable components.",
  "Node.js": "Runs JavaScript on the server, outside the browser.",
  "Express.js": "A lightweight framework for building Node.js APIs.",
  MongoDB: "A document database that stores data as flexible JSON-like records.",
  "VS Code": "The code editor used for writing and debugging every project.",
  Excel: "Spreadsheets for calculations, models and reporting.",
  SQL: "The language used to query and manage relational databases.",
  "Power BI": "Turns raw data into interactive dashboards and reports.",
  Python: "A general-purpose language used across data, web and automation.",
  Pandas: "A Python library for cleaning and analysing tabular data.",
  Tableau: "A visual analytics tool for building interactive dashboards.",
  NumPy: "Fast numerical computing that underpins Python's data stack.",
  TensorFlow: "A framework for building and training deep learning models.",
  PyTorch: "A flexible framework for research-grade deep learning models.",
  OpenAI: "APIs for building on top of large language models.",
  LangChain: "A framework for chaining LLM calls into real applications.",
  "Hugging Face": "A hub of pretrained models and tools for NLP and AI.",
  Flask: "A lightweight Python framework for building web APIs.",
  SQLite: "A simple, file-based database used for small applications.",
  Pytest: "The framework used to write and run automated tests.",
  Java: "A widely used, statically typed language for backend systems.",
  "IntelliJ IDEA": "The IDE used for writing and debugging Java projects.",
  Maven: "Manages dependencies and builds Java projects.",
  "Spring Boot": "A Java framework for building production-ready backends.",
  MySQL: "A relational database used to store structured application data.",
  JUnit: "The standard framework for testing Java code.",
  "Google Ads": "Runs and measures paid search and display campaigns.",
  "Meta Ads": "Runs paid campaigns across Facebook and Instagram.",
  GA4: "Google Analytics — tracks how visitors actually use a site.",
  "Search Console": "Monitors how a site performs in Google Search.",
  Semrush: "Keyword research and competitor analysis for SEO and ads.",
  Canva: "Design tool for campaign creatives and social assets.",
  "Kali Linux": "A Linux distribution built for penetration testing.",
  "Burp Suite": "Intercepts and tests web traffic for security flaws.",
  Wireshark: "Captures and inspects network traffic packet by packet.",
  Metasploit: "A framework for developing and running exploit code safely.",
  Nmap: "Scans networks to discover hosts, ports and services.",
  Splunk: "Collects and analyses logs to detect security incidents.",
  Figma: "Designs and prototypes interfaces before they are built.",
};

const TOOL_PURPOSE_FALLBACK = "A core part of the stack this course is built around.";

/** Finds which module (if any) actually mentions this tool, for an honest "where it's used" line. */
function findUsage(course: Course, tool: string): string {
  const needle = tool.toLowerCase();
  const match = course.modules.find((m) =>
    m.topics.some((t) => t.toLowerCase().includes(needle)),
  );
  return match ? `Used in the ${match.title} module.` : `Used throughout ${course.name}.`;
}

export function A12ToolEcosystem({ course, program }: { course: Course; program: Program }) {
  const tools = course.tools.slice(0, 10);
  const n = tools.length;
  const category = getCategory(course.category);
  const [hovered, setHovered] = useState<number | null>(null);

  const nodes = useMemo(
    () =>
      tools.map((tool, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        return {
          tool,
          x: 50 + Math.cos(angle) * 40,
          y: 50 + Math.sin(angle) * 42,
        };
      }),
    [tools, n],
  );

  const active = hovered !== null ? nodes[hovered] : null;

  return (
    <div>
      <div className="relative mx-auto hidden aspect-square w-full max-w-[620px] lg:block">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <linearGradient id="a12-eco-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {nodes.map((node, i) => (
            <line
              key={node.tool}
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
              stroke={hovered === i ? "#00D4FF" : "url(#a12-eco-line)"}
              strokeWidth={hovered === i ? 0.6 : 0.25}
              strokeDasharray="1.5 2"
              className="transition-all duration-500"
              style={{ opacity: hovered === null || hovered === i ? 1 : 0.25 }}
            >
              {hovered === null ? (
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="7"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              ) : null}
            </line>
          ))}
        </svg>

        {/* Central course card */}
        <div
          className="group absolute top-1/2 left-1/2 z-10 w-52 -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/15 bg-gradient-to-br from-hero-900 via-hero-800 to-brand-700 p-5 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.06] hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.65),0_0_50px_-10px_rgba(0,212,255,0.5)]"
          style={{ opacity: active ? 0 : 1, pointerEvents: active ? "none" : "auto" }}
        >
          <div className="relative mx-auto flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-black/20">
            {course.heroImage ? (
              <img
                src={course.heroImage}
                alt={`${course.name} course`}
                className="size-full object-contain"
              />
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-[#00D4FF] text-white">
                <Icon name={category.icon} className="size-8" />
              </span>
            )}
          </div>
          <p className="mt-3 font-display text-sm leading-tight font-bold text-white">
            {course.name}
          </p>
          <p className="mt-1 text-[11px] text-white/60">{program.duration.label}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold text-amber-300 uppercase">
            <Icon name="award" className="size-3" />
            {program.duration.tier}
          </span>
        </div>

        {/* Info panel — swaps into the same spot when a node is hovered */}
        <div
          className="absolute top-1/2 left-1/2 z-10 w-60 -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/15 bg-gradient-to-br from-hero-900 via-hero-800 to-brand-700 p-5 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] transition-opacity duration-300"
          style={{ opacity: active ? 1 : 0, pointerEvents: "none" }}
        >
          {active ? (
            <>
              <span
                style={{ containerType: "inline-size" }}
                className="mx-auto inline-flex size-11 items-center justify-center rounded-2xl bg-white/10"
              >
                <TechTile name={active.tool} size={60} />
              </span>
              <p className="mt-3 font-display text-sm font-bold text-white">{active.tool}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                {TOOL_PURPOSE[active.tool] ?? TOOL_PURPOSE_FALLBACK}
              </p>
              <p className="mt-2 text-[11px] font-semibold text-[#00D4FF]">
                {findUsage(course, active.tool)}
              </p>
            </>
          ) : null}
        </div>

        {/* Orbiting tool nodes */}
        {nodes.map((node, i) => (
          <div
            key={node.tool}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              opacity: hovered === null || hovered === i ? 1 : 0.4,
              animationDelay: `${i * 0.35}s`,
            }}
            className="float-slow absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              style={{ containerType: "inline-size" }}
              className={cx(
                "grid size-20 cursor-pointer place-items-center rounded-3xl border bg-white/95 backdrop-blur-sm",
                "shadow-[0_16px_36px_-14px_rgba(0,0,0,0.5)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                hovered === i
                  ? "scale-110 border-[#00D4FF]/60 shadow-[0_25px_50px_-14px_rgba(0,212,255,0.5)]"
                  : "border-white/20",
              )}
            >
              <TechTile name={node.tool} size={50} />
            </div>
            <p className="mt-2 text-center text-[11px] font-semibold whitespace-nowrap text-white/75">
              {node.tool}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile / tablet: course card + a plain wrapped tool list, no orbit geometry */}
      <div className="mx-auto max-w-sm lg:hidden">
        <div className="rounded-[28px] border border-white/15 bg-gradient-to-br from-hero-900 via-hero-800 to-brand-700 p-6 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
          <div className="relative mx-auto flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-black/20">
            {course.heroImage ? (
              <img
                src={course.heroImage}
                alt={`${course.name} course`}
                className="size-full object-contain"
              />
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-[#00D4FF] text-white">
                <Icon name={category.icon} className="size-8" />
              </span>
            )}
          </div>
          <p className="mt-3 font-display text-base font-bold text-white">{course.name}</p>
          <p className="mt-1 text-xs text-white/60">{program.duration.label}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold text-amber-300 uppercase">
            <Icon name="award" className="size-3" />
            {program.duration.tier}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {tools.map((tool) => (
            <div
              key={tool}
              style={{ containerType: "inline-size" }}
              className="grid size-16 place-items-center rounded-2xl border border-white/20 bg-white/95 shadow-[0_16px_36px_-14px_rgba(0,0,0,0.5)]"
            >
              <TechTile name={tool} size={50} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
