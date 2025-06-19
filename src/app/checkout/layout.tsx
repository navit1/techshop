
"use client";

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { useCart } from '@/contexts/CartProvider';
import { useCheckout } from '@/contexts/CheckoutProvider';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, itemCount } = useCart();
  const { checkoutData, isInitialized } = useCheckout();
  const { translate } = useLanguage();

  const steps = [
    { id: 'shipping', name: translate('checkout.step_shipping'), path: '/checkout/shipping' },
    { id: 'payment', name: translate('checkout.step_payment'), path: '/checkout/payment' },
    { id: 'review', name: translate('checkout.step_review'), path: '/checkout/review' },
    { id: 'confirmation', name: translate('checkout.step_confirmation'), path: '/checkout/confirmation' }, 
  ];

  const currentStep = steps.find(step => pathname.startsWith(step.path));
  const stepperSteps = steps.filter(s => s.id !== 'confirmation'); 

  useEffect(() => {
    document.title = `${translate('checkout.page_title')} - ${translate('app.name')}`;
  }, [translate]);

  useEffect(() => {
    if (!isInitialized) return; 

    if (itemCount === 0 && currentStep?.id !== 'confirmation') {
      router.replace('/cart');
      return;
    }

    if (currentStep?.id === 'payment' && !checkoutData.shippingAddress) {
      router.replace('/checkout/shipping');
    } else if (currentStep?.id === 'review' && (!checkoutData.shippingAddress || !checkoutData.paymentMethod)) {
      router.replace('/checkout/payment');
    }
  }, [pathname, itemCount, router, checkoutData, isInitialized, currentStep]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  const showStepper = currentStep?.id !== 'confirmation';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-foreground">{translate('checkout.page_title')}</h1>
      {showStepper && currentStep && (
        <CheckoutStepper steps={stepperSteps} currentStepId={currentStep.id} />
      )}
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-xl">
        {children}
      </div>
    </div>
  );
}
