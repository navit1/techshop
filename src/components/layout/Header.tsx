
"use client";
import Link from 'next/link';
import { ShoppingCart, Home, List } from 'lucide-react';
import { useCart } from '@/contexts/CartProvider'; // Will create this next

export function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          TechShop
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="flex items-center text-foreground hover:text-primary transition-colors">
            <Home className="h-5 w-5 mr-1" />
            Home
          </Link>
          <Link href="/products" className="flex items-center text-foreground hover:text-primary transition-colors">
            <List className="h-5 w-5 mr-1" />
            Products
          </Link>
          <Link href="/cart" className="flex items-center text-foreground hover:text-primary transition-colors relative">
            <ShoppingCart className="h-5 w-5 mr-1" />
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

    