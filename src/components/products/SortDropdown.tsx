
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from 'next/navigation';

export type SortOption = 
  | 'popularity' 
  | 'price-asc' 
  | 'price-desc' 
  | 'newest' 
  | 'name-asc' 
  | 'name-desc';

interface SortDropdownProps {
  // onSortChange: (value: SortOption) => void; // This will be handled by URL now
  // currentSort: SortOption; // This will be read from URL
}

export function SortDropdown({}: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get('sort') as SortOption) || 'popularity';

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'popularity') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        Сортировать по:
      </label>
      <Select onValueChange={handleSortChange} value={currentSort} name="sort-select" aria-label="Sort products by">
        <SelectTrigger className="w-auto sm:w-[200px] bg-card">
          <SelectValue placeholder="Выберите сортировку" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popularity">Популярности</SelectItem>
          <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
          <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
          <SelectItem value="newest">Новизне</SelectItem>
          <SelectItem value="name-asc">Название: А-Я</SelectItem>
          <SelectItem value="name-desc">Название: Я-А</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
