
"use client";

import type { FormEvent} from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search as SearchIcon, Loader2, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { getAllProducts } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

const DEBOUNCE_DELAY = 300;
const MAX_PREVIEW_RESULTS = 5;

export function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [previewResults, setPreviewResults] = useState<Product[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguage(); // Get translate function

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchPreviewResults = useCallback(() => {
    if (!debouncedSearchTerm.trim()) {
      setPreviewResults([]);
      setShowPreview(false);
      setIsLoadingPreview(false);
      return;
    }

    setIsLoadingPreview(true);
    // Simulate a slight delay for a better UX if results are fetched fast
    setTimeout(() => {
      const allProducts = getAllProducts();
      const query = debouncedSearchTerm.toLowerCase();
      const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.categoryName?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      ).slice(0, MAX_PREVIEW_RESULTS);

      setPreviewResults(filteredProducts);
      setShowPreview(true);
      setIsLoadingPreview(false);
    }, 150); // Short delay
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchPreviewResults();
  }, [fetchPreviewResults]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowPreview(false);
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleInputFocus = () => {
    if (previewResults.length > 0 && searchTerm.trim()) {
      setShowPreview(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowPreview(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full lg:w-[440px]" ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <Input
          type="search"
          placeholder={translate('search.placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          className="bg-background focus-visible:ring-primary"
          aria-label={translate('search.placeholder')}
        />
        <Button type="submit" variant="ghost" size="icon" aria-label={translate('search.submit_aria_label', {defaultValue: 'Submit search'})}>
          <SearchIcon className="h-5 w-5 text-foreground hover:text-primary" />
        </Button>
      </form>

      {showPreview && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-xl border-border bg-card">
          <ScrollArea className={cn("max-h-96", previewResults.length > 3 ? "h-96" : "h-auto")}>
            {isLoadingPreview && (
              <div className="p-4 flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>{translate('search.loading')}</span>
              </div>
            )}
            {!isLoadingPreview && previewResults.length === 0 && debouncedSearchTerm.trim() && (
              <p className="p-4 text-sm text-muted-foreground text-center">{translate('search.no_results_for_query', { query: debouncedSearchTerm })}</p>
            )}
            {!isLoadingPreview && previewResults.length > 0 && (
              <ul className="divide-y divide-border">
                {previewResults.map(product => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.id}`}
                        className="flex items-center p-3 hover:bg-muted/50 transition-colors space-x-3"
                        onClick={() => setShowPreview(false)}
                      >
                        <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0" data-ai-hint="search preview placeholder">
                          {/* Placeholder for product image */}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-primary">₸{product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            )}
            {!isLoadingPreview && debouncedSearchTerm.trim() && (
              <div className="p-3 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-sm text-primary hover:text-primary/90"
                  onClick={() => {
                    setShowPreview(false);
                    router.push(`/search?q=${encodeURIComponent(debouncedSearchTerm.trim())}`);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {translate('search.show_all_results_for_query', { query: debouncedSearchTerm.length > 20 ? debouncedSearchTerm.substring(0,20) + '...' : debouncedSearchTerm })}
                </Button>
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
