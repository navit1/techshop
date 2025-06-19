
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useOrder } from "@/contexts/OrderProvider"; // Added
import type { Order as OrderType } from "@/types"; // Added
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, UserCircle, ShoppingBag, Settings, KeyRound, HomeIcon, Edit3, Globe, PackageIcon, CalendarIcon, ListOrdered } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getOrderNoun, getItemNoun } from "@/lib/i18nUtils"; // Added
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("ru");
  const { getOrdersByCurrentUser } = useOrder(); // Added

  const userOrders = useMemo(() => {
    if (user) { // Only get orders if user is loaded
        return getOrdersByCurrentUser();
    }
    return [];
  }, [user, getOrdersByCurrentUser]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    });

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
    if (typeof window !== "undefined") {
        localStorage.setItem("appLanguage", lang);
    }
    toast({
      title: "Настройки языка",
      description: `Язык изменен на ${lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : 'Қазақша'}. Перезагрузите страницу для применения (имитация).`,
    });
  };
  
  const getOrderStatusText = (status: OrderType['status']) => {
    switch (status) {
      case 'pending': return 'В ожидании';
      case 'processing': return 'В обработке';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return 'Неизвестен';
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
            <ListOrdered className="mr-3 h-6 w-6 text-primary" />
            История заказов ({userOrders.length} {getOrderNoun(userOrders.length)})
          </CardTitle>
          <CardDescription>Просмотр ваших прошлых и текущих заказов.</CardDescription>
        </CardHeader>
        <CardContent>
          {userOrders.length === 0 ? (
            <p className="text-muted-foreground">У вас пока нет размещенных заказов.</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {userOrders.map((order) => (
                <AccordionItem value={order.id} key={order.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-2">
                      <span className="font-semibold text-primary">Заказ #{order.id.substring(order.id.length - 7)}</span>
                      <span className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="text-sm space-y-1">
                       <p><strong>Статус:</strong> <span className="font-medium">{getOrderStatusText(order.status)}</span></p>
                       <p><strong>Сумма:</strong> <span className="font-semibold text-primary">₸{order.totalPrice.toFixed(2)}</span> ({order.items.length} {getItemNoun(order.items.length)})</p>
                    </div>
                    <Separator/>
                    <h4 className="font-medium text-foreground">Товары:</h4>
                    <ul className="space-y-2 text-xs">
                      {order.items.map(item => (
                        <li key={item.productId} className="flex justify-between items-center">
                          <Link href={`/products/${item.productId}`} className="hover:text-primary hover:underline flex items-center">
                             {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded mr-2" data-ai-hint="order item placeholder"/>
                              ) : (
                                <div className="w-10 h-10 bg-muted rounded mr-2 flex items-center justify-center" data-ai-hint="order item placeholder">
                                  <PackageIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                            <span>{item.name} (x{item.quantity})</span>
                          </Link>
                          <span>₸{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <Separator/>
                     <h4 className="font-medium text-foreground mt-2">Доставка:</h4>
                     <div className="text-xs text-muted-foreground">
                        <p>{order.shippingAddress.fullName}, {order.shippingAddress.phoneNumber}</p>
                        <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                     </div>
                     <h4 className="font-medium text-foreground mt-2">Оплата:</h4>
                     <p className="text-xs text-muted-foreground">{order.paymentMethod.name}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
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
