
"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { getAllProducts, getProductById } from '@/lib/data';
import type { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, ShieldCheck, Sparkles, Smartphone, Gift, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';

export default function HomePage() {
  const { translate } = useLanguage();
  const allProducts = getAllProducts();

  // Removed modifyProductIfTargetCategory function and its usage
  // Category display is now handled consistently by ProductCard via translations

  const featuredProducts = allProducts.slice(0, 4);
  const newArrivals = allProducts.slice(-4).reverse();
  const specialOfferProduct1 = getProductById('prod_el_2');

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/70 via-primary/50 to-accent/50 text-primary-foreground py-20 px-6 rounded-lg shadow-xl overflow-hidden">
        <div className="relative container mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">{translate('homepage.hero_title')}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {translate('homepage.hero_subtitle')}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/products">{translate('homepage.hero_button')}</Link>
          </Button>
        </div>
      </section>

      {/* About Us & USPs Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">{translate('homepage.about_title')}</h2>
        <Card className="shadow-lg border-border bg-card">
          <CardContent className="p-6 md:p-8 text-center">
            <p className="text-lg text-card-foreground/90 mb-8 max-w-3xl mx-auto">
              {translate('homepage.about_text')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-left">
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-background">
                <Truck className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{translate('homepage.usp_delivery_title')}</h3>
                  <p className="text-sm text-muted-foreground">{translate('homepage.usp_delivery_text')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-background">
                <ShieldCheck className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{translate('homepage.usp_quality_title')}</h3>
                  <p className="text-sm text-muted-foreground">{translate('homepage.usp_quality_text')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-background">
                <Sparkles className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{translate('homepage.usp_exclusive_title')}</h3>
                  <p className="text-sm text-muted-foreground">{translate('homepage.usp_exclusive_text')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">{translate('homepage.featured_title')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">{translate('homepage.new_arrivals_title')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
         <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/products">{translate('homepage.view_all_new_arrivals_button')} <ShoppingBag className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Special Offers / Promotional Banners Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">{translate('homepage.special_offers_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Smartphone Sale */}
          <Link href="/products?category=smartphones" className="block group">
            <Card className="bg-primary/10 hover:bg-primary/20 transition-all duration-300 shadow-lg overflow-hidden h-full">
              <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full">
                <Smartphone className="h-16 w-16 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-primary mb-2">{translate('homepage.promo_smartphones_title')}</h3>
                <p className="text-foreground/80 mb-4 flex-grow">{translate('homepage.promo_smartphones_text')}</p>
                <Button variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-auto">
                  {translate('homepage.promo_smartphones_button')}
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Banner 2: Specific Product Offer */}
          {specialOfferProduct1 && (
            <Link href={`/products/${specialOfferProduct1.id}`} className="block group">
              <Card className="bg-accent/10 hover:bg-accent/20 transition-all duration-300 shadow-lg overflow-hidden h-full">
                <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full">
                  <Gift className="h-16 w-16 text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-accent mb-2">{translate('homepage.promo_hot_deal_title')}</h3>
                  <p className="text-foreground/80 mb-2 flex-grow">{specialOfferProduct1.name}</p>
                  <p className="text-lg font-semibold text-accent mb-4">{translate('homepage.promo_hot_deal_price_prefix')} ₸{specialOfferProduct1.price.toFixed(2)}</p>
                  <Button variant="outline" className="bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground mt-auto">
                    {translate('homepage.promo_hot_deal_button')}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
