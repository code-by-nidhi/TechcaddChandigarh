import { CardGridSkeleton, PageHeaderSkeleton, RowsSkeleton, SectionHeadingSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading centres">
      <PageHeaderSkeleton />
      <section className="py-16 lg:py-24">
        <div className="rail">
          <CardGridSkeleton count={6} className="lg:grid-cols-2" height="h-80" />
        </div>
      </section>
      <section className="bg-subtle py-16 lg:py-24">
        <div className="rail">
          <SectionHeadingSkeleton />
          <div className="mt-14">
            <RowsSkeleton count={6} />
          </div>
        </div>
      </section>
    </div>
  );
}
