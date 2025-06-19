
"use client";

import { useWishlist } from '@/contexts/WishlistProvider';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { getProductNoun } from '@/lib/i18nUtils';

export default function WishlistPage() {
  const { wishlistItems, itemCount } = useWishlist();

  // Metadata should be defined in a generateMetadata function if needed for SSR,
  // but for client component, we can set document.title if necessary or rely on layout.
  // For simplicity, title can be set via layout or a parent server component.

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-foreground">Ваше избранное пусто</h1>
        <p className="text-muted-foreground mb-8">
          Добавляйте товары в избранное, нажимая на сердечко рядом с ними.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/products">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Перейти к покупкам
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Избранные товары
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base whitespace-nowrap">
          В избранном: {itemCount} {getProductNoun(itemCount)}
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistItems.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

