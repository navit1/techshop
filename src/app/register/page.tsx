
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import Firebase auth instance

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

const registerSchema = z.object({
  email: z.string().email({ message: "Пожалуйста, введите действительный email." }),
  password: z.string().min(6, { message: "Пароль должен содержать не менее 6 символов." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Пароли не совпадают.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
        title: "Успешная регистрация!",
        description: "Вы успешно зарегистрированы. Теперь вы можете войти.",
      });
      router.push("/login"); // Redirect to login page after successful registration
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Произошла ошибка при регистрации. Попробуйте еще раз.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Этот email уже используется. Пожалуйста, используйте другой email или войдите.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Пароль слишком слабый. Пожалуйста, используйте более надежный пароль (минимум 6 символов).";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Некорректный формат email.";
      } else if (error.code === "auth/api-key-not-valid") {
        errorMessage = "Ошибка конфигурации Firebase: недействительный API ключ. Пожалуйста, проверьте файл src/lib/firebase.ts и ваши переменные окружения (.env.local), чтобы убедиться, что указан правильный API ключ вашего Firebase проекта.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Ошибка регистрации: вход по email/паролю не включен в вашем Firebase проекте. Пожалуйста, включите его в консоли Firebase -> Authentication -> Sign-in method.";
      }
      
      toast({
        title: "Ошибка регистрации",
        description: errorMessage,
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
          <CardTitle className="text-3xl font-bold">Регистрация в TechShop</CardTitle>
          <CardDescription>Создайте новый аккаунт, чтобы начать покупки.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} disabled={isLoading} />
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
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
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
                    <FormLabel>Подтвердите пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Войти
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
