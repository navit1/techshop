
import { Skeleton } from '@/components/ui/skeleton';

export function ProductGridSkeleton() {
  return (
    <>
      {[...Array(12)].map((_, i) => ( // Increased skeleton items for better visual representation of 3-col layout
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[150px] sm:h-[180px] md:h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </>
  );
}
