
"use client";

import { useCart } from '@/contexts/CartProvider';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { getPluralNoun } from '@/lib/i18nUtils';
import { useLanguage } from '@/contexts/LanguageProvider';

export function CartView() {
  const { cart, totalPrice, clearCart, itemCount } = useCart();
  const { translate } = useLanguage();

  const itemNoun = getPluralNoun(
    itemCount,
    translate('noun.item.one'),
    translate('noun.item.few'),
    translate('noun.item.many')
  );

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h2 className="text-3xl font-semibold mb-4 text-foreground">{translate('cart.empty_title')}</h2>
        <p className="text-muted-foreground mb-8">{translate('cart.empty_description')}</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/products">{translate('cart.start_shopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {cart.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="md:col-span-1">
        <Card className="sticky top-20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{translate('cart.order_summary_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-lg">
              <span>{translate('cart.subtotal_label', { count: itemCount, noun: itemNoun })}</span>
              <span className="font-semibold">₸{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{translate('cart.shipping_label')}</span>
              <span>{translate('cart.shipping_value_placeholder')}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t">
              <span>{translate('cart.total_label')}</span>
              <span>₸{totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              asChild 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
              size="lg"
              disabled={itemCount === 0}
            >
              <Link href="/checkout/shipping">
                <CreditCard className="mr-2 h-5 w-5" />
                {translate('cart.proceed_to_checkout_button')}
              </Link>
            </Button>
            <Button variant="outline" onClick={clearCart} className="w-full">
              {translate('cart.clear_cart_button')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
