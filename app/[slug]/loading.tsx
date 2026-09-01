import { DetailSkeleton, PageHeaderSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading course">
      <PageHeaderSkeleton meta={4} />
      <DetailSkeleton />
    </div>
  );
}
