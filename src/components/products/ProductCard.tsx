
"use client";
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartProvider';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в вашу корзину.`,
    });
  };

  const handleAddToWishlist = () => {
    // Placeholder for actual wishlist logic
    toast({
      title: "Добавлено в избранное",
      description: `${product.name} добавлен в ваше избранное.`,
    });
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
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{product.categoryName}</p>
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
            {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleAddToWishlist} 
            aria-label="Добавить в избранное"
            className="h-auto aspect-square p-[calc(theme(spacing.1)_+_1px)] sm:p-[calc(theme(spacing.1)_+_3px)]" // Adjusted padding for responsiveness
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
