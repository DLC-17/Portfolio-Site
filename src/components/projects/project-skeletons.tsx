import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches homepage `ProjectCard` grid layout */
export function ProjectCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-zinc-200/80 dark:border-zinc-800/80">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-6 pt-5">
        <Skeleton className="h-5 w-4/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <div className="mt-auto flex gap-2 border-t border-zinc-200/80 px-6 pb-6 pt-4 dark:border-zinc-800/80">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
      </div>
    </Card>
  );
}

/** Matches `FeaturedProjectBlock` horizontal layout on /projects */
export function FeaturedProjectBlockSkeleton() {
  return (
    <Card className="overflow-hidden border-zinc-200/80 dark:border-zinc-800/80">
      <div className="flex min-h-[min(56vw,280px)] flex-col md:min-h-[320px] lg:min-h-[360px] md:flex-row">
        <Skeleton className="aspect-[16/10] w-full shrink-0 rounded-none sm:aspect-[16/9] md:aspect-auto md:h-auto md:min-h-[320px] md:w-[min(46%,520px)] md:min-w-[300px] lg:min-h-[360px] lg:min-w-[360px]" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 px-6 py-7 md:px-9 md:py-8 lg:px-10 lg:py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-8 w-[min(100%,280px)] md:h-9" />
              <Skeleton className="h-4 w-48 md:w-64" />
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </Card>
  );
}

/** Projects page: tab triggers + default featured strip */
export function ProjectsPageLoadingSkeleton() {
  return (
    <div className="w-full" aria-busy="true" aria-label="Loading projects">
      <div className="mb-10 inline-flex h-10 items-center gap-1 rounded-lg border border-zinc-200/80 bg-muted/30 p-1 dark:border-zinc-800/80">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
      <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
        <FeaturedProjectBlockSkeleton />
        <FeaturedProjectBlockSkeleton />
      </div>
    </div>
  );
}
