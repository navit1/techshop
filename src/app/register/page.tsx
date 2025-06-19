
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"; // Added useEffect
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { translate } = useLanguage(); // Get translate function

  useEffect(() => {
    document.title = `${translate('register.page_title')} - ${translate('app.name')}`;
  }, [translate]);

  const registerSchema = z.object({
    email: z.string().email({ message: translate('register.validation_email_invalid') }),
    password: z.string().min(6, { message: translate('register.validation_password_min_length') }),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: translate('register.validation_passwords_do_not_match'),
    path: ["confirmPassword"],
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: translate('register.toast_success_title'),
        description: translate('register.toast_success_desc'),
      });
      router.push("/login"); 
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessageKey = 'register.toast_error_generic_desc';
      if (error.code === "auth/email-already-in-use") {
        errorMessageKey = 'register.toast_error_email_in_use_desc';
      } else if (error.code === "auth/weak-password") {
        errorMessageKey = 'register.toast_error_weak_password_desc';
      } else if (error.code === "auth/invalid-email") {
        errorMessageKey = 'register.toast_error_invalid_email_desc';
      } else if (error.code === "auth/api-key-not-valid") {
        errorMessageKey = 'register.toast_error_firebase_api_key_invalid';
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessageKey = 'register.toast_error_operation_not_allowed';
      }
      
      toast({
        title: translate('register.toast_error_title'),
        description: translate(errorMessageKey),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{translate('register.card_title')}</CardTitle>
          <CardDescription>{translate('register.card_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('register.email_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={translate('register.email_placeholder')} {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('register.password_label')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={translate('register.password_placeholder')} {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('register.confirm_password_label')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={translate('register.confirm_password_placeholder')} {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? translate('register.loading_button') : translate('register.submit_button')}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            {translate('register.has_account_text')}{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {translate('register.login_link')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
