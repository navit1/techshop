"use client"

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage
import SearchResultHandler from '@/components/search/SearchResultHandler'; // Import the new client component
import { useSearchParams } from 'next/navigation'; // Still need this to get the initial query on the server

// export const metadata = { // Metadata for client components is usually handled differently or in layout
//   title: 'Результаты поиска - TechShop',
//   description: 'Результаты поиска товаров в TechShop.',
// };

function SearchResultGridSkeleton() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[150px] sm:h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function SearchPage() {
  const { translate } = useLanguage(); // Get translate function

  // Use useSearchParams directly here for the initial check if needed for server rendering
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  if (!searchQuery) {
     return (
      <div className="space-y-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{translate('search.title')}</h1>
        <p className="text-muted-foreground py-10">
          {translate('search.enter_query_placeholder')}
        </p>
      </div>
    );
  }

  return (
    // Wrap the client component in Suspense
    <Suspense fallback={<SearchResultGridSkeleton />}>
      <SearchResultHandler />
    </Suspense>
  );
}
