
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { getAllProducts } from '@/lib/data';
import { RecommendedProducts } from '@/components/products/RecommendedProducts'; // For potential future use on homepage

export default function HomePage() {
  const featuredProducts = getAllProducts().slice(0, 4); // Get first 4 products as featured

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/70 via-primary/50 to-accent/50 text-primary-foreground py-20 px-6 rounded-lg shadow-xl overflow-hidden">
        {/* Removed background image div and Image component */}
        <div className="relative container mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Добро пожаловать в TechShop</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ваш главный поставщик новейшей и лучшей электроники. Откройте мир инноваций!
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/products">В магазин электроники</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">Рекомендуемая электроника</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* AI Recommendations can be added here if desired for the homepage */}
      {/* <RecommendedProducts /> */}
    </div>
  );
}

    
