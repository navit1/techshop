
"use client";

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { translate } = useLanguage(); // Get translate function
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId && typeof window !== "undefined") {
      router.replace('/');
    }
  }, [orderId, router]);

  useEffect(() => {
    document.title = `${translate('checkout.confirmation.page_title')} - ${translate('app.name')}`;
  }, [translate]);

  if (!orderId) {
    return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-semibold">{translate('checkout.confirmation.error_title')}</h1>
            <p className="text-muted-foreground">{translate('checkout.confirmation.error_no_order_id')}</p>
            <Button asChild className="mt-6">
              <Link href="/">{translate('checkout.confirmation.button_to_home')}</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center py-10 sm:py-16">
      <CheckCircle className="h-20 w-20 sm:h-24 sm:w-24 text-green-500 mb-6" />
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{translate('checkout.confirmation.success_title')}</h1>
      <p className="text-lg text-muted-foreground mb-2">{translate('checkout.confirmation.thank_you_message')}</p>
      <p className="text-md text-foreground mb-8">
        {translate('checkout.confirmation.order_number_label')}{' '}
        <span className="font-semibold text-primary">{orderId}</span>
      </p>
      <CardDescription className="max-w-md mx-auto mb-8 text-sm">
        {translate('checkout.confirmation.email_sent_message')}
      </CardDescription>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/products">
            <ShoppingBag className="mr-2 h-5 w-5" />
            {translate('checkout.confirmation.button_continue_shopping')}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/profile">
            <User className="mr-2 h-5 w-5" />
            {translate('checkout.confirmation.button_to_profile')}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
    const { translate } = useLanguage(); // For fallback text
    return (
        <Suspense fallback={<div className="text-center p-10">{translate('checkout.confirmation.loading_text')}</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
