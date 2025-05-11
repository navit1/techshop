
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
      {/* Image removed */}
      <CardHeader className="p-4">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-lg font-semibold hover:text-primary transition-colors min-h-[3em] line-clamp-2">{product.name}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground mt-1">{product.categoryName}</p>
        <p className="text-xl font-bold text-primary mt-2">₸{product.price.toFixed(2)}</p>
        {/* Removed description from card preview for brevity after image removal */}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button onClick={handleAddToCart} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <ShoppingCart className="mr-2 h-4 w-4" /> В корзину
        </Button>
      </CardFooter>
    </Card>
  );
}
