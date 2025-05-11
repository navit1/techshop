
"use client";

import Link from 'next/link';
import type { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartProvider';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    const validatedQuantity = Math.max(1, Math.min(newQuantity, item.stock));
    updateQuantity(item.id, validatedQuantity);
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
    toast({
      title: "Товар удален",
      description: `${item.name} удален из вашей корзины.`,
      variant: "destructive"
    });
  }

  return (
    <div className="flex items-start sm:items-center space-x-4 p-4 border-b bg-card rounded-md shadow-sm flex-col sm:flex-row">
      <Link href={`/products/${item.id}`} className="shrink-0">
        <div className="w-24 h-24 bg-muted rounded-md overflow-hidden relative">
           <Image
            src={`https://picsum.photos/seed/${item.id}/100/100`}
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint="cart item"
          />
        </div>
      </Link>
      <div className="flex-grow mt-3 sm:mt-0">
        <Link href={`/products/${item.id}`}>
          <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">{item.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">Цена: ₸{item.price.toFixed(2)}</p>
        <p className="text-md font-semibold text-primary">Подытог: ₸{(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2 mt-3 sm:mt-0">
         <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Уменьшить количество">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
          min="1"
          max={item.stock}
          className="w-16 h-10 text-center"
          aria-label="Количество товара"
        />
        <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={item.quantity >= item.stock} aria-label="Увеличить количество">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="ghost" size="icon" onClick={handleRemove} className="text-destructive hover:text-destructive/80 mt-3 sm:mt-0 self-end sm:self-center" aria-label="Удалить товар">
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
