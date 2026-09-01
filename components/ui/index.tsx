import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";
import { CountUp } from "../motion/Reveal";

export { Icon };

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

/* -------------------------------- Container -------------------------------- */

export function Rail({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return <Tag className={cx("rail", className)}>{children}</Tag>;
}

/* --------------------------------- Button --------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "onDark" | "onDarkGhost";

const buttonBase =
  "items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out disabled:opacity-60 disabled:pointer-events-none";

/**
 * `hidden` passed by a caller would otherwise lose to a hard-coded `inline-flex`
 * here — Tailwind orders display utilities in the stylesheet, not by the order
 * they appear in the class attribute. So only apply the default display when the
 * caller has not set one of its own.
 */
const displayFor = (className?: string) =>
  className && /(^|\s)(hidden|block|flex|inline-flex|grid)(\s|$)/.test(className)
    ? ""
    : "inline-flex";

const buttonSizes = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-6",
  lg: "h-13 px-7 text-[15px]",
} as const;

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-xl",
  secondary:
    "border border-foreground/15 bg-white text-foreground hover:border-brand-600/30 hover:bg-brand-50",
  ghost: "text-brand-600 hover:bg-brand-50",
  onDark:
    "bg-white text-hero-950 shadow-lg shadow-black/20 hover:bg-brand-50",
  onDarkGhost:
    "border border-white/25 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/10",
};

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: ButtonVariant;
  size?: keyof typeof buttonSizes;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cx(
        displayFor(className),
        buttonBase,
        buttonSizes[size],
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: keyof typeof buttonSizes }) {
  return (
    <button
      className={cx(
        displayFor(className),
        buttonBase,
        buttonSizes[size],
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------------------------- Badge ---------------------------------- */

const badgeTones = {
  hot: "bg-rose-500/12 text-rose-600 ring-rose-500/20",
  new: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/20",
  trending: "bg-amber-400/15 text-amber-700 ring-amber-500/25",
  brand: "bg-brand-50 text-brand-700 ring-brand-600/15",
  dark: "bg-white/10 text-white ring-white/20",
} as const;

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-inset",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const badgeTone = (badge?: string) =>
  badge === "Hot" ? "hot" : badge === "New" ? "new" : badge === "Trending" ? "trending" : "brand";

/* --------------------------------- Eyebrow --------------------------------- */

export function Eyebrow({
  children,
  onDark,
  className,
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest",
        onDark
          ? "bg-white/10 text-brand-200 ring-1 ring-inset ring-white/15"
          : "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/10",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ------------------------------ Section header ------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  onDark,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow onDark={onDark} className="mb-5">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2
        className={cx(
          "font-display text-3xl font-bold tracking-tight text-balance lg:text-[2.75rem] lg:leading-[1.1]",
          onDark ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={cx(
            "mt-5 text-base leading-relaxed text-pretty lg:text-lg",
            onDark ? "text-brand-100/80" : "text-muted",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------------------------- Cards ---------------------------------- */

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cx(
        "card-hover rounded-2xl border border-line bg-white p-6",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------- Breadcrumb -------------------------------- */

export function Breadcrumbs({
  items,
  onDark,
}: {
  items: { label: string; href?: string }[];
  onDark?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cx(
          "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium",
          onDark ? "text-brand-200/80" : "text-muted",
        )}
      >
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 ? <Icon name="chevron-right" className="size-3 opacity-50" /> : null}
            {item.href ? (
              <Link
                href={item.href}
                className={cx(
                  "transition-colors",
                  onDark ? "hover:text-white" : "hover:text-brand-600",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span className={onDark ? "text-white" : "text-foreground"}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------- Stat display ------------------------------- */

export function Stat({
  value,
  label,
  onDark,
}: {
  value: string;
  label: string;
  onDark?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border p-5",
        onDark ? "border-white/12 bg-white/[0.06] backdrop-blur-sm" : "border-line bg-subtle",
      )}
    >
      <p
        className={cx(
          "font-display text-2xl font-bold tracking-tight lg:text-3xl",
          onDark ? "text-white" : "text-foreground",
        )}
      >
        <CountUp value={value} />
      </p>
      <p className={cx("mt-1 text-sm", onDark ? "text-brand-100/70" : "text-muted")}>{label}</p>
    </div>
  );
}

/* ---------------------------------- Prose ---------------------------------- */

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "space-y-5 text-base leading-relaxed text-muted [&_a]:font-medium [&_a]:text-brand-600 [&_a:hover]:underline [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
