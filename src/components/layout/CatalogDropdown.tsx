
"use client"; // Mark as client component
import type { Category } from '@/types';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

interface CatalogDropdownProps {
  onLinkClick?: () => void;
  categories: Category[];
}

export function CatalogDropdown({ categories, onLinkClick }: CatalogDropdownProps) {
  const { translate } = useLanguage(); // Get translate function
  const mainCategories = categories.filter(c => !c.parentId);
  const getSubCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);

  return (
    <div className="bg-card text-card-foreground">
      <ScrollArea className="h-auto max-h-[70vh]">
        <div className="p-3 space-y-1">
          {mainCategories.map((category) => {
            const subCategories = getSubCategories(category.id);
            return (
              <div key={category.id}>
                <Link
                  href={`/products?category=${category.slug}`}
                  onClick={onLinkClick}
                  className="group flex items-center justify-between p-2.5 rounded-md text-sm font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  {/* Translate category name, providing original name as fallback if key doesn't exist */}
                  <span>{translate(`category.${category.slug}`, { defaultValue: category.name })}</span>
                  {subCategories.length > 0 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors opacity-75" />
                  )}
                </Link>
                {subCategories.length > 0 && (
                  <ul className="pt-1 pb-2 pl-5 space-y-1 ml-2 border-l border-border/70">
                    {subCategories.map((subCategory) => (
                      <li key={subCategory.id}>
                        <Link
                          href={`/products?category=${subCategory.slug}`}
                          onClick={onLinkClick}
                          className="group flex items-center justify-between p-2 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted/70 hover:text-primary transition-colors"
                        >
                          <span>{translate(`category.${subCategory.slug}`, { defaultValue: subCategory.name })}</span>
                           <ChevronRight className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
