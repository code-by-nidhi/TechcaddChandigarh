import { revealDelay } from "@/components/motion/Words";

/**
 * "The gap that keeps opening" — the shape of the argument this page makes:
 * what employers ask for moves faster than a fixed syllabus covers, and the
 * space between the two lines is the work.
 *
 * Deliberately unlabelled on the y-axis. It is a diagram of a trend, not a
 * measurement, and the caption says so.
 */

type Point = [number, number];

/** Milestone x positions land on the centres of a five-column grid below. */
const MILESTONES = [
  { label: "Cloud", year: "2018" },
  { label: "Data", year: "2020" },
  { label: "Cyber", year: "2022" },
  { label: "GenAI", year: "2024" },
  { label: "Agents", year: "2026" },
];

const X = [56, 168, 280, 392, 504];
const DEMAND: Point[] = X.map((x, i) => [x, [245, 210, 168, 116, 52][i]]);
const SYLLABUS: Point[] = X.map((x, i) => [x, [252, 248, 244, 240, 236][i]]);

/**
 * Catmull-Rom through the points, emitted as cubic béziers — the curve passes
 * through every plotted point, so the dots sit exactly on the line.
 */
function smooth(points: Point[]): string {
  const d = [`M${points[0][0]} ${points[0][1]}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];

    const c1x = x1 + (x2 - p0[0]) / 6;
    const c1y = y1 + (y2 - p0[1]) / 6;
    const c2x = x2 - (p3[0] - x1) / 6;
    const c2y = y2 - (p3[1] - y1) / 6;

    d.push(`C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2} ${y2}`);
  }

  return d.join(" ");
}

const demandPath = smooth(DEMAND);
const syllabusPath = smooth(SYLLABUS);
/** Forward along demand, back along the syllabus line — the shaded gap. */
const gapPath = `${demandPath} ${smooth([...SYLLABUS].reverse()).replace(/^M/, "L")} Z`;

export function DemandGapChart() {
  return (
    <figure
      data-reveal
      className="relative rounded-3xl border border-line bg-background p-6 shadow-[0_40px_80px_-52px_rgba(15,23,42,0.55)] lg:p-8"
    >
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-sm font-bold tracking-tight text-ink">
          The gap that keeps opening
        </h3>
        <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          Skill demand over time
        </span>
      </figcaption>

      <div className="relative mt-6">
        <svg viewBox="0 0 560 300" className="w-full" aria-hidden="true">
          <defs>
            <linearGradient id="gap-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--color-brand-500)", stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: "var(--color-brand-500)", stopOpacity: 0.02 }} />
            </linearGradient>
            <linearGradient id="demand-stroke" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" style={{ stopColor: "var(--color-brand-600)" }} />
              <stop offset="100%" style={{ stopColor: "var(--color-accent-400)" }} />
            </linearGradient>
          </defs>

          {/* Baseline grid */}
          {[60, 120, 180, 240].map((y) => (
            <line
              key={y}
              x1="20"
              y1={y}
              x2="540"
              y2={y}
              className="stroke-line"
              strokeWidth="1"
            />
          ))}
          <line x1="20" y1="278" x2="540" y2="278" className="stroke-line" strokeWidth="1.5" />

          <path d={gapPath} fill="url(#gap-fill)" data-reveal-fade style={revealDelay(9, 100)} />

          <path
            d={syllabusPath}
            pathLength="1"
            fill="none"
            className="stroke-muted"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.55"
            data-reveal-draw
            style={revealDelay(3, 100)}
          />
          <path
            d={demandPath}
            pathLength="1"
            fill="none"
            stroke="url(#demand-stroke)"
            strokeWidth="3"
            strokeLinecap="round"
            data-reveal-draw
          />

          {/* The gap, called out at its widest */}
          <line
            x1="392"
            y1="122"
            x2="392"
            y2="234"
            className="stroke-brand-600"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            strokeOpacity="0.55"
            data-reveal-fade
            style={revealDelay(12, 100)}
          />

          {DEMAND.map(([x, y], i) => (
            <circle
              key={x}
              cx={x}
              cy={y}
              r="6"
              className="fill-background stroke-brand-600"
              strokeWidth="3"
              data-reveal-pop
              style={revealDelay(i + 4, 160)}
            />
          ))}
        </svg>

        <span
          data-reveal
          style={revealDelay(14, 100)}
          className="absolute top-[58%] left-[70%] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-600/20 bg-brand-50 px-3 py-1 text-[11px] font-semibold whitespace-nowrap text-brand-700 shadow-sm sm:block"
        >
          the gap we teach into
        </span>
      </div>

      {/* Milestone axis — one column per plotted point */}
      <div className="mt-3 grid grid-cols-5 gap-1 text-center">
        {MILESTONES.map((m, i) => (
          <div key={m.label} data-reveal style={revealDelay(i + 4, 160)}>
            <p className="font-display text-xs font-bold tracking-tight text-ink">{m.label}</p>
            <p className="mt-0.5 font-mono text-[10px] tracking-widest text-muted">{m.year}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5">
        <span className="flex items-center gap-2 text-xs text-muted">
          <span
            aria-hidden="true"
            className="h-0.5 w-6 rounded-full bg-gradient-to-r from-brand-600 to-accent-400"
          />
          What employers ask for
        </span>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span aria-hidden="true" className="h-0.5 w-6 rounded-full bg-muted/55" />
          What a fixed syllabus covers
        </span>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted/80">
        Illustrative — the shape of the shift, not a measurement.
      </p>
    </figure>
  );
}
