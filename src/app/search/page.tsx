
import { ProductCard } from '@/components/products/ProductCard';
import { getAllProducts } from '@/lib/data';
import type { Product } from '@/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getProductNoun } from '@/lib/i18nUtils';

export const metadata = {
  title: 'Результаты поиска - TechShop',
  description: 'Результаты поиска товаров в TechShop.',
};

function SearchResultGrid({ products, query }: { products: Product[], query: string }) {
  if (products.length === 0) {
    return <p className="text-muted-foreground col-span-full text-center py-10">По запросу "{query}" ничего не найдено.</p>;
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

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const allProducts = getAllProducts();
  const searchQuery = searchParams?.q?.toLowerCase() || '';

  let filteredProducts: Product[] = [];

  if (!searchQuery) {
     return (
      <div className="space-y-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Поиск товаров</h1>
        <p className="text-muted-foreground py-10">
          Введите поисковый запрос в строке поиска выше, чтобы найти интересующие вас товары.
        </p>
      </div>
    );
  }

  filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery) ||
    product.description.toLowerCase().includes(searchQuery) ||
    product.categoryName?.toLowerCase().includes(searchQuery) ||
    product.brand?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Результаты поиска: "{searchQuery}"
        </h1>
        {filteredProducts.length > 0 && (
            <p className="text-muted-foreground text-sm sm:text-base whitespace-nowrap">
                Найдено: {filteredProducts.length} {getProductNoun(filteredProducts.length)}
            </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <Suspense fallback={<SearchResultGridSkeleton />}>
          <SearchResultGrid products={filteredProducts} query={searchQuery} />
        </Suspense>
      </div>
       {/* TODO: Add Pagination if many products */}
    </div>
  );
}
