
"use client";
import Link from 'next/link';
import { ShoppingCart, List, Heart, User, Menu, ChevronDown, ChevronRight, LogIn, UserCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartProvider';
import { SearchInput } from '@/components/search/SearchInput';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CatalogDropdown } from '@/components/layout/CatalogDropdown';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { getAllCategories } from '@/lib/data';
import type { Category } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';


interface PopoverCatalogDropdownProps {
  onLinkClick?: () => void;
  categories: Category[];
}

function PopoverCatalogDropdown({ categories, onLinkClick }: PopoverCatalogDropdownProps) {
  const mainCategories = categories.filter(c => !c.parentId);
  const getSubCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);

  return (
    <div className="bg-card text-card-foreground shadow-lg rounded-b-md md:rounded-md border border-t-0 md:border-t">
      <ScrollArea className="h-auto md:max-h-[80vh] md:h-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1 p-4 md:p-6">
          {mainCategories.map((category) => {
            const subCategories = getSubCategories(category.id);
            return (
              <div key={category.id} className="py-3">
                <Link
                  href={`/products?category=${category.slug}`}
                  onClick={onLinkClick}
                  className="group font-semibold text-base text-foreground hover:text-primary transition-colors flex items-center justify-between mb-2.5"
                >
                  <span>{category.name}</span>
                </Link>
                {subCategories.length > 0 && (
                  <ul className="space-y-1.5">
                    {subCategories.map((subCategory) => (
                      <li key={subCategory.id}>
                        <Link
                          href={`/products?category=${subCategory.slug}`}
                          onClick={onLinkClick}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 hover:bg-muted/50 rounded-md px-2"
                        >
                          {subCategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}


export function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const allCategories = getAllCategories(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const authLinkHref = currentUser ? "/profile" : "/login";
  const authLinkText = currentUser ? "Профиль" : "Вход";
  const AuthIcon = currentUser ? UserCircle : LogIn;

  return (
    <header className="bg-card shadow-md sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center gap-x-4 relative">

        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            TechShop
          </Link>

          <div className="hidden md:block">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm" aria-label="Каталог">
                  <List className="h-5 w-5 mr-2" />
                  <span>Каталог</span>
                  <ChevronDown className="h-4 w-4 ml-1 opacity-75" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-screen max-w-5xl mt-1 p-0" align="start" sideOffset={5}>
                 <PopoverCatalogDropdown categories={allCategories} onLinkClick={() => { /* Close popover logic can be added if needed */ }} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="hidden md:flex flex-grow justify-center mx-4 lg:mx-8 xl:mx-16">
           <SearchInput />
        </div>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
          <nav className="hidden md:flex items-center space-x-3 sm:space-x-4">
            <Link href="/cart" className="flex flex-col items-center justify-center text-foreground hover:text-primary transition-colors relative px-1 py-1 group" aria-label="Корзина">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 group-hover:text-primary transition-colors">Корзина</span>
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center justify-center text-foreground hover:text-primary transition-colors px-1 py-1 group" aria-label="Избранное">
              <Heart className="h-5 w-5" />
              <span className="text-xs mt-1 group-hover:text-primary transition-colors">Избранное</span>
            </Link>
            {!isLoadingAuth && (
                <Link href={authLinkHref} className="flex flex-col items-center justify-center text-foreground hover:text-primary transition-colors px-1 py-1 group" aria-label={authLinkText}>
                  <AuthIcon className="h-5 w-5" />
                  <span className="text-xs mt-1 group-hover:text-primary transition-colors">{authLinkText}</span>
                </Link>
            )}
          </nav>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Открыть меню">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-0 sm:max-w-sm">
                <div className="flex flex-col h-full">
                   <div className="p-4 border-b">
                     <Link href="/" className="text-xl font-bold text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                        TechShop
                     </Link>
                   </div>
                   <div className="p-4 flex-grow overflow-y-auto">
                      <div className="mb-6">
                         <SearchInput />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 px-2 text-foreground">Каталог</h3>
                      <div className="border rounded-md">
                        <CatalogDropdown categories={allCategories} onLinkClick={() => setIsMobileMenuOpen(false)} />
                      </div>

                      <nav className="mt-8 flex flex-col space-y-4 border-t pt-6">
                        <Link href="/cart" className="flex items-center text-foreground hover:text-primary transition-colors text-lg" aria-label="Корзина" onClick={() => setIsMobileMenuOpen(false)}>
                          <ShoppingCart className="h-5 w-5 mr-3" />
                          <span>Корзина</span>
                           {itemCount > 0 && (
                              <span className="ml-auto bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {itemCount}
                              </span>
                           )}
                        </Link>
                        <Link href="/wishlist" className="flex items-center text-foreground hover:text-primary transition-colors text-lg" aria-label="Избранное" onClick={() => setIsMobileMenuOpen(false)}>
                          <Heart className="h-5 w-5 mr-3" />
                          <span>Избранное</span>
                        </Link>
                        {!isLoadingAuth && (
                            <Link href={authLinkHref} className="flex items-center text-foreground hover:text-primary transition-colors text-lg" aria-label={authLinkText} onClick={() => setIsMobileMenuOpen(false)}>
                              <AuthIcon className="h-5 w-5 mr-3" />
                              <span>{authLinkText}</span>
                            </Link>
                        )}
                      </nav>
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
