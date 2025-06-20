"use client";

import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageProvider';
import SearchResultHandler from '@/components/search/SearchResultHandler';

import { products as allProducts } from '@/lib/data';

export default function SearchClientPage() {
  const { translate } = useLanguage();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  if (!searchQuery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{translate('search.title')}</h1>
          <p className="text-muted-foreground py-10">{translate('search.enter_query_placeholder')}</p>
        </div>
      </div>
    );
  }

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery) ||
    product.description.toLowerCase().includes(searchQuery) ||
    product.categoryName?.toLowerCase().includes(searchQuery) ||
    product.brand?.toLowerCase().includes(searchQuery)
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchResultHandler 
        searchQuery={searchQuery} 
        filteredProducts={filteredProducts} 
      />
    </div>
  );
}