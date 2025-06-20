
"use client";

import { useWishlist } from '@/contexts/WishlistProvider';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider'; 
import { useEffect } from 'react';

export default function WishlistPage() {
  const { wishlistItems, itemCount } = useWishlist();
  const { translate } = useLanguage(); 

  useEffect(() => {
    document.title = `${translate('wishlist.page_title')} - ${translate('app.name')}`;
  }, [translate]);

  const productNoun = translate('noun.product', { count: itemCount });

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-foreground">{translate('wishlist.empty_title')}</h1>
        <p className="text-muted-foreground mb-8">
          {translate('wishlist.empty_description')}
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/products">
            <ShoppingBag className="mr-2 h-5 w-5" />
            {translate('wishlist.button_go_shopping')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {translate('wishlist.title')}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base whitespace-nowrap">
          {translate('wishlist.count_text', { count: itemCount, noun: productNoun })}
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
