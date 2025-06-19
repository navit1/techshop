
"use client";

import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartProvider';
import { useCheckout } from '@/contexts/CheckoutProvider';
import { useOrder } from '@/contexts/OrderProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, ChevronLeft, CheckCircle, ShoppingBag, Home, CreditCard, User, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPluralNoun } from '@/lib/i18nUtils';
import { useLanguage } from '@/contexts/LanguageProvider';

export default function ReviewPage() {
  const router = useRouter();
  const { cart, totalPrice, itemCount, clearCart } = useCart();
  const { checkoutData, clearCheckoutData, isInitialized } = useCheckout();
  const { addOrder } = useOrder();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { translate } = useLanguage();

  useEffect(() => {
    if (isInitialized) {
      if (itemCount === 0) {
        router.replace('/cart');
      } else if (!checkoutData.shippingAddress) {
        router.replace('/checkout/shipping');
      } else if (!checkoutData.paymentMethod) {
        router.replace('/checkout/payment');
      }
    }
  }, [isInitialized, itemCount, checkoutData, router]);


  const handlePlaceOrder = async () => {
    if (!checkoutData.shippingAddress || !checkoutData.paymentMethod || itemCount === 0) {
        console.error(translate('checkout.review.error_missing_data'));
        return;
    }
    setIsPlacingOrder(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const newOrderId = addOrder(cart, totalPrice, checkoutData.shippingAddress, checkoutData.paymentMethod);
    
    clearCart();
    clearCheckoutData();
    setIsPlacingOrder(false);
    router.push(`/checkout/confirmation?orderId=${newOrderId}`);
  };

  if (!isInitialized || !checkoutData.shippingAddress || !checkoutData.paymentMethod) {
    return (
        <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">{translate('checkout.loading_data')}</p>
        </div>
    );
  }

  const { shippingAddress, paymentMethod } = checkoutData;
  const itemNounText = getPluralNoun(itemCount, translate('noun.item.one'), translate('noun.item.few'), translate('noun.item.many'));

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-semibold text-foreground">{translate('checkout.review.title')}</CardTitle>
        <CardDescription>{translate('checkout.review.description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-primary" />{translate('checkout.review.cart_items_title', {count: itemCount, noun: itemNounText})}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-foreground">{item.name} (x{item.quantity})</p>
                  <p className="text-xs text-muted-foreground">{translate('product.sku')}: {item.sku || 'N/A'}</p>
                </div>
                <p className="text-foreground">₸{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold text-base text-primary">
              <p>{translate('checkout.review.subtotal_label')}</p>
              <p>₸{totalPrice.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Home className="mr-2 h-5 w-5 text-primary" />{translate('checkout.review.shipping_address_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-foreground">
            <p className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />{shippingAddress.fullName}</p>
            <p className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />{shippingAddress.email}</p>
            <p className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />{shippingAddress.phoneNumber}</p>
            <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              {shippingAddress.addressLine1}{shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary" />{translate('checkout.review.payment_method_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">{paymentMethod.name}</p>
            {paymentMethod.description && <p className="text-xs text-muted-foreground mt-1">{paymentMethod.description}</p>}
          </CardContent>
        </Card>
        
        <div className="text-right py-4">
            <p className="text-sm text-muted-foreground">{translate('checkout.review.shipping_cost_label')} {translate('checkout.review.shipping_cost_value')}</p>
            <p className="text-2xl font-bold text-primary mt-1">{translate('checkout.review.total_payable_label')} ₸{totalPrice.toFixed(2)}</p>
        </div>

      </CardContent>
      <CardFooter className="p-0 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/checkout/payment">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {translate('checkout.review.button_back_to_payment')}
          </Link>
        </Button>
        <Button 
            onClick={handlePlaceOrder} 
            disabled={isPlacingOrder || itemCount === 0 || !checkoutData.shippingAddress || !checkoutData.paymentMethod}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
        >
          {isPlacingOrder ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-5 w-5" />
          )}
          {isPlacingOrder ? translate('checkout.review.button_placing_order') : translate('checkout.review.button_place_order')}
        </Button>
      </CardFooter>
    </Card>
  );
}
