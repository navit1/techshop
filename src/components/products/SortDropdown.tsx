
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

export type SortOption = 
  | 'popularity' 
  | 'price-asc' 
  | 'price-desc' 
  | 'newest' 
  | 'name-asc' 
  | 'name-desc';

interface SortDropdownProps {}

export function SortDropdown({}: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { translate } = useLanguage(); // Get translate function
  const currentSort = (searchParams.get('sort') as SortOption) || 'popularity';

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'popularity') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const sortOptionsMap: {value: SortOption, labelKey: string }[] = [
    { value: 'popularity', labelKey: 'sort.popularity' },
    { value: 'price-asc', labelKey: 'sort.price_asc' },
    { value: 'price-desc', labelKey: 'sort.price_desc' },
    { value: 'newest', labelKey: 'sort.newest' },
    { value: 'name-asc', labelKey: 'sort.name_asc' },
    { value: 'name-desc', labelKey: 'sort.name_desc' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {translate('sort.label')}
      </label>
      <Select onValueChange={handleSortChange} value={currentSort} name="sort-select" aria-label={translate('sort.label')}>
        <SelectTrigger className="w-auto sm:w-[200px] bg-card">
          <SelectValue placeholder={translate('sort.placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {sortOptionsMap.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {translate(option.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
