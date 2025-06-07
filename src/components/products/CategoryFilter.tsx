
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories: allCategories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  // Фильтруем категории, чтобы оставить только родительские (без parentId)
  const mainCategories = allCategories.filter(category => !category.parentId);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    // Сбрасываем параметр 'q' (поисковый запрос) при изменении категории,
    // чтобы избежать ситуаций, когда поиск применяется к новой категории без явного ввода пользователя
    params.delete('q');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-foreground">Фильтр по категориям</h3>
      <Select onValueChange={handleCategoryChange} defaultValue={currentCategory}>
        <SelectTrigger className="w-full sm:w-[280px] md:w-[320px] bg-card">
          <SelectValue placeholder="Выберите категорию" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все категории</SelectItem>
          {mainCategories.map(category => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
