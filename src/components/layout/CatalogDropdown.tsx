
import { getAllCategories } from '@/lib/data';
import type { Category } from '@/types';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react'; // Or any suitable icon

interface CatalogDropdownProps {
  onLinkClick?: () => void; // Optional callback for mobile menu closing
}

export function CatalogDropdown({ onLinkClick }: CatalogDropdownProps) {
  const categories: Category[] = getAllCategories();

  // Determine number of columns based on category count (adjust as needed)
  const numColumns = categories.length > 12 ? 4 : (categories.length > 6 ? 3 : 2);
  const columnClass = `grid-cols-${numColumns}`;

  return (
    <div className="bg-card text-card-foreground shadow-lg rounded-b-md md:rounded-md border border-t-0 md:border-t">
      <ScrollArea className="h-auto md:max-h-[70vh] md:h-auto"> {/* Added ScrollArea */}
        <div className={cn(
            "grid gap-x-6 gap-y-4 p-4 md:p-6",
             `md:${columnClass}` // Apply grid columns only on medium screens and up
             )}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              onClick={onLinkClick}
              className="group flex items-center justify-between p-2 rounded-md text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <span>{category.name}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
