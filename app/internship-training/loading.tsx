import { CardGridSkeleton, PageHeaderSkeleton, SectionHeadingSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading page">
      <PageHeaderSkeleton />
      <section className="py-16 lg:py-24">
        <div className="rail">
          <SectionHeadingSkeleton />
          <div className="mt-14">
            <CardGridSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}
