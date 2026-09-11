import type { ReactNode } from "react";
import { Icon, cx } from "@/components/ui";

/**
 * What a CMS-backed section shows when the CMS has nothing in it.
 *
 * The blog, the FAQs and the reviews are managed entirely in the CMS — there
 * is no copy in `data/` standing behind them — so "nothing published yet" is a
 * state the site has to render properly rather than an edge case. It is also
 * what an unreachable or unconfigured CMS produces, which is deliberate: the
 * reader sees the same honest "not here" either way, and the reason is in the
 * server log where it belongs rather than in front of a prospective student.
 *
 * Deliberately a panel and not a bare line of text: a section heading followed
 * by whitespace reads as a page that failed to load, while a bordered panel
 * reads as an answer. `tone="dark"` exists because the homepage FAQ band runs
 * on the dark surface, where the light panel would disappear.
 */
export function EmptyState({
  icon = "spark",
  title,
  body,
  action,
  tone = "light",
  className,
}: {
  icon?: string;
  title: string;
  body: string;
  /** A way onward — usually a phone number, since that always works. */
  action?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const onDark = tone === "dark";

  return (
    <div
      className={cx(
        "flex flex-col items-center rounded-2xl border border-dashed px-6 py-14 text-center",
        onDark ? "border-white/20 bg-white/[0.04]" : "border-line bg-subtle",
        className,
      )}
    >
      <span
        className={cx(
          "grid size-12 place-items-center rounded-full",
          onDark ? "bg-white/10 text-accent-400" : "bg-white text-brand-600",
        )}
      >
        <Icon name={icon} className="size-5" />
      </span>
      <p
        className={cx(
          "mt-5 font-display text-lg font-bold tracking-tight text-balance wrap-anywhere",
          onDark ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </p>
      <p
        className={cx(
          "mt-2 max-w-md text-sm leading-relaxed text-pretty",
          onDark ? "text-brand-100/70" : "text-muted",
        )}
      >
        {body}
      </p>
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
