
"use client";

import { useState } from 'react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartProvider';
import { useWishlist } from '@/contexts/WishlistProvider'; // Added
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { cn } from '@/lib/utils'; // Added

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist(); // Added
  const { toast } = useToast();

  const isInWishlist = isProductInWishlist(product.id);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
      toast({
        title: "Добавлено в корзину!",
        description: `${quantity} x ${product.name} добавлено в вашу корзину.`,
      });
      setQuantity(1); // Reset quantity after adding
    }
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Удалено из избранного",
        description: `${product.name} удален из вашего избранного.`,
        variant: "destructive"
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Добавлено в избранное",
        description: `${product.name} добавлен в ваше избранное.`,
      });
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setQuantity(Math.max(1, Math.min(value, product.stock)));
    } else if (e.target.value === '') {
       // Allow empty input temporarily, could set to 1 or handle differently
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
      setQuantity(1);
    }
  }

  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <div className="flex items-center border rounded-md">
        <Button variant="ghost" size="icon" onClick={decrementQuantity} className="rounded-r-none h-10 w-10 border-r" aria-label="Уменьшить количество">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          onBlur={handleBlur}
          min="1"
          max={product.stock}
          className="w-12 sm:w-16 h-10 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Количество"
        />
        <Button variant="ghost" size="icon" onClick={incrementQuantity} className="rounded-l-none h-10 w-10 border-l" aria-label="Увеличить количество">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button 
        onClick={handleAddToCart} 
        className="bg-accent hover:bg-accent/90 text-accent-foreground flex-grow sm:flex-grow-0 h-10 px-3 sm:px-4" 
        disabled={product.stock === 0 || quantity <= 0}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleToggleWishlist} 
        aria-label={isInWishlist ? "Удалить из избранного" : "Добавить в избранное"}
        className={cn(
            "h-10 w-10",
            isInWishlist ? "border-destructive text-destructive hover:bg-destructive/10" : ""
        )}
      >
        <Heart className={cn("h-5 w-5", isInWishlist ? "fill-destructive" : "")} />
      </Button>
    </div>
  );
}
