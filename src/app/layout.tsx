
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartProvider';
import { WishlistProvider } from '@/contexts/WishlistProvider';
import { CheckoutProvider } from '@/contexts/CheckoutProvider';
import { OrderProvider } from '@/contexts/OrderProvider';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageProvider'; // Added LanguageProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata can also be made dynamic based on language later if needed
export const metadata: Metadata = {
  title: 'TechShop - Your Modern Electronics Store', // Default title, can be overridden by pages
  description: 'Discover the latest gadgets, electronics, and accessories at TechShop. Quality products at great prices.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The lang attribute will be set by LanguageProvider on the client side
  return (
    <html lang="ru"> {/* Default lang, will be updated by client-side LanguageProvider */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <LanguageProvider>
          <WishlistProvider>
            <CartProvider>
              <CheckoutProvider>
                <OrderProvider>
                  <Header />
                  <main className="flex-grow container mx-auto px-4 py-8">
                    {children}
                  </main>
                  <Footer />
                  <Toaster />
                </OrderProvider>
              </CheckoutProvider>
            </CartProvider>
          </WishlistProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
