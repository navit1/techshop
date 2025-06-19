
"use client";

import Link from 'next/link';
import type { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartProvider';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const { translate } = useLanguage(); // Get translate function

  const handleQuantityChange = (newQuantity: number) => {
    const validatedQuantity = Math.max(1, Math.min(newQuantity, item.stock));
    updateQuantity(item.id, validatedQuantity);
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
    toast({
      title: translate('cart.toast_item_removed_title'),
      description: translate('cart.toast_item_removed_desc', { name: item.name }),
      variant: "destructive"
    });
  }

  return (
    <div className="flex items-start sm:items-center space-x-4 p-4 border-b bg-card rounded-md shadow-sm flex-col sm:flex-row">
      <Link href={`/products/${item.id}`} className="flex-shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-md" data-ai-hint="cart item placeholder">
          {/* Placeholder for product image */}
        </div>
      </Link>
      <div className="flex-grow mt-3 sm:mt-0">
        <Link href={`/products/${item.id}`}>
          <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">{item.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{translate('cart.item_price_label')}: ₸{item.price.toFixed(2)}</p>
        <p className="text-md font-semibold text-primary">{translate('cart.item_subtotal_label')}: ₸{(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2 mt-3 sm:mt-0">
         <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1} aria-label={translate('product.decrease_quantity_aria')}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
          min="1"
          max={item.stock}
          className="w-16 h-10 text-center"
          aria-label={translate('cart.item_quantity_aria')}
        />
        <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={item.quantity >= item.stock} aria-label={translate('product.increase_quantity_aria')}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="ghost" size="icon" onClick={handleRemove} className="text-destructive hover:text-destructive/80 mt-3 sm:mt-0 self-end sm:self-center" aria-label={translate('cart.remove_item_aria')}>
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
