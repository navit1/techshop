
"use client";
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartProvider';
import { useWishlist } from '@/contexts/WishlistProvider';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage
import { getAllCategories } from '@/lib/data'; // Import categories
import { useMemo } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
  const { toast } = useToast();
  const { translate } = useLanguage(); // Get translate function

  const allCategories = useMemo(() => getAllCategories(), []);
  const category = useMemo(() => allCategories.find(c => c.id === product.categoryId), [allCategories, product.categoryId]);
  const categorySlug = category ? category.slug : '';
  const categoryDisplayNameForFallback = category ? category.name : (product.categoryName || '');


  const isInWishlist = isProductInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: translate('product.toast_added_to_cart_title'),
      description: translate('product.toast_added_to_cart_desc', { name: product.name, count: 1 }), // Assuming 1 item is added at a time from card
    });
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: translate('product.toast_removed_from_wishlist_title'),
        description: translate('product.toast_removed_from_wishlist_desc', { name: product.name }),
        variant: "destructive"
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: translate('product.toast_added_to_wishlist_title'),
        description: translate('product.toast_added_to_wishlist_desc', { name: product.name }),
      });
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="block group">
        <div className="aspect-[4/3] bg-muted rounded-t-lg group-hover:opacity-90 transition-opacity" data-ai-hint="product placeholder">
          {/* Placeholder for product image */}
        </div>
      </Link>
      <CardHeader className="p-2 sm:p-3">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-base sm:text-lg font-semibold hover:text-primary transition-colors min-h-[2.2em] line-clamp-2 leading-tight">{product.name}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 flex-grow">
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {translate(`category.${categorySlug}`, { defaultValue: categoryDisplayNameForFallback })}
        </p>
        <p className="text-lg sm:text-xl font-bold text-primary mt-1 sm:mt-2">₸{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-2 sm:p-3 border-t mt-auto">
        <div className="flex items-center space-x-2 w-full">
          <Button
            onClick={handleAddToCart}
            className="flex-grow bg-accent hover:bg-accent/90 text-accent-foreground text-sm sm:text-base py-1.5 sm:py-2"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === 0 ? translate('product.availability_out_of_stock') : translate('product.add_to_cart')}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleWishlist}
            aria-label={isInWishlist ? translate('product.remove_from_wishlist_aria') : translate('product.add_to_wishlist_aria')}
            className={cn(
                "h-auto aspect-square p-[calc(theme(spacing.1)_+_1px)] sm:p-[calc(theme(spacing.1)_+_3px)]",
                isInWishlist ? "border-destructive text-destructive hover:bg-destructive/10" : ""
            )}
          >
            <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isInWishlist ? "fill-destructive" : "")} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
