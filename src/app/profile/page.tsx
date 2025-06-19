
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Ошибка выхода",
        description: "Не удалось выйти из системы. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Should be redirected by useEffect, but as a fallback:
    return (
         <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <p>Перенаправление на страницу входа...</p>
         </div>
    );
  }

  return (
    <div className="flex justify-center items-start py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-20 w-20 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Мой профиль</CardTitle>
          <CardDescription>Ваша личная информация и настройки.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg text-foreground">{user.email}</p>
          </div>
          
          {/* Можно добавить больше информации о пользователе, если она доступна */}
          {/* Например, user.displayName, если он установлен */}

          <Button onClick={handleLogout} className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
