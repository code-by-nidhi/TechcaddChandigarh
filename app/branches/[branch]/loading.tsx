import { DetailSkeleton, PageHeaderSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading centre">
      <PageHeaderSkeleton meta={4} />
      <DetailSkeleton />
    </div>
  );
}
