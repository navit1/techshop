
import { CartView } from '@/components/cart/CartView';

export const metadata = {
  title: 'Your Shopping Cart',
  description: 'Review items in your shopping cart and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Your Shopping Cart</h1>
      <CartView />
    </div>
  );
}
