
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"; // Added useEffect
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { translate } = useLanguage(); // Get translate function

  useEffect(() => {
    document.title = `${translate('login.page_title')} - ${translate('app.name')}`;
  }, [translate]);

  const loginSchema = z.object({
    email: z.string().email({ message: translate('login.validation_email_invalid') }),
    password: z.string().min(1, { message: translate('login.validation_password_empty') }),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: translate('login.toast_success_title'),
        description: translate('login.toast_success_desc'),
      });
      router.push("/"); 
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessageKey = 'login.toast_error_generic_desc';
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessageKey = 'login.toast_error_invalid_credentials_desc';
      } else if (error.code === "auth/invalid-email") {
        errorMessageKey = 'login.toast_error_invalid_email_desc';
      } else if (error.code === "auth/too-many-requests") {
        errorMessageKey = 'login.toast_error_too_many_requests_desc';
      } else if (error.code === "auth/api-key-not-valid") {
        errorMessageKey = 'login.toast_error_firebase_api_key_invalid';
      }
      
      toast({
        title: translate('login.toast_error_title'),
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
          <CardTitle className="text-3xl font-bold">{translate('login.card_title')}</CardTitle>
          <CardDescription>{translate('login.card_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('login.email_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={translate('login.email_placeholder')} {...field} disabled={isLoading} />
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
                    <FormLabel>{translate('login.password_label')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={translate('login.password_placeholder')} {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? translate('login.loading_button') : translate('login.submit_button')}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            {translate('login.no_account_text')}{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              {translate('login.register_link')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
