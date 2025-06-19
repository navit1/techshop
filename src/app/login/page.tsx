
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Added for redirection
import { useState } from "react"; // Added for loading state
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase auth
import { auth } from "@/lib/firebase"; // Firebase auth instance

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
import { Loader2 } from "lucide-react"; // Loader icon

const loginSchema = z.object({
  email: z.string().email({ message: "Пожалуйста, введите действительный email." }),
  password: z.string().min(1, { message: "Пароль не может быть пустым." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
        title: "Успешный вход!",
        description: "Вы успешно вошли в систему.",
      });
      router.push("/"); // Redirect to homepage after successful login
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Произошла ошибка при входе. Попробуйте еще раз.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Неверный email или пароль. Пожалуйста, проверьте введенные данные.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Некорректный формат email.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Слишком много попыток входа. Пожалуйста, попробуйте позже.";
      } else if (error.code === "auth/api-key-not-valid") {
        errorMessage = "Ошибка конфигурации Firebase: недействительный API ключ. Пожалуйста, проверьте файл src/lib/firebase.ts и ваши переменные окружения (.env.local).";
      }
      
      toast({
        title: "Ошибка входа",
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
          <CardTitle className="text-3xl font-bold">Вход в TechShop</CardTitle>
          <CardDescription>Введите свои данные для доступа к аккаунту.</CardDescription>
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Нет аккаунта?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
