
"use client"; // To use useLanguage
import type { Product } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

interface ProductGridProps {
  products: Product[];
  categoryName?: string; // Original category name for fallback
  query?: string;
}

export function ProductGrid({ products, categoryName, query }: ProductGridProps) {
  const { translate } = useLanguage(); // Get translate function

  if (products.length === 0) {
    let messageKey = 'product.no_products_found_generic'; // Default message key
    let messageParams: any = {};

    if (query) {
      messageKey = 'search.no_results_for_query';
      messageParams.query = query;
      // If categoryName is also present, this could be a more specific message,
      // but for simplicity, query takes precedence for "no results".
      // Or, a key like 'search.no_results_for_query_in_category' could be used if available.
    } else if (categoryName) {
      // Using a generic key for category not found, or specific if available
      messageKey = 'product.no_products_in_category'; 
      messageParams.categoryName = translate(`category.${categoryName}`, {defaultValue: categoryName}); // Translate category name if key exists
    }
    // Fallback message (should ideally be a key itself)
    const fallbackMessage = categoryName ? `No products found in ${translate(`category.${categoryName}`, {defaultValue: categoryName})}.` : "No products found.";
    
    return <p className="text-muted-foreground col-span-full text-center py-10">{translate(messageKey, {...messageParams, defaultValue: fallbackMessage})}</p>;
  }
  return (
    <>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
