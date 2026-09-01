import { Bar, CardGridSkeleton, PageHeaderSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading articles">
      <PageHeaderSkeleton meta={2} />
      <section className="py-16 lg:py-20">
        <div className="rail">
          <Bar className="h-64 rounded-3xl" />
          <div className="mt-6">
            <CardGridSkeleton count={6} height="h-64" />
          </div>
        </div>
      </section>
    </div>
  );
}
