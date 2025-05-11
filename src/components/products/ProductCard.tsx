
"use client";
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartProvider';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

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

  const imageSrc = product.imageUrl ? product.imageUrl : `https://picsum.photos/seed/${product.id}/300/300`;
  const imageHint = product.imageUrl && product.id === 'prod_el_9' ? "iphone pro" : "product image";


  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="block group">
        <div className="aspect-square w-full bg-muted overflow-hidden relative">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={imageHint}
            priority={product.id === 'prod_el_9'} // Prioritize loading for specific important images
          />
        </div>
      </Link>
      <CardHeader className="p-4">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-lg font-semibold hover:text-primary transition-colors min-h-[2.5em] line-clamp-2">{product.name}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground mt-1">{product.categoryName}</p>
        <p className="text-xl font-bold text-primary mt-2">₸{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <Button onClick={handleAddToCart} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <ShoppingCart className="mr-2 h-4 w-4" /> В корзину
        </Button>
      </CardFooter>
    </Card>
  );
}
