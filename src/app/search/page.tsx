
import { getAllProducts } from '@/lib/data';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';
import type { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams?: { q?: string } }): Promise<Metadata> {
  const query = searchParams?.q || '';
  if (query) {
    return {
      title: `Результаты поиска по запросу "${query}" - TechShop`,
      description: `Найдите товары по запросу "${query}" в TechShop. Просмотрите наш выбор электроники, гаджетов и многого другого.`,
    };
  }
  return {
    title: 'Поиск товаров - TechShop',
    description: 'Ищите современную электронику, гаджеты и аксессуары в TechShop.',
  };
}

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q?.toLowerCase() || '';
  let products: Product[] = [];
  let pageTitle = "Поиск товаров";
  const originalQuery = searchParams?.q || '';

  if (query) {
    const allProducts = getAllProducts();
    products = allProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.categoryName?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      (product.features && product.features.some(feature => feature.toLowerCase().includes(query)))
    );
    pageTitle = `Результаты поиска по запросу "${originalQuery}"`;
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-6 text-foreground">{pageTitle}</h1>
        
        {!query && (
          <p className="text-lg text-muted-foreground">
            Пожалуйста, используйте строку поиска в шапке сайта для поиска товаров.
          </p>
        )}

        {query && products.length === 0 && (
          <p className="text-lg text-muted-foreground">
            Товары по вашему запросу "{originalQuery}" не найдены. Попробуйте другой поисковый запрос или просмотрите наши категории.
          </p>
        )}

        {products.length > 0 && (
          <>
            <p className="text-md text-muted-foreground mb-6">
              Найдено товаров: {products.length}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

