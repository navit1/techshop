
"use client";

import { useEffect } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageProvider';

function SearchResultGrid({ products, query, translate }: { products: Product[], query: string, translate: (key: string, params?: any) => string }) {
  if (products.length === 0) {
    return <p className="text-muted-foreground col-span-full text-center py-10">{translate('search.no_results_for_query', { query })}</p>;
  }
  return (
    <>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}

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

export default function SearchResultHandler({ 
  filteredProducts, 
  searchQuery 
}: { 
  filteredProducts: Product[], 
  searchQuery: string 
}) {
  const { translate } = useLanguage();

  useEffect(() => {
    if (searchQuery) {
      document.title = `${translate('search.results_title', { query: searchQuery })} - ${translate('app.name')}`;
    } else {
      document.title = `${translate('search.title')} - ${translate('app.name')}`;
    }
  }, [searchQuery, translate]);

  const productNoun = translate('noun.product', { count: filteredProducts.length });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {translate('search.results_title', { query: searchQuery })}
        </h1>
        {filteredProducts.length > 0 && (
          <p className="text-muted-foreground text-sm sm:text-base whitespace-nowrap">
            {translate('search.found_count', { count: filteredProducts.length, noun: productNoun })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
         {filteredProducts.length === 0 && (
           <p className="text-muted-foreground col-span-full text-center py-10">{translate('search.no_results_for_query', { query: searchQuery })}</p>
         )}
      </div>
    </div>
  );
}
