import { CategoryFilter } from '@/components/products/CategoryFilter';
import { getAllProducts, getAllCategories, getProductsByCategoryId } from '@/lib/data';
import { Suspense } from 'react';
import { getProductNoun } from '@/lib/i18nUtils';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string; q?: string };
}) {
  const allProducts = getAllProducts();
  const categories = getAllCategories();

  let filteredProducts = allProducts;
  let pageTitle = 'Все товары';
  let currentCategoryName: string | undefined = undefined;

  const categorySlug = searchParams?.category;
  const searchQuery = searchParams?.q?.toLowerCase();

  if (categorySlug && categorySlug !== 'all') {
    const category = categories.find(c => c.slug === categorySlug);
    if (category) {
      filteredProducts = getProductsByCategoryId(category.id);
      pageTitle = category.name;
      currentCategoryName = category.name;
    } else {
      // Category slug provided but not found
      filteredProducts = [];
      pageTitle = 'Категория не найдена';
    }
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      (product.categoryName && product.categoryName.toLowerCase().includes(searchQuery)) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery))
    );
    if (pageTitle === 'Все товары' || currentCategoryName) {
      pageTitle = `Результаты поиска по запросу "${searchQuery}" ${currentCategoryName ? `в категории "${currentCategoryName}"`: '' }`;
    } else if (pageTitle === 'Категория не найдена') {
       pageTitle = `Поиск по запросу "${searchQuery}" в несуществующей категории`;
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {pageTitle}
          </h1>
          {filteredProducts.length > 0 && !searchQuery && (
             <p className="text-muted-foreground text-sm sm:text-base whitespace-nowrap">
                Найдено: {filteredProducts.length} {getProductNoun(filteredProducts.length)}
            </p>
          )}
        </div>
        <div className="mb-8">
          <CategoryFilter categories={categories} />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={filteredProducts} categoryName={currentCategoryName} query={searchQuery} />
          </Suspense>
        </div>
        {/* TODO: Add Pagination if many products */}
      </section>
    </div>
  );
}
