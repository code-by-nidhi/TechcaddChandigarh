import { ArticleSkeleton, PageHeaderSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading article">
      <PageHeaderSkeleton />
      <ArticleSkeleton />
    </div>
  );
}
