
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useOrder } from "@/contexts/OrderProvider";
import type { Order as OrderType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, UserCircle, ShoppingBag, Settings, KeyRound, HomeIcon, Edit3, Globe, PackageIcon, CalendarIcon, ListOrdered } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";
import { useLanguage, type Language } from '@/contexts/LanguageProvider';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getOrdersByCurrentUser } = useOrder();
  const { language, setLanguage, translate } = useLanguage();

  const userOrders = useMemo(() => {
    if (user) {
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
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      document.title = `${translate('profile.welcome')}, ${user.displayName || user.email} - ${translate('app.name')}`;
    } else if (!isLoading) {
      document.title = `${translate('nav.profile')} - ${translate('app.name')}`;
    }
  }, [user, isLoading, translate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: translate('toast.logout_success_title'),
        description: translate('profile.logout_success_desc', undefined, { defaultValue: "You have been successfully logged out."}),
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: translate('toast.logout_error_title'),
        description: translate('toast.logout_error_desc'),
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    let toastDescKey = 'toast.lang_changed_desc_ru';
    if (lang === 'en') toastDescKey = 'toast.lang_changed_desc_en';
    if (lang === 'kk') toastDescKey = 'toast.lang_changed_desc_kk';
    
    toast({
      title: translate('toast.lang_changed_title'),
      description: translate(toastDescKey),
    });
  };
  
  const getOrderStatusText = (status: OrderType['status']) => {
    return translate(`profile.order_status_${status}`, undefined, {defaultValue: status});
  };

  const orderNoun = translate('noun.order', { count: userOrders.length });
  const getItemNounForOrder = (count: number) => translate('noun.item', { count: count });


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
            <p>{translate('profile.redirecting_to_login')}</p>
         </div>
    );
  }
  
  const userInitial = user.displayName?.[0] || user.email?.[0]?.toUpperCase() || translate('profile.user_avatar_fallback_prefix');

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 px-4">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
          <AvatarImage src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=random&color=fff&size=128`} />
          <AvatarFallback className="text-3xl">{userInitial}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold text-foreground">
          {translate('profile.welcome')}, {user.displayName || user.email}!
        </h1>
        <p className="text-muted-foreground">{translate('profile.manage_info')}</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <UserCircle className="mr-3 h-6 w-6 text-primary" />
            {translate('profile.personal_info')}
          </CardTitle>
          <CardDescription>{translate('profile.personal_info_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{translate('profile.email')}</h3>
            <p className="text-lg text-foreground">{user.email}</p>
          </div>
          {user.displayName && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{translate('profile.name')}</h3>
              <p className="text-lg text-foreground">{user.displayName}</p>
            </div>
          )}
          <Button variant="outline" className="w-full sm:w-auto justify-start" disabled>
            <Edit3 className="mr-2 h-4 w-4" /> {translate('profile.edit_profile_wip')}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <ListOrdered className="mr-3 h-6 w-6 text-primary" />
            {translate('profile.order_history')} {translate('profile.order_history_count', { count: userOrders.length, noun: orderNoun })}
          </CardTitle>
          <CardDescription>{translate('profile.order_history_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {userOrders.length === 0 ? (
            <p className="text-muted-foreground">{translate('profile.no_orders')}</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {userOrders.map((order) => (
                <AccordionItem value={order.id} key={order.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-2">
                      <span className="font-semibold text-primary">{translate('profile.order_label_prefix')}{order.id.substring(order.id.length - 7)}</span>
                      <span className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="text-sm space-y-1">
                       <p><strong>{translate('profile.order_status_label')}</strong> <span className="font-medium">{getOrderStatusText(order.status)}</span></p>
                       <p><strong>{translate('profile.order_total_amount')}:</strong> <span className="font-semibold text-primary">₸{order.totalPrice.toFixed(2)}</span> ({order.items.length} {getItemNounForOrder(order.items.length)})</p>
                    </div>
                    <Separator/>
                    <h4 className="font-medium text-foreground">{translate('profile.order_items_label')}</h4>
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
                     <h4 className="font-medium text-foreground mt-2">{translate('profile.order_shipping_label')}</h4>
                     <div className="text-xs text-muted-foreground">
                        <p>{order.shippingAddress.fullName}, {order.shippingAddress.phoneNumber}</p>
                        <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                     </div>
                     <h4 className="font-medium text-foreground mt-2">{translate('profile.order_payment_label')}</h4>
                     <p className="text-xs text-muted-foreground">{translate(order.paymentMethod.id, undefined, {defaultValue: order.paymentMethod.name})}</p>
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
            {translate('profile.account_settings')}
          </CardTitle>
          <CardDescription>{translate('profile.account_settings_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" disabled>
            <KeyRound className="mr-2 h-4 w-4" /> {translate('profile.change_password_wip')}
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <HomeIcon className="mr-2 h-4 w-4" /> {translate('profile.manage_addresses_wip')}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Globe className="mr-3 h-6 w-6 text-primary" />
            {translate('profile.language_settings')}
          </CardTitle>
          <CardDescription>{translate('profile.language_settings_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="language-select" className="text-sm font-medium text-muted-foreground">{translate('profile.app_language')}</Label>
            <Select value={language} onValueChange={(value) => handleLanguageChange(value as Language)}>
              <SelectTrigger id="language-select" className="w-full sm:w-[280px] mt-1">
                <SelectValue placeholder={translate('profile.select_language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">{translate('profile.language_russian')}</SelectItem>
                <SelectItem value="en">{translate('profile.language_english')}</SelectItem>
                <SelectItem value="kk">{translate('profile.language_kazakh')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            {translate('profile.language_change_note')}
          </p>
        </CardContent>
      </Card>
      
      <Separator />

      <div className="text-center">
        <Button onClick={handleLogout} variant="destructive" size="lg" className="w-full max-w-xs">
          <LogOut className="mr-2 h-5 w-5" />
          {translate('profile.logout')}
        </Button>
      </div>
    </div>
  );
}
