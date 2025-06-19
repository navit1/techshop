
"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    // This case should ideally not happen if redirected correctly
    // Potentially redirect to home or cart if no order ID
    if (typeof window !== "undefined") {
        router.replace('/');
    }
    return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-semibold">Ошибка</h1>
            <p className="text-muted-foreground">Номер заказа не найден.</p>
            <Button asChild className="mt-6">
              <Link href="/">На главную</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center py-10 sm:py-16">
      <CheckCircle className="h-20 w-20 sm:h-24 sm:w-24 text-green-500 mb-6" />
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Заказ успешно размещен!</h1>
      <p className="text-lg text-muted-foreground mb-2">Спасибо за вашу покупку в TechShop.</p>
      <p className="text-md text-foreground mb-8">
        Номер вашего заказа: <span className="font-semibold text-primary">{orderId}</span>
      </p>
      <CardDescription className="max-w-md mx-auto mb-8 text-sm">
        Мы отправили подтверждение заказа на ваш email (имитация). Вы можете отслеживать статус вашего заказа в личном кабинете (функция в разработке).
      </CardDescription>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/products">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Продолжить покупки
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/profile">
            <User className="mr-2 h-5 w-5" />
            Перейти в профиль
          </Link>
        </Button>
      </div>
    </div>
  );
}


export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Загрузка подтверждения...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
