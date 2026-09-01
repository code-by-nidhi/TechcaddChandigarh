import { Bar, CardGridSkeleton, PageHeaderSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading courses">
      <PageHeaderSkeleton />
      <section className="py-16 lg:py-20">
        <div className="rail">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Bar key={i} className="h-10 w-32 rounded-full" />
            ))}
          </div>
          <div className="mt-14 space-y-16">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Bar className="h-14 w-full rounded-lg" />
                <div className="mt-8">
                  <CardGridSkeleton />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
