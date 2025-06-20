import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SearchClientPage from './SearchClientPage'; // Импортируем наш клиентский компонент

// Эта вспомогательная функция может остаться здесь или быть вынесена
function SearchResultGridSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[150px] sm:h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Это теперь чистый Серверный Компонент.
// Он не принимает никаких пропсов и не использует хуки.
export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchResultGridSkeleton />}>
      <SearchClientPage />
    </Suspense>
  );
}