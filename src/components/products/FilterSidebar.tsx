
"use client";

import type { Product, Category } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { XIcon, FilterIcon } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface FilterSidebarProps {
  products: Product[]; // Products in the current category/view
  allProductsForCategory: Product[]; // All products for the base category to derive filter options
  // onFilterChange: (filters: any) => void; // Will be handled by URL params
  // initialFilters: any; // Will be read from URL params
}

const MIN_PRICE_DEFAULT = 0;
const MAX_PRICE_DEFAULT = 5000000; // Arbitrary high max, adjust as needed

export function FilterSidebar({ products, allProductsForCategory }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') || String(MIN_PRICE_DEFAULT), 10),
    parseInt(searchParams.get('maxPrice') || String(MAX_PRICE_DEFAULT), 10)
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brands')?.split(',') || []
  );
  // Example for a single attribute filter, extend this pattern for more attributes
  const [selectedColors, setSelectedColors] = useState<string[]>(
    searchParams.get('colors')?.split(',') || []
  );

  const [minPriceInput, setMinPriceInput] = useState(String(priceRange[0]));
  const [maxPriceInput, setMaxPriceInput] = useState(String(priceRange[1]));


  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    allProductsForCategory.forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [allProductsForCategory]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    allProductsForCategory.forEach(p => {
      if (p.attributes?.["Цвет"] && typeof p.attributes["Цвет"] === 'string') {
        colors.add(p.attributes["Цвет"] as string);
      }
    });
    return Array.from(colors).sort();
  }, [allProductsForCategory]);
  
  const minPossiblePrice = useMemo(() => Math.min(...allProductsForCategory.map(p => p.price), MIN_PRICE_DEFAULT) || MIN_PRICE_DEFAULT, [allProductsForCategory]);
  const maxPossiblePrice = useMemo(() => Math.max(...allProductsForCategory.map(p => p.price), MAX_PRICE_DEFAULT) || MAX_PRICE_DEFAULT, [allProductsForCategory]);


  useEffect(() => {
    setMinPriceInput(String(priceRange[0]));
    setMaxPriceInput(String(priceRange[1]));
  }, [priceRange]);

  useEffect(() => {
    // Sync state from URL on initial load or URL change
    const min = parseInt(searchParams.get('minPrice') || String(minPossiblePrice), 10);
    const max = parseInt(searchParams.get('maxPrice') || String(maxPossiblePrice), 10);
    setPriceRange([min, max]);
    setSelectedBrands(searchParams.get('brands')?.split(',').filter(Boolean) || []);
    setSelectedColors(searchParams.get('colors')?.split(',').filter(Boolean) || []);
  }, [searchParams, minPossiblePrice, maxPossiblePrice]);


  const applyFilters = (newFilters: { price?: [number, number], brands?: string[], colors?: string[] }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFilters.price) {
      if (newFilters.price[0] !== minPossiblePrice) params.set('minPrice', String(newFilters.price[0])); else params.delete('minPrice');
      if (newFilters.price[1] !== maxPossiblePrice) params.set('maxPrice', String(newFilters.price[1])); else params.delete('maxPrice');
    }
    if (newFilters.brands) {
      if (newFilters.brands.length > 0) params.set('brands', newFilters.brands.join(',')); else params.delete('brands');
    }
    if (newFilters.colors) {
      if (newFilters.colors.length > 0) params.set('colors', newFilters.colors.join(',')); else params.delete('colors');
    }
    
    router.push(`?${params.toString()}`, { scroll: false });
  };
  
  const handlePriceInputChange = () => {
    let newMin = parseInt(minPriceInput, 10);
    let newMax = parseInt(maxPriceInput, 10);

    if (isNaN(newMin) || newMin < minPossiblePrice) newMin = minPossiblePrice;
    if (isNaN(newMax) || newMax > maxPossiblePrice) newMax = maxPossiblePrice;
    if (newMin > newMax) newMin = newMax;
    
    setPriceRange([newMin, newMax]);
    applyFilters({ price: [newMin, newMax], brands: selectedBrands, colors: selectedColors });
  };

  const handleSliderCommit = (newRange: [number, number]) => {
    setPriceRange(newRange);
    applyFilters({ price: newRange, brands: selectedBrands, colors: selectedColors });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brand]
      : selectedBrands.filter(b => b !== brand);
    setSelectedBrands(newBrands);
    applyFilters({ price: priceRange, brands: newBrands, colors: selectedColors });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...selectedColors, color]
      : selectedColors.filter(c => c !== color);
    setSelectedColors(newColors);
    applyFilters({ price: priceRange, brands: selectedBrands, colors: newColors });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('brands');
    params.delete('colors');
    // Add other filter params to delete here
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Also reset local state, though useEffect on searchParams should handle this
    setPriceRange([minPossiblePrice, maxPossiblePrice]);
    setSelectedBrands([]);
    setSelectedColors([]);
  };

  // Calculate product counts for filter options (simple version for now)
  const getBrandProductCount = (brand: string) => {
    return allProductsForCategory.filter(p => p.brand === brand).length;
  };
  const getColorProductCount = (color: string) => {
    return allProductsForCategory.filter(p => p.attributes?.["Цвет"] === color).length;
  };


  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h3 className="text-xl font-semibold text-foreground flex items-center">
          <FilterIcon className="w-5 h-5 mr-2" />
          Фильтры
        </h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-sm">
          Сбросить все
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)] pr-3"> {/* Adjust height as needed */}
        <Accordion type="multiple" defaultValue={['price', 'brand', 'color']} className="w-full">
          <AccordionItem value="price">
            <AccordionTrigger className="text-lg font-medium">Цена</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange} // For live visual feedback
                onValueCommit={handleSliderCommit} // To apply filter
                min={minPossiblePrice}
                max={maxPossiblePrice}
                step={Math.max(100, Math.round((maxPossiblePrice - minPossiblePrice) / 1000) * 100)} // Dynamic step
                className="my-4"
              />
              <div className="flex justify-between items-center gap-2">
                <Input
                  type="number"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  onBlur={handlePriceInputChange}
                  placeholder="От"
                  className="w-1/2"
                  aria-label="Минимальная цена"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  onBlur={handlePriceInputChange}
                  placeholder="До"
                  className="w-1/2"
                  aria-label="Максимальная цена"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {availableBrands.length > 0 && (
            <AccordionItem value="brand">
              <AccordionTrigger className="text-lg font-medium">Бренд</AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {availableBrands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                    />
                    <Label htmlFor={`brand-${brand}`} className="font-normal flex-grow cursor-pointer">
                      {brand} 
                      <span className="text-xs text-muted-foreground ml-1">({getBrandProductCount(brand)})</span>
                    </Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
          
          {availableColors.length > 0 && (
            <AccordionItem value="color">
              <AccordionTrigger className="text-lg font-medium">Цвет</AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {availableColors.map(color => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={(checked) => handleColorChange(color, !!checked)}
                    />
                    <Label htmlFor={`color-${color}`} className="font-normal flex-grow cursor-pointer">
                      {color}
                       <span className="text-xs text-muted-foreground ml-1">({getColorProductCount(color)})</span>
                    </Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Add more AccordionItems for other attributes here */}
          
        </Accordion>
      </ScrollArea>
    </div>
  );
}
