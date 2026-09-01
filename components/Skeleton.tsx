import { cx } from "./ui";

/**
 * Loading placeholders. These mirror the shape of the real content so the page
 * does not jump when it swaps in — a skeleton that is the wrong size is worse
 * than no skeleton at all.
 *
 * `skeleton` / `skeleton-dark` are defined in globals.css; the dark variant is
 * for use on the navy page banner.
 */
export function Bar({ className, dark }: { className?: string; dark?: boolean }) {
  return <div aria-hidden="true" className={cx("skeleton", dark && "skeleton-dark", className)} />;
}

/** Navy banner placeholder, matching <PageHeader>. */
export function PageHeaderSkeleton({ meta = 3 }: { meta?: number }) {
  return (
    <section className="hero-surface pt-24 pb-16 lg:pt-28 lg:pb-20">
      <div className="rail">
        <Bar dark className="h-4 w-56 rounded-full" />
        <Bar dark className="mt-6 h-7 w-40 rounded-full" />
        <div className="mt-6 space-y-3">
          <Bar dark className="h-9 w-[min(38rem,92%)] rounded-lg lg:h-12" />
          <Bar dark className="h-9 w-[min(28rem,70%)] rounded-lg lg:h-12" />
        </div>
        <div className="mt-6 space-y-2.5">
          <Bar dark className="h-4 w-[min(34rem,85%)] rounded-lg" />
          <Bar dark className="h-4 w-[min(26rem,65%)] rounded-lg" />
        </div>
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
          {Array.from({ length: meta }).map((_, i) => (
            <div key={i}>
              <Bar dark className="h-3 w-20 rounded" />
              <Bar dark className="mt-2 h-5 w-28 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeadingSkeleton({ center = false }: { center?: boolean }) {
  return (
    <div className={cx("max-w-3xl", center && "mx-auto text-center")}>
      <Bar className={cx("h-7 w-36 rounded-full", center && "mx-auto")} />
      <Bar className={cx("mt-5 h-9 w-[min(30rem,90%)] rounded-lg lg:h-11", center && "mx-auto")} />
      <Bar className={cx("mt-5 h-4 w-[min(24rem,75%)] rounded-lg", center && "mx-auto")} />
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  className = "sm:grid-cols-2 lg:grid-cols-3",
  height = "h-72",
}: {
  count?: number;
  className?: string;
  height?: string;
}) {
  return (
    <div className={cx("grid gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Bar key={i} className={cx("rounded-2xl", height)} />
      ))}
    </div>
  );
}

export function RowsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Bar key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}

/** Two-column detail layout with a sticky sidebar, matching course pages. */
export function DetailSkeleton() {
  return (
    <section className="py-16 lg:py-20">
      <div className="rail">
        <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
          <div className="min-w-0 space-y-12">
            <div>
              <Bar className="h-8 w-64 rounded-lg" />
              <div className="mt-5 space-y-3">
                <Bar className="h-4 w-full rounded" />
                <Bar className="h-4 w-[92%] rounded" />
                <Bar className="h-4 w-[78%] rounded" />
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Bar key={i} className="h-9 w-24 rounded-lg" />
                ))}
              </div>
            </div>
            <div>
              <Bar className="h-8 w-40 rounded-lg" />
              <div className="mt-8 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Bar key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
          <aside>
            <Bar className="h-96 rounded-2xl" />
            <Bar className="mt-6 h-40 rounded-2xl" />
          </aside>
        </div>
      </div>
    </section>
  );
}

/** Long-form article placeholder. */
export function ArticleSkeleton() {
  return (
    <section className="py-16 lg:py-20">
      <div className="rail">
        <div className="mx-auto max-w-3xl space-y-10">
          {Array.from({ length: 4 }).map((_, block) => (
            <div key={block}>
              <Bar className="h-7 w-72 rounded-lg" />
              <div className="mt-5 space-y-3">
                {Array.from({ length: 4 }).map((_, line) => (
                  <Bar
                    key={line}
                    className="h-4 rounded"
                    /* Ragged right edge reads as text rather than blocks. */
                  />
                ))}
                <Bar className="h-4 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
