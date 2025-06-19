
"use client";

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { useCart } from '@/contexts/CartProvider';
import { useCheckout } from '@/contexts/CheckoutProvider';
import { Loader2 } from 'lucide-react';

const steps = [
  { id: 'shipping', name: 'Доставка', path: '/checkout/shipping' },
  { id: 'payment', name: 'Оплата', path: '/checkout/payment' },
  { id: 'review', name: 'Проверка', path: '/checkout/review' },
  { id: 'confirmation', name: 'Подтверждение', path: '/checkout/confirmation' }, // Confirmation is a final step, not shown in stepper usually
];

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, itemCount } = useCart();
  const { checkoutData, isInitialized } = useCheckout();

  const currentStep = steps.find(step => pathname.startsWith(step.path));
  const stepperSteps = steps.filter(s => s.id !== 'confirmation'); // Exclude confirmation from stepper

  useEffect(() => {
    if (!isInitialized) return; // Wait for checkout data to be loaded

    if (itemCount === 0 && currentStep?.id !== 'confirmation') {
      // If cart is empty and not on confirmation page, redirect to cart
      router.replace('/cart');
      return;
    }

    // Prevent access to later steps if previous steps are not completed
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
  
  // Hide stepper on confirmation page
  const showStepper = currentStep?.id !== 'confirmation';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Оформление заказа</h1>
      {showStepper && currentStep && (
        <CheckoutStepper steps={stepperSteps} currentStepId={currentStep.id} />
      )}
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-xl">
        {children}
      </div>
    </div>
  );
}
