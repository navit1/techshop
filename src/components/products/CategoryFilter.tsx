
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
import { useLanguage } from '@/contexts/LanguageProvider';

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories: allCategories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { translate } = useLanguage();
  const currentCategorySlug = searchParams.get('category') || 'all';

  const mainCategories = allCategories.filter(category => !category.parentId);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    params.delete('q');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-foreground">{translate('filter.category_filter_title')}</h3>
      <Select onValueChange={handleCategoryChange} value={currentCategorySlug}>
        <SelectTrigger className="w-full sm:w-[280px] md:w-[320px] bg-card">
          <SelectValue placeholder={translate('filter.select_category_placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{translate('filter.all_categories')}</SelectItem>
          {mainCategories.map(category => (
            <SelectItem key={category.id} value={category.slug}>
              {translate(`category.${category.slug}`, { defaultValue: category.name })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
