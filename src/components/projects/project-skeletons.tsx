import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches homepage `ProjectCard` grid layout */
export function ProjectCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/80">
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
      <div className="mt-auto flex gap-2 border-t border-border/80 px-6 pb-6 pt-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
      </div>
    </Card>
  );
}

