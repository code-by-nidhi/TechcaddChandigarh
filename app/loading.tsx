export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading page">
      <div className="hero-surface flex min-h-[70vh] flex-col justify-center pt-28 pb-12">
        <div className="rail">
          <div className="skeleton skeleton-dark h-7 w-64 rounded-full" aria-hidden="true" />
          <div className="mt-12 space-y-4">
            <div className="skeleton skeleton-dark h-12 w-[min(38rem,90%)] rounded-lg lg:h-16" aria-hidden="true" />
            <div className="skeleton skeleton-dark h-12 w-[min(32rem,80%)] rounded-lg lg:h-16" aria-hidden="true" />
          </div>
          <div className="mt-8 space-y-3">
            <div className="skeleton skeleton-dark h-4 w-[min(32rem,80%)] rounded-lg" aria-hidden="true" />
            <div className="skeleton skeleton-dark h-4 w-[min(26rem,65%)] rounded-lg" aria-hidden="true" />
          </div>
          <div className="mt-9 flex flex-wrap gap-4">
            <div className="skeleton skeleton-dark h-13 w-48 rounded-full" aria-hidden="true" />
            <div className="skeleton skeleton-dark h-13 w-44 rounded-full" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="rail grid gap-4 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-64 rounded-2xl" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}
