"use client";
import Link from 'next/link';
import { ShoppingCart, Home, List } from 'lucide-react';
import { useCart } from '@/contexts/CartProvider';
import { SearchInput } from '@/components/search/SearchInput';

export function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex flex-wrap justify-between items-center gap-y-3 gap-x-4">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors order-1">
          TechShop
        </Link>

        <div className="w-full md:w-auto order-3 md:order-2 flex-grow md:flex-grow-0 md:max-w-xs lg:max-w-sm xl:max-w-md">
          <SearchInput />
        </div>

        <nav className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 order-2 md:order-3">
          <Link href="/" className="flex items-center text-foreground hover:text-primary transition-colors" aria-label="Home">
            <Home className="h-5 w-5 md:mr-1" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link href="/products" className="flex items-center text-foreground hover:text-primary transition-colors" aria-label="Products">
            <List className="h-5 w-5 md:mr-1" />
            <span className="hidden md:inline">Products</span>
          </Link>
          <Link href="/cart" className="flex items-center text-foreground hover:text-primary transition-colors relative" aria-label="Shopping Cart">
            <ShoppingCart className="h-5 w-5 md:mr-1" />
            <span className="hidden md:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
