
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Избранное - TechShop',
  description: 'Ваши избранные товары в TechShop.',
};

export default function WishlistPage() {
  return (
    <div className="text-center py-20">
      <Heart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-foreground">Ваше избранное</h1>
      <p className="text-muted-foreground mb-8">
        Здесь будут отображаться товары, которые вы добавили в избранное.
      </p>
      <p className="text-muted-foreground mb-8">
        Эта функция находится в разработке.
      </p>
      <Button asChild size="lg">
        <Link href="/products">Продолжить покупки</Link>
      </Button>
    </div>
  );
}
