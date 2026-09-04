import { techGroups } from "@/data/content";
import { cx, Icon } from "@/components/ui";

/* -------------------------------------------------------------------------- */
/*                              Per-group styling                              */
/* -------------------------------------------------------------------------- */

interface GroupStyle {
  /** Icon shown inside the hub. */
  icon: string;
  /** One line under the title. */
  blurb: string;
  /** Card wash, hub gradient and connector stroke, in that order. */
  wash: string;
  hub: string;
  stroke: string;
  dot: string;
}

const STYLES: Record<string, GroupStyle> = {
  Programming: {
    icon: "code",
    blurb: "The languages every other track is built on top of.",
    wash: "bg-indigo-50/70 border-indigo-100",
    hub: "from-indigo-400 to-indigo-600 shadow-indigo-500/40",
    stroke: "#818cf8",
    dot: "bg-indigo-500",
  },
  Frameworks: {
    icon: "layers",
    blurb: "What teams actually ship production applications with.",
    wash: "bg-blue-50/70 border-blue-100",
    hub: "from-blue-400 to-blue-600 shadow-blue-500/40",
    stroke: "#60a5fa",
    dot: "bg-blue-500",
  },
  "AI & ML": {
    icon: "sparkles",
    blurb: "Model training, agents and the data stack underneath them.",
    wash: "bg-violet-50/70 border-violet-100",
    hub: "from-violet-400 to-violet-600 shadow-violet-500/40",
    stroke: "#a78bfa",
    dot: "bg-violet-500",
  },
  Databases: {
    icon: "box",
    blurb: "Relational, document and vector stores side by side.",
    wash: "bg-teal-50/70 border-teal-100",
    hub: "from-teal-400 to-teal-600 shadow-teal-500/40",
    stroke: "#5eead4",
    dot: "bg-teal-500",
  },
  DevOps: {
    icon: "compass",
    blurb: "Pipelines, containers and everything that ships the code.",
    wash: "bg-orange-50/70 border-orange-100",
    hub: "from-orange-400 to-orange-600 shadow-orange-500/40",
    stroke: "#fdba74",
    dot: "bg-orange-500",
  },
  Cloud: {
    icon: "cloud",
    blurb: "Where the work runs once it leaves your laptop.",
    wash: "bg-sky-50/70 border-sky-100",
    hub: "from-sky-400 to-sky-600 shadow-sky-500/40",
    stroke: "#7dd3fc",
    dot: "bg-sky-500",
  },
  Security: {
    icon: "shield",
    blurb: "Offensive and defensive tooling, taught hands on.",
    wash: "bg-rose-50/70 border-rose-100",
    hub: "from-rose-400 to-rose-600 shadow-rose-500/40",
    stroke: "#fda4af",
    dot: "bg-rose-500",
  },
  "CAD & Design": {
    icon: "monitor",
    blurb: "Drafting, modelling and the design suite around them.",
    wash: "bg-amber-50/70 border-amber-100",
    hub: "from-amber-400 to-amber-600 shadow-amber-500/40",
    stroke: "#fcd34d",
    dot: "bg-amber-500",
  },
  "Marketing & Analytics": {
    icon: "chart",
    blurb: "Campaign platforms and the reporting stack behind them.",
    wash: "bg-emerald-50/70 border-emerald-100",
    hub: "from-emerald-400 to-emerald-600 shadow-emerald-500/40",
    stroke: "#6ee7b7",
    dot: "bg-emerald-500",
  },
};

const FALLBACK: GroupStyle = {
  icon: "spark",
  blurb: "Tools taught across the programme.",
  wash: "bg-subtle border-line",
  hub: "from-brand-400 to-brand-600 shadow-brand-500/40",
  stroke: "#93c5fd",
  dot: "bg-brand-500",
};

/* -------------------------------------------------------------------------- */
/*                              Diagram geometry                               */
/* -------------------------------------------------------------------------- */

/**
 * The diagram is drawn in this box and stretched to fit. The panel is locked to
 * the same aspect ratio, so `preserveAspectRatio="none"` scales the connectors
 * without skewing them.
 */
const BOX = { w: 260, h: 170 };
/** Where the connectors converge — the top edge of the hub. */
const HUB = { x: 130, y: 95, r: 21 };

/** Seats for the floating chips, in design units. */
const CHIPS = [
  { x: 46, y: 26 },
  { x: 154, y: 17 },
  { x: 88, y: 53 },
  { x: 204, y: 45 },
  { x: 122, y: 68 },
];

/** A soft curve from a chip down into the hub. */
const connector = (from: { x: number; y: number }) => {
  const to = { x: HUB.x, y: HUB.y - HUB.r - 2 };
  const cx = (from.x + to.x) / 2;
  const cy = (from.y + to.y) / 2 + 10;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
};

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/* -------------------------------------------------------------------------- */
/*                                   Section                                   */
/* -------------------------------------------------------------------------- */

export function TechnologyCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {techGroups.map((group) => {
        const style = STYLES[group.name] ?? FALLBACK;
        // The first few items float as chips; the next three list out below the
        // hub, so a card shows eight of its tools without ever crowding. Each
        // seat is paired with its label here so the connector and the chip
        // cannot drift apart.
        const seats = CHIPS.slice(0, group.items.length).map((seat, i) => ({
          ...seat,
          label: group.items[i],
        }));
        const listed = group.items.slice(seats.length, seats.length + 3);
        const rest = group.items.length - seats.length - listed.length;

        return (
          <article
            key={group.name}
            className={cx(
              "rounded-2xl border p-3 transition-shadow duration-300 hover:shadow-lg",
              style.wash,
            )}
          >
            <div
              aria-hidden="true"
              className="relative overflow-hidden rounded-xl bg-white/75"
              style={{ aspectRatio: `${BOX.w} / ${BOX.h}` }}
            >
              <svg
                viewBox={`0 0 ${BOX.w} ${BOX.h}`}
                preserveAspectRatio="none"
                className="absolute inset-0 size-full"
              >
                {/* The funnel the chips fall through. */}
                <path
                  d={`M 14 4 Q 70 46 ${HUB.x} ${HUB.y - HUB.r - 2}`}
                  fill="none"
                  stroke={style.stroke}
                  strokeWidth={0.9}
                  opacity={0.5}
                />
                <path
                  d={`M ${BOX.w - 14} 4 Q ${BOX.w - 70} 46 ${HUB.x} ${HUB.y - HUB.r - 2}`}
                  fill="none"
                  stroke={style.stroke}
                  strokeWidth={0.9}
                  opacity={0.5}
                />
                {seats.map((seat) => (
                  <path
                    key={seat.label}
                    d={connector(seat)}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={0.8}
                    opacity={0.75}
                  />
                ))}
              </svg>

              {seats.map((seat) => (
                <span
                  key={seat.label}
                  style={{ left: pct(seat.x, BOX.w), top: pct(seat.y, BOX.h) }}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-md border border-line/70 bg-white px-1.5 py-1 text-[8px] font-medium whitespace-nowrap text-foreground/75 shadow-sm"
                >
                  <span className={cx("size-1 rounded-full", style.dot)} />
                  {seat.label}
                </span>
              ))}

              {/* The hub every connector runs into. */}
              <span
                style={{
                  left: pct(HUB.x, BOX.w),
                  top: pct(HUB.y, BOX.h),
                  width: pct(HUB.r * 2, BOX.w),
                }}
                className={cx(
                  "absolute flex aspect-square -translate-x-1/2 -translate-y-1/2 items-center justify-center",
                  "rounded-full bg-gradient-to-br text-white shadow-lg",
                  style.hub,
                )}
              >
                <Icon name={style.icon} className="size-1/2" />
              </span>

              {/* The short list under the hub. */}
              <span className="absolute inset-x-4 bottom-2.5 flex flex-col gap-1">
                {listed.map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <span className={cx("size-1.5 shrink-0 rounded-full", style.dot)} />
                    <span className="truncate text-[8px] font-medium text-foreground/60">
                      {item}
                    </span>
                  </span>
                ))}
              </span>
            </div>

            <h3 className="mt-4 font-display text-base font-bold tracking-tight">{group.name}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{style.blurb}</p>
            <p className="mt-3 text-[11px] font-medium tracking-wide text-muted/70 uppercase">
              {group.items.length} tools
              {rest > 0 ? <span className="normal-case"> · +{rest} more inside</span> : null}
            </p>
          </article>
        );
      })}
    </div>
  );
}
