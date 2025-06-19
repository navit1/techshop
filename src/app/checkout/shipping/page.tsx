
"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCheckout } from '@/contexts/CheckoutProvider';
import type { ShippingAddress } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

export default function ShippingPage() {
  const router = useRouter();
  const { checkoutData, setShippingAddress, isInitialized } = useCheckout();
  const { translate } = useLanguage(); // Get translate function

  const shippingAddressSchema = z.object({
    fullName: z.string().min(2, { message: translate('checkout.shipping.validation_fullname_required') }),
    email: z.string().email({ message: translate('checkout.shipping.validation_email_invalid') }),
    phoneNumber: z.string().min(5, { message: translate('checkout.shipping.validation_phone_required') }).regex(/^\+?[0-9\s\-()]+$/, { message: translate('checkout.shipping.validation_phone_invalid')}),
    addressLine1: z.string().min(5, { message: translate('checkout.shipping.validation_address1_required') }),
    addressLine2: z.string().optional(),
    city: z.string().min(2, { message: translate('checkout.shipping.validation_city_required') }),
    postalCode: z.string().min(3, { message: translate('checkout.shipping.validation_postal_code_required') }),
    country: z.string().min(2, { message: translate('checkout.shipping.validation_country_required') }),
  });
  
  type ShippingFormValues = z.infer<typeof shippingAddressSchema>;

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: checkoutData.shippingAddress || {
      fullName: '',
      email: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      country: translate('checkout.shipping.country_value_default'), // Default country
    },
  });
  
  useEffect(() => {
    if (isInitialized && checkoutData.shippingAddress) {
      form.reset(checkoutData.shippingAddress);
    }
  }, [isInitialized, checkoutData.shippingAddress, form]);


  const onSubmit = (data: ShippingFormValues) => {
    setShippingAddress(data as ShippingAddress);
    router.push('/checkout/payment');
  };

  if (!isInitialized) {
    return null; 
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-semibold text-foreground">{translate('checkout.shipping.title')}</CardTitle>
        <CardDescription>{translate('checkout.shipping.description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('checkout.shipping.full_name_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={translate('checkout.shipping.full_name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('checkout.shipping.email_label')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={translate('checkout.shipping.email_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('checkout.shipping.phone_label')}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={translate('checkout.shipping.phone_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('checkout.shipping.address1_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={translate('checkout.shipping.address1_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('checkout.shipping.address2_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={translate('checkout.shipping.address2_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{translate('checkout.shipping.city_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={translate('checkout.shipping.city_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('checkout.shipping.postal_code_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={translate('checkout.shipping.postal_code_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('checkout.shipping.country_label')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" asChild>
                <Link href="/cart">
                  <Home className="mr-2 h-4 w-4" />
                  {translate('checkout.shipping.button_back_to_cart')}
                </Link>
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {translate('checkout.shipping.button_to_payment')} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
