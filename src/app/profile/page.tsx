
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, UserCircle, ShoppingBag, Settings, KeyRound, HomeIcon, Edit3, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("ru"); // Default to Russian

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    });

    // In a real i18n setup, you would load the saved language preference here
    // For now, this is just for the Select component's state
    const savedLang = typeof window !== "undefined" ? localStorage.getItem("appLanguage") : null;
    if (savedLang) {
      setSelectedLanguage(savedLang);
    }

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

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    // In a real i18n setup, you would save this preference and update the app's language
    if (typeof window !== "undefined") {
        localStorage.setItem("appLanguage", lang);
    }
    toast({
      title: "Настройки языка",
      description: `Язык изменен на ${lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : 'Қазақша'}. Перезагрузите страницу для применения (имитация).`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
         <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <p>Перенаправление на страницу входа...</p>
         </div>
    );
  }
  
  const userInitial = user.displayName?.[0] || user.email?.[0]?.toUpperCase() || "П";

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 px-4">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
          <AvatarImage src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=random&color=fff&size=128`} />
          <AvatarFallback className="text-3xl">{userInitial}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold text-foreground">
          Добро пожаловать, {user.displayName || user.email}!
        </h1>
        <p className="text-muted-foreground">Управляйте вашей информацией, заказами и настройками.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <UserCircle className="mr-3 h-6 w-6 text-primary" />
            Личная информация
          </CardTitle>
          <CardDescription>Ваши основные данные учетной записи.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg text-foreground">{user.email}</p>
          </div>
          {user.displayName && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Имя</h3>
              <p className="text-lg text-foreground">{user.displayName}</p>
            </div>
          )}
          <Button variant="outline" className="w-full sm:w-auto justify-start" disabled>
            <Edit3 className="mr-2 h-4 w-4" /> Редактировать профиль (в разработке)
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <ShoppingBag className="mr-3 h-6 w-6 text-primary" />
            История заказов
          </CardTitle>
          <CardDescription>Просмотр ваших прошлых и текущих заказов.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Здесь будет отображаться ваша история заказов. Этот раздел находится в разработке.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Settings className="mr-3 h-6 w-6 text-primary" />
            Настройки аккаунта
          </CardTitle>
          <CardDescription>Управление параметрами вашей учетной записи.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" disabled>
            <KeyRound className="mr-2 h-4 w-4" /> Изменить пароль (в разработке)
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <HomeIcon className="mr-2 h-4 w-4" /> Управление адресами (в разработке)
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Globe className="mr-3 h-6 w-6 text-primary" />
            Настройки языка
          </CardTitle>
          <CardDescription>Выберите предпочитаемый язык интерфейса.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="language-select" className="text-sm font-medium text-muted-foreground">Язык приложения</Label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select" className="w-full sm:w-[280px] mt-1">
                <SelectValue placeholder="Выберите язык" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="kk">Қазақша</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Полная смена языка интерфейса будет доступна в следующих обновлениях.
          </p>
        </CardContent>
      </Card>
      
      <Separator />

      <div className="text-center">
        <Button onClick={handleLogout} variant="destructive" size="lg" className="w-full max-w-xs">
          <LogOut className="mr-2 h-5 w-5" />
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}
