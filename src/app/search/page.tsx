"use client";

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage
import SearchResultHandler from '@/components/search/SearchResultHandler'; // Import the new client component
import SearchResultHandlerClient from '@/components/search/SearchResultHandlerClient'; // Import the new client component
import { useSearchParams } from 'next/navigation';
// export const metadata = { // Metadata for client components is usually handled differently or in layout
//   title: 'Результаты поиска - TechShop',

export const dynamic = "force-dynamic";
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

export default function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { translate } = useLanguage();

  // Access search parameters directly from the prop
  const searchQuery = (searchParams.q as string)?.toLowerCase() || '';

  if (!searchQuery) { // Removed the conditional check for clarity in the diff, but it should remain in your code
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
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<SearchResultGridSkeleton />}>
        {/* Pass the searchParams prop to the client component */}
        <SearchResultHandlerClient searchParams={searchParams} />
      </Suspense>
    </div>
  );
}