
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
    <div className="relative w-full" ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <Input
          type="search"
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          className="bg-background focus-visible:ring-primary"
          aria-label="Поиск товаров"
        />
        <Button type="submit" variant="ghost" size="icon" aria-label="Выполнить поиск">
          <SearchIcon className="h-5 w-5 text-foreground hover:text-primary" />
        </Button>
      </form>

      {showPreview && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-xl border-border bg-card">
          <ScrollArea className={cn("max-h-96", previewResults.length > 3 ? "h-96" : "h-auto")}>
            {isLoadingPreview && (
              <div className="p-4 flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Загрузка...</span>
              </div>
            )}
            {!isLoadingPreview && previewResults.length === 0 && debouncedSearchTerm.trim() && (
              <p className="p-4 text-sm text-muted-foreground text-center">Товары по запросу "{debouncedSearchTerm}" не найдены.</p>
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
                        {/* Removed image section */}
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
                  Показать все результаты для "{debouncedSearchTerm.length > 20 ? debouncedSearchTerm.substring(0,20) + '...' : debouncedSearchTerm}"
                </Button>
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
