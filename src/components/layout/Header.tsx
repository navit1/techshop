
"use client";
import Link from 'next/link';
import { ShoppingCart, List, Heart, User, Menu, ChevronDown } from 'lucide-react';
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
import { useState } from 'react';
import { getAllCategories } from '@/lib/data'; // Added for popover categories
import type { Category } from '@/types'; // Added for popover categories
import { ScrollArea } from '@/components/ui/scroll-area'; // Added for popover categories
import { cn } from '@/lib/utils'; // Added for popover categories


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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 p-4 md:p-6">
          {mainCategories.map((category) => {
            const subCategories = getSubCategories(category.id);
            return (
              <div key={category.id} className="py-2">
                <Link
                  href={`/products?category=${category.slug}`}
                  onClick={onLinkClick}
                  className="group font-semibold text-sm text-foreground hover:text-primary transition-colors flex items-center justify-between mb-2"
                >
                  <span>{category.name}</span>
                  {subCategories.length > 0 && <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                </Link>
                {subCategories.length > 0 && (
                  <ul className="space-y-1 pl-3 border-l border-border ml-1">
                    {subCategories.map((subCategory) => (
                      <li key={subCategory.id}>
                        <Link
                          href={`/products?category=${subCategory.slug}`}
                          onClick={onLinkClick}
                          className="block text-xs text-muted-foreground hover:text-primary transition-colors py-1"
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
  const allCategories = getAllCategories(); // Fetch categories

  return (
    <header className="bg-card shadow-md sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center gap-x-4 relative">

        {/* Left side: Logo and Desktop Catalog */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            TechShop
          </Link>

          {/* Desktop Catalog Trigger */}
          <div className="hidden md:block">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center text-foreground hover:text-primary transition-colors" aria-label="Каталог">
                  <List className="h-5 w-5 mr-2" />
                  <span>Каталог</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-screen max-w-5xl mt-1 p-0" align="start">
                 <PopoverCatalogDropdown categories={allCategories} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-grow justify-center mx-4 lg:mx-8 xl:mx-16">
           <SearchInput />
        </div>

        {/* Right side: Desktop Icons & Mobile Trigger */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Desktop Icons */}
          <nav className="hidden md:flex items-center space-x-3 sm:space-x-4 md:space-x-5">
            <Link href="/cart" className="flex flex-col items-center justify-center text-foreground hover:text-primary transition-colors relative px-1 py-0.5" aria-label="Корзина">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-0.5">Корзина</span>
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center justify-center text-foreground hover:text-primary transition-colors px-1 py-0.5" aria-label="Избранное">
              <Heart className="h-5 w-5" />
              <span className="text-xs mt-0.5">Избранное</span>
            </Link>
            <Link href="/login" className="flex flex-col items-center justify-center text-foreground hover:text-primary transition-colors px-1 py-0.5" aria-label="Вход">
              <User className="h-5 w-5" />
              <span className="text-xs mt-0.5">Вход</span>
            </Link>
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Открыть меню">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-0">
                {/* Mobile Menu Content */}
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
                        <CatalogDropdown onLinkClick={() => setIsMobileMenuOpen(false)} />
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
                        <Link href="/login" className="flex items-center text-foreground hover:text-primary transition-colors text-lg" aria-label="Вход" onClick={() => setIsMobileMenuOpen(false)}>
                          <User className="h-5 w-5 mr-3" />
                          <span>Вход</span>
                        </Link>
                      </nav>
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar (appears below header elements on small screens) */}
        <div className="md:hidden w-full mt-3 order-last">
           {/* <SearchInput /> */} {/* Decided against search here for cleaner mobile */}
        </div>

      </div>
    </header>
  );
}

