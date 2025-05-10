import { getAllProducts } from '@/lib/data';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';
import type { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams?: { q?: string } }): Promise<Metadata> {
  const query = searchParams?.q || '';
  if (query) {
    return {
      title: `Search results for "${query}" - TechShop`,
      description: `Find products matching "${query}" at TechShop. Browse our selection of electronics, gadgets, and more.`,
    };
  }
  return {
    title: 'Search Products - TechShop',
    description: 'Search for cutting-edge electronics, gadgets, and accessories at TechShop.',
  };
}

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q?.toLowerCase() || '';
  let products: Product[] = [];
  let pageTitle = "Search Products";
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
    pageTitle = `Search Results for "${originalQuery}"`;
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-6 text-foreground">{pageTitle}</h1>
        
        {!query && (
          <p className="text-lg text-muted-foreground">
            Please use the search bar in the header to find products.
          </p>
        )}

        {query && products.length === 0 && (
          <p className="text-lg text-muted-foreground">
            No products found matching your search term "{originalQuery}". Try a different search term or browse our categories.
          </p>
        )}

        {products.length > 0 && (
          <>
            <p className="text-md text-muted-foreground mb-6">
              Found {products.length} product{products.length === 1 ? '' : 's'} matching your search.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
