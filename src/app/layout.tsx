
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartProvider';
import { WishlistProvider } from '@/contexts/WishlistProvider';
import { CheckoutProvider } from '@/contexts/CheckoutProvider'; // Added
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TechShop - Ваш магазин современной электроники',
  description: 'Откройте для себя новейшие гаджеты, электронику и аксессуары в TechShop. Качественные товары по отличным ценам.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <WishlistProvider>
          <CartProvider>
            <CheckoutProvider> {/* Added CheckoutProvider */}
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
              <Toaster />
            </CheckoutProvider> {/* Added CheckoutProvider */}
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
