
"use client";
import Link from 'next/link';
import { ShoppingCart, List, Heart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartProvider';
import { SearchInput } from '@/components/search/SearchInput';

export function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row justify-between items-center md:gap-y-0 gap-y-3 gap-x-4 relative">
        {/* Mobile: Logo at the top */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            TechShop
          </Link>
        </div>
        {/* Mobile: Catalog and Search below logo */}
        {/* Desktop: Catalog to the left of Search */}
        <div className="flex items-center w-full md:w-auto gap-x-4 order-2 md:order-none">
          {/* Moved Catalog */}
          <Link href="/products" className="flex items-center text-foreground hover:text-primary transition-colors" aria-label="Каталог">
            <List className="h-5 w-5 md:mr-1" />
            <span>Каталог</span>
          </Link>
          <div className="w-full md:w-auto flex-grow md:flex-grow-0 md:max-w-xs lg:max-w-sm xl:max-w-md">
            <SearchInput />
          </div>
        </div>
        {/* Mobile: Other nav items at the bottom */}
        {/* Desktop: Other nav items to the right */}
        <nav className="flex items-center justify-center md:justify-end space-x-3 sm:space-x-4 md:space-x-6 w-full md:w-auto order-3 md:order-none mt-3 md:mt-0 md:flex-row">
          {/* Removed duplicate Главная link */}
          {/* Removed duplicate Товары link */}
          <Link href="/cart" className="flex items-center text-foreground hover:text-primary transition-colors relative md:flex-row" aria-label="Корзина">
            <ShoppingCart className="h-5 w-5 md:mr-1" />
            <span className="hidden md:inline">Корзина</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/wishlist" className="flex items-center text-foreground hover:text-primary transition-colors md:flex-row" aria-label="Избранное">
            <Heart className="h-5 w-5 md:mr-1" />
            <span className="hidden md:inline">Избранное</span>
          </Link>
          <Link href="/login" className="flex items-center text-foreground hover:text-primary transition-colors md:flex-row" aria-label="Вход">
            <User className="h-5 w-5 md:mr-1" />
            <span className="hidden md:inline">Вход</span>
          </Link>

          {/* This block is now handled by centering the parent div on mobile */}
          {/* Add other navigation links here if needed */}
        </nav>
      </div>
    </header>
  );
}
