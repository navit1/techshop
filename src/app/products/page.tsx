
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { getAllProducts, getAllCategories, getProductsByCategoryId } from '@/lib/data';
import type { Product } from '@/types';

export default function ProductsPage({ searchParams }: { searchParams?: { category?: string } }) {
  const categories = getAllCategories();
  const selectedCategorySlug = searchParams?.category;

  let products: Product[];
  let categoryTitle: string | undefined;

  if (selectedCategorySlug && selectedCategorySlug !== 'all') {
    const category = categories.find(c => c.slug === selectedCategorySlug);
    products = category ? getProductsByCategoryId(category.id) : getAllProducts();
    categoryTitle = category?.name;
  } else {
    products = getAllProducts();
  }
  
  const pageTitle = categoryTitle || "Все товары";

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-4 text-foreground">{pageTitle}</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Просмотрите нашу коллекцию высококачественных товаров. Используйте фильтр для уточнения поиска.
        </p>
        <CategoryFilter categories={categories} />
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground text-xl py-10">Товары в этой категории не найдены.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

