
"use client";

import { useState } from 'react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartProvider';
import { useWishlist } from '@/contexts/WishlistProvider';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
  const { toast } = useToast();
  const { translate } = useLanguage(); // Get translate function

  const isInWishlist = isProductInWishlist(product.id);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
      toast({
        title: translate('product.toast_added_to_cart_title'),
        description: translate('product.toast_added_to_cart_desc', { name: product.name, count: quantity }),
      });
      setQuantity(1); // Reset quantity after adding
    }
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
       // Allow empty input temporarily
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
        <Button variant="ghost" size="icon" onClick={decrementQuantity} className="rounded-r-none h-10 w-10 border-r" aria-label={translate('product.decrease_quantity_aria')}>
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
          aria-label={translate('product.quantity_aria')}
        />
        <Button variant="ghost" size="icon" onClick={incrementQuantity} className="rounded-l-none h-10 w-10 border-l" aria-label={translate('product.increase_quantity_aria')}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button 
        onClick={handleAddToCart} 
        className="bg-accent hover:bg-accent/90 text-accent-foreground flex-grow sm:flex-grow-0 h-10 px-3 sm:px-4" 
        disabled={product.stock === 0 || quantity <= 0}
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
            "h-10 w-10",
            isInWishlist ? "border-destructive text-destructive hover:bg-destructive/10" : ""
        )}
      >
        <Heart className={cn("h-5 w-5", isInWishlist ? "fill-destructive" : "")} />
      </Button>
    </div>
  );
}
