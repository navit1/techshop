
import { CartView } from '@/components/cart/CartView';

export const metadata = {
  title: 'Ваша корзина',
  description: 'Просмотрите товары в вашей корзине и перейдите к оформлению заказа.',
};

export default function CartPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Ваша корзина</h1>
      <CartView />
    </div>
  );
}

