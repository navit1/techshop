
"use client";
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartProvider';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from 'lucide-react';

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

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Removed image section */}
      <CardHeader className="p-2 sm:p-3">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-base sm:text-lg font-semibold hover:text-primary transition-colors min-h-[2.2em] line-clamp-2">{product.name}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 flex-grow">
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{product.categoryName}</p>
        <p className="text-lg sm:text-xl font-bold text-primary mt-1 sm:mt-2">₸{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-2 sm:p-3 border-t mt-auto">
        <Button onClick={handleAddToCart} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm sm:text-base py-1.5 sm:py-2">
          <ShoppingCart className="mr-2 h-4 w-4" /> В корзину
        </Button>
      </CardFooter>
    </Card>
  );
}

