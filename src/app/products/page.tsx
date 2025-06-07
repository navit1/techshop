
"use client"; // This page is now a client component to handle filters and sorting state

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Added useRouter
import { getAllProducts, getAllCategories, getProductsByCategoryId } from '@/lib/data';
import type { Product, Category } from '@/types';
import { getProductNoun } from '@/lib/i18nUtils';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { SortDropdown, type SortOption } from '@/components/products/SortDropdown';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FilterIcon, XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Metadata is now handled by app/products/layout.tsx

const MIN_PRICE_DEFAULT = 0;
const MAX_PRICE_DEFAULT = 5000000;


export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialized useRouter
  const allProductsMaster = useMemo(() => getAllProducts(), []);
  const categories = useMemo(() => getAllCategories(), []);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('q')?.toLowerCase();
  
  // Correctly parse price from searchParams or use defaults
  const minPriceInitial = parseInt(searchParams.get('minPrice') || String(MIN_PRICE_DEFAULT), 10);
  const maxPriceInitial = parseInt(searchParams.get('maxPrice') || String(MAX_PRICE_DEFAULT), 10);


  const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
  const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
  const sortOption = (searchParams.get('sort') as SortOption) || 'popularity';

  const { currentCategory, productsForCategory, pageTitle, minPossiblePriceForCategory, maxPossiblePriceForCategory } = useMemo(() => {
    let currentCat: Category | undefined;
    let prodsForCat = allProductsMaster;
    let title = 'Все товары';

    if (categorySlug && categorySlug !== 'all') {
      currentCat = categories.find(c => c.slug === categorySlug);
      if (currentCat) {
        prodsForCat = getProductsByCategoryId(currentCat.id);
        title = currentCat.name;
      } else {
        prodsForCat = []; // No products if category not found
        title = 'Категория не найдена';
      }
    }
    const pricesInCategory = prodsForCat.length > 0 ? prodsForCat.map(p => p.price) : [MIN_PRICE_DEFAULT];
    const minPrice = Math.min(...pricesInCategory, MIN_PRICE_DEFAULT);
    const maxPrice = Math.max(...pricesInCategory, MAX_PRICE_DEFAULT);
    
    return { 
      currentCategory: currentCat, 
      productsForCategory: prodsForCat, 
      pageTitle: title,
      minPossiblePriceForCategory: minPrice,
      maxPossiblePriceForCategory: maxPrice 
    };
  }, [categorySlug, allProductsMaster, categories]);

  const minPrice = minPriceInitial === MIN_PRICE_DEFAULT && productsForCategory.length > 0 ? minPossiblePriceForCategory : minPriceInitial;
  const maxPrice = maxPriceInitial === MAX_PRICE_DEFAULT && productsForCategory.length > 0 ? maxPossiblePriceForCategory : maxPriceInitial;


  const filteredAndSortedProducts = useMemo(() => {
    let productsToDisplay = [...productsForCategory];

    // Apply search query first if present
    if (searchQuery) {
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        (product.categoryName && product.categoryName.toLowerCase().includes(searchQuery)) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery))
      );
    }
    
    // Apply filters
    productsToDisplay = productsToDisplay.filter(product => {
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;
      const brandMatch = brands.length === 0 || (product.brand && brands.includes(product.brand));
      // Ensure attributes exist and "Цвет" is a string before checking
      const colorMatch = colors.length === 0 || (product.attributes?.["Цвет"] && typeof product.attributes["Цвет"] === 'string' && colors.includes(product.attributes["Цвет"] as string));
      return priceMatch && brandMatch && colorMatch;
    });

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        productsToDisplay.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        productsToDisplay.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        productsToDisplay.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'name-asc':
        productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        productsToDisplay.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'popularity': // Default, no specific sort or could be based on a future metric
      default:
        // Assuming products are already somewhat sorted by popularity or relevance from the source
        break;
    }
    return productsToDisplay;
  }, [productsForCategory, searchQuery, minPrice, maxPrice, brands, colors, sortOption]);
  
  const displayTitle = useMemo(() => {
    if (searchQuery) {
      let baseTitle = `Результаты поиска по запросу "${searchQuery}"`;
      if (currentCategory) {
        baseTitle += ` в категории "${currentCategory.name}"`;
      }
      return baseTitle;
    }
    return pageTitle;
  }, [searchQuery, currentCategory, pageTitle]);

  const activeFilters = useMemo(() => {
    const filters = [];
    
    // Use category-specific min/max for price badge condition
    if (minPrice !== minPossiblePriceForCategory || maxPrice !== maxPossiblePriceForCategory) {
        filters.push({ type: 'price', label: `Цена: ${minPrice} - ${maxPrice} ₸`, value: `${minPrice}-${maxPrice}` });
    }

    if (brands.length > 0) {
      filters.push(...brands.map(b => ({ type: 'brand', label: `Бренд: ${b}`, value: b })));
    }
    if (colors.length > 0) {
      filters.push(...colors.map(c => ({ type: 'color', label: `Цвет: ${c}`, value: c })));
    }
    return filters;
  }, [minPrice, maxPrice, brands, colors, minPossiblePriceForCategory, maxPossiblePriceForCategory]);

  const removeFilter = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'price') {
      params.delete('minPrice');
      params.delete('maxPrice');
    } else if (type === 'brand') {
      const currentBrands = params.get('brands')?.split(',') || [];
      const newBrands = currentBrands.filter(b => b !== value);
      if (newBrands.length > 0) params.set('brands', newBrands.join(','));
      else params.delete('brands');
    } else if (type === 'color') {
      const currentColors = params.get('colors')?.split(',') || [];
      const newColors = currentColors.filter(c => c !== value);
      if (newColors.length > 0) params.set('colors', newColors.join(','));
      else params.delete('colors');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };
  
  const resetAllFilters = () => {
    const params = new URLSearchParams();
    if (categorySlug && categorySlug !== 'all') params.set('category', categorySlug);
    if (searchQuery) params.set('q', searchQuery); // Keep search query if present
    if (sortOption && sortOption !== 'popularity') params.set('sort', sortOption); // Keep sort option
    router.push(`?${params.toString()}`, { scroll: false });
  };


  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 sticky top-20 h-[calc(100vh-6rem)]"> {/* Adjusted top and height */}
         <FilterSidebar products={filteredAndSortedProducts} allProductsForCategory={productsForCategory} />
      </aside>

      {/* Main Content Area */}
      <main className="w-full md:w-3/4 lg:w-4/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {displayTitle}
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm sm:text-base whitespace-nowrap hidden sm:block">
              Найдено: {filteredAndSortedProducts.length} {getProductNoun(filteredAndSortedProducts.length)}
            </p>
             <SortDropdown />
          </div>
        </div>
        
        {/* Mobile Filter Trigger */}
        <div className="md:hidden mb-4 flex items-center justify-between">
           <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)} className="w-full sm:w-auto">
            <FilterIcon className="mr-2 h-4 w-4" /> Фильтры
          </Button>
           <p className="text-muted-foreground text-sm whitespace-nowrap sm:hidden">
              {filteredAndSortedProducts.length} {getProductNoun(filteredAndSortedProducts.length)}
            </p>
        </div>
        
        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-foreground">Примененные фильтры:</h4>
                <Button variant="link" size="sm" onClick={resetAllFilters} className="text-primary hover:text-primary/80 p-0 h-auto">
                    Сбросить все
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <Badge key={`${filter.type}-${filter.value}`} variant="secondary" className="py-1 px-2 text-xs">
                  {filter.label}
                  <button onClick={() => removeFilter(filter.type, filter.value)} className="ml-1.5 p-0.5 hover:bg-destructive/20 rounded-full" aria-label={`Удалить фильтр ${filter.label}`}>
                    <XIcon className="h-3 w-3 text-destructive" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={filteredAndSortedProducts} categoryName={currentCategory?.name} query={searchQuery} />
          </Suspense>
        </div>
        {/* TODO: Add Pagination if many products */}
      </main>

      {/* Mobile Filter Sheet */}
      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm p-0">
          <div className="h-full"> {/* Removed p-4 from here */}
             <FilterSidebar products={filteredAndSortedProducts} allProductsForCategory={productsForCategory} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

    