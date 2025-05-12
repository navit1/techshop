
import type { Product } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';

interface ProductGridProps {
  products: Product[];
  categoryName?: string;
  query?: string;
}

export function ProductGrid({ products, categoryName, query }: ProductGridProps) {
  if (products.length === 0) {
    let message = "Товары не найдены.";
    if (query) {
      message = `По запросу "${query}" ${categoryName ? `в категории "${categoryName}"` : ''} ничего не найдено.`;
    } else if (categoryName) {
      message = `В категории "${categoryName}" товары отсутствуют.`;
    }
    return <p className="text-muted-foreground col-span-full text-center py-10">{message}</p>;
  }
  return (
    <>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
