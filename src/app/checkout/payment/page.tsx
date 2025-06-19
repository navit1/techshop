
"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCheckout } from '@/contexts/CheckoutProvider';
import type { PaymentMethod } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CreditCard, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

export default function PaymentPage() {
  const router = useRouter();
  const { checkoutData, setPaymentMethod, isInitialized } = useCheckout();
  const { translate } = useLanguage(); // Get translate function

  const paymentMethods: PaymentMethod[] = [
    { id: 'cod', name: translate('checkout.payment.method_cod_name'), description: translate('checkout.payment.method_cod_desc') },
    { id: 'kaspi_qr', name: translate('checkout.payment.method_kaspi_name'), description: translate('checkout.payment.method_kaspi_desc') },
    { id: 'card_online', name: translate('checkout.payment.method_card_online_name'), description: translate('checkout.payment.method_card_online_desc') },
  ];

  const paymentSchema = z.object({
    paymentMethodId: z.string().min(1, { message: translate('checkout.payment.validation_method_required') }),
  });

  type PaymentFormValues = z.infer<typeof paymentSchema>;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethodId: checkoutData.paymentMethod?.id || '',
    },
  });
  
  useEffect(() => {
    if (isInitialized && checkoutData.paymentMethod) {
      form.setValue('paymentMethodId', checkoutData.paymentMethod.id);
    }
  }, [isInitialized, checkoutData.paymentMethod, form]);

  const onSubmit = (data: PaymentFormValues) => {
    const selectedMethod = paymentMethods.find(method => method.id === data.paymentMethodId);
    if (selectedMethod) {
      setPaymentMethod(selectedMethod);
      router.push('/checkout/review');
    }
  };

  if (!isInitialized) {
    return null; 
  }
  
  const getIconForPaymentMethod = (id: string) => {
    if (id === 'kaspi_qr') return <QrCode className="h-5 w-5 mr-3 text-red-600" />;
    if (id === 'cod' || id === 'card_online') return <CreditCard className="h-5 w-5 mr-3 text-primary" />;
    return <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />;
  }


  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-semibold text-foreground">{translate('checkout.payment.title')}</CardTitle>
        <CardDescription>{translate('checkout.payment.description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethodId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">{translate('checkout.payment.select_method_label')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {paymentMethods.map((method) => (
                        <FormItem key={method.id} className="flex items-center space-x-3 space-y-0 p-4 border rounded-md hover:bg-muted/50 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                          <FormControl>
                            <RadioGroupItem value={method.id} />
                          </FormControl>
                          <FormLabel className="font-normal flex-grow cursor-pointer flex items-center">
                            {getIconForPaymentMethod(method.id)}
                            <div>
                                <span className="block text-sm font-medium text-foreground">{method.name}</span>
                                {method.description && <span className="block text-xs text-muted-foreground">{method.description}</span>}
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" asChild>
                <Link href="/checkout/shipping">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {translate('checkout.payment.button_back_to_shipping')}
                </Link>
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {translate('checkout.payment.button_to_review')} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
