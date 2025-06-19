
"use client"; // To use useLanguage
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { getAllProducts } from '@/lib/data';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getPluralNoun } from '@/lib/i18nUtils';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

// export const metadata = { // Metadata for client components is usually handled differently or in layout
//   title: 'Результаты поиска - TechShop',
//   description: 'Результаты поиска товаров в TechShop.',
// };

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { translate } = useLanguage(); // Get translate function
  
  const allProducts = getAllProducts();
  const searchQuery = searchParams?.get('q')?.toLowerCase() || '';

  useEffect(() => {
    if (searchQuery) {
      document.title = `${translate('search.results_title', { query: searchQuery })} - ${translate('app.name')}`;
    } else {
      document.title = `${translate('search.title')} - ${translate('app.name')}`;
    }
  }, [searchQuery, translate]);

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

  const filteredProducts: Product[] = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery) ||
    product.description.toLowerCase().includes(searchQuery) ||
    product.categoryName?.toLowerCase().includes(searchQuery) ||
    product.brand?.toLowerCase().includes(searchQuery)
  );

  const productNoun = getPluralNoun(
    filteredProducts.length,
    translate('noun.product.one'),
    translate('noun.product.few'),
    translate('noun.product.many')
  );

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
        <Suspense fallback={<SearchResultGridSkeleton />}>
          <SearchResultGrid products={filteredProducts} query={searchQuery} translate={translate} />
        </Suspense>
      </div>
    </div>
  );
}
