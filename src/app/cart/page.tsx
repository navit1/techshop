
"use client"; // To use useLanguage for document.title
import { CartView } from '@/components/cart/CartView';
import { useLanguage } from '@/contexts/LanguageProvider';
import { useEffect } from 'react';

// export const metadata = { // Client component, metadata handled differently
//   title: 'Ваша корзина',
//   description: 'Просмотрите товары в вашей корзине и перейдите к оформлению заказа.',
// };

export default function CartPage() {
  const { translate } = useLanguage();

  useEffect(() => {
    document.title = `${translate('cart.page_title')} - ${translate('app.name')}`;
  }, [translate]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-foreground">{translate('cart.page_title')}</h1>
      <CartView />
    </div>
  );
}
