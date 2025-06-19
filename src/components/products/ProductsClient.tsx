'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllProducts, getAllCategories, getProductsByCategoryId } from '@/lib/data';
import type { Product, Category } from '@/types';
import { getPluralNoun } from '@/lib/i18nUtils';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { SortDropdown, type SortOption } from '@/components/products/SortDropdown';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FilterIcon, XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageProvider';

const MIN_PRICE_DEFAULT = 0;
const MAX_PRICE_DEFAULT = 5000000;

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { translate } = useLanguage();
  const allProductsMaster = useMemo(() => getAllProducts(), []);
  const categories = useMemo(() => getAllCategories(), []);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('q')?.toLowerCase();

  const minPriceInitial = parseInt(searchParams.get('minPrice') || String(MIN_PRICE_DEFAULT), 10);
  const maxPriceInitial = parseInt(searchParams.get('maxPrice') || String(MAX_PRICE_DEFAULT), 10);

  const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
  const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
  const sortOption = (searchParams.get('sort') as SortOption) || 'popularity';

  const { currentCategory, productsForCategory, pageTitleKey, minPossiblePriceForCategory, maxPossiblePriceForCategory } = useMemo(() => {
    let currentCat: Category | undefined;
    let prodsForCat = allProductsMaster;
    let titleKey = 'product.all_products_title';

    if (categorySlug && categorySlug !== 'all') {
      currentCat = categories.find(c => c.slug === categorySlug);
      if (currentCat) {
        prodsForCat = getProductsByCategoryId(currentCat.id);
        titleKey = `category.${currentCat.slug}`;
      } else {
        prodsForCat = [];
        titleKey = 'product.category_not_found_title';
      }
    }
    const pricesInCategory = prodsForCat.length > 0 ? prodsForCat.map(p => p.price) : [MIN_PRICE_DEFAULT];
    const minPrice = Math.min(...pricesInCategory, MIN_PRICE_DEFAULT);
    const maxPrice = Math.max(...pricesInCategory, MAX_PRICE_DEFAULT);

    return {
      currentCategory: currentCat,
      productsForCategory: prodsForCat,
      pageTitleKey: titleKey,
      minPossiblePriceForCategory: minPrice,
      maxPossiblePriceForCategory: maxPrice
    };
  }, [categorySlug, allProductsMaster, categories]);

  const pageTitle = translate(pageTitleKey, { defaultValue: currentCategory?.name || translate('product.all_products_title')});


  useEffect(() => {
    let dynamicTitle = translate('product.page_title');
    if (searchQuery) {
      dynamicTitle = translate('search.results_title', { query: searchQuery });
    } else if (currentCategory) {
      dynamicTitle = translate(`category.${currentCategory.slug}`, {defaultValue: currentCategory.name});
    } else {
      dynamicTitle = translate('product.all_products_title');
    }
    document.title = `${dynamicTitle} - ${translate('app.name')}`;
  }, [searchQuery, currentCategory, translate, pageTitleKey]);


  const minPrice = minPriceInitial === MIN_PRICE_DEFAULT && productsForCategory.length > 0 ? minPossiblePriceForCategory : minPriceInitial;
  const maxPrice = maxPriceInitial === MAX_PRICE_DEFAULT && productsForCategory.length > 0 ? maxPossiblePriceForCategory : maxPriceInitial;

  const filteredAndSortedProducts = useMemo(() => {
    let productsToDisplay = [...productsForCategory];

    if (searchQuery) {
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        (product.categoryName && product.categoryName.toLowerCase().includes(searchQuery)) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery))
      );
    }

    productsToDisplay = productsToDisplay.filter(product => {
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;
      const brandMatch = brands.length === 0 || (product.brand && brands.includes(product.brand));
      const colorMatch = colors.length === 0 || (product.attributes?.["Цвет"] && typeof product.attributes["Цвет"] === 'string' && colors.includes(product.attributes["Цвет"] as string));
      return priceMatch && brandMatch && colorMatch;
    });

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
      case 'popularity':
      default:
        break;
    }
    return productsToDisplay;
  }, [productsForCategory, searchQuery, minPrice, maxPrice, brands, colors, sortOption]);

  const displayTitle = useMemo(() => {
    if (searchQuery) {
      let baseTitleKey = 'search.results_title';
      let params = { query: searchQuery };
      if (currentCategory) {
        return translate('product.search_results_in_category_title', { query: searchQuery, categoryName: translate(`category.${currentCategory.slug}`, {defaultValue: currentCategory.name}) });
      }
      return translate(baseTitleKey, params);
    }
    return pageTitle;
  }, [searchQuery, currentCategory, pageTitle, translate]);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (minPrice !== minPossiblePriceForCategory || maxPrice !== maxPossiblePriceForCategory) {
        filters.push({ type: 'price', label: translate('filter.price_range_label', {minPrice, maxPrice}), value: `${minPrice}-${maxPrice}` });
    }
    if (brands.length > 0) {
      filters.push(...brands.map(b => ({ type: 'brand', label: translate('filter.brand_filter_label', {brand: b}), value: b })));
    }
    if (colors.length > 0) {
      filters.push(...colors.map(c => ({ type: 'color', label: translate('filter.color_filter_label', {color: c}), value: c })));
    }
    return filters;
  }, [minPrice, maxPrice, brands, colors, minPossiblePriceForCategory, maxPossiblePriceForCategory, translate]);

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
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const resetAllFilters = () => {
    const params = new URLSearchParams();
    if (categorySlug && categorySlug !== 'all') params.set('category', categorySlug);
    if (searchQuery) params.set('q', searchQuery);
    if (sortOption && sortOption !== 'popularity') params.set('sort', sortOption);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const productNoun = getPluralNoun(
    filteredAndSortedProducts.length,
    translate('noun.product.one'),
    translate('noun.product.few'),
    translate('noun.product.many')
  );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 sticky top-20 h-[calc(100vh-6rem)]">
         <FilterSidebar products={filteredAndSortedProducts} allProductsForCategory={productsForCategory} />
      </aside>

      <main className="w-full md:w-3/4 lg:w-4/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {displayTitle}
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm sm:text-base whitespace-nowrap hidden sm:block">
              {translate('search.found_count', { count: filteredAndSortedProducts.length, noun: productNoun })}
            </p>
             <SortDropdown />
          </div>
        </div>

        <div className="md:hidden mb-4 flex items-center justify-between">
           <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)} className="w-full sm:w-auto">
            <FilterIcon className="mr-2 h-4 w-4" /> {translate('filter.mobile_filters_button')}
          </Button>
           <p className="text-muted-foreground text-sm whitespace-nowrap sm:hidden">
              {translate('search.found_count', { count: filteredAndSortedProducts.length, noun: productNoun })}
            </p>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-foreground">{translate('filter.applied_filters')}</h4>
                <Button variant="link" size="sm" onClick={resetAllFilters} className="text-primary hover:text-primary/80 p-0 h-auto">
                    {translate('filter.reset_all')}
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <Badge key={`${filter.type}-${filter.value}`} variant="secondary" className="py-1 px-2 text-xs">
                  {filter.label}
                  <button
                    onClick={() => removeFilter(filter.type, filter.value)}
                    className="ml-1.5 p-0.5 hover:bg-destructive/20 rounded-full"
                    aria-label={translate('filter.remove_filter_aria', {label: filter.label })}>
                    <XIcon className="h-3 w-3 text-destructive" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <ProductGrid products={filteredAndSortedProducts} categoryName={currentCategory?.name} query={searchQuery} />
        </div>
      </main>

      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm p-0">
          <div className="h-full">
             <FilterSidebar products={filteredAndSortedProducts} allProductsForCategory={productsForCategory} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}