
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
import { useEffect } from 'react'; // Added import

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, { message: "Полное имя обязательно." }),
  email: z.string().email({ message: "Введите действительный email." }),
  phoneNumber: z.string().min(5, { message: "Номер телефона обязателен." }).regex(/^\+?[0-9\s\-()]+$/, { message: "Неверный формат номера телефона."}),
  addressLine1: z.string().min(5, { message: "Адрес (строка 1) обязателен." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "Город обязателен." }),
  postalCode: z.string().min(3, { message: "Почтовый индекс обязателен." }),
  country: z.string().min(2, { message: "Страна обязательна." }),
});

type ShippingFormValues = z.infer<typeof shippingAddressSchema>;

export default function ShippingPage() {
  const router = useRouter();
  const { checkoutData, setShippingAddress, isInitialized } = useCheckout();

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
      country: 'Казахстан', // Default country
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
    return null; // Or a loader, handled by layout
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-semibold text-foreground">Адрес доставки</CardTitle>
        <CardDescription>Введите информацию для доставки вашего заказа.</CardDescription>
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
                    <FormLabel>Полное имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Иванов" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
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
                  <FormLabel>Номер телефона</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+7 (700) 123-45-67" {...field} />
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
                  <FormLabel>Адрес (строка 1)</FormLabel>
                  <FormControl>
                    <Input placeholder="ул. Абая, 123" {...field} />
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
                  <FormLabel>Адрес (строка 2, необязательно)</FormLabel>
                  <FormControl>
                    <Input placeholder="кв. 45, подъезд 2" {...field} />
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
                    <FormLabel>Город</FormLabel>
                    <FormControl>
                      <Input placeholder="Алматы" {...field} />
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
                    <FormLabel>Почтовый индекс</FormLabel>
                    <FormControl>
                      <Input placeholder="050000" {...field} />
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
                    <FormLabel>Страна</FormLabel>
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
                  Вернуться в корзину
                </Link>
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Продолжить к оплате <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
