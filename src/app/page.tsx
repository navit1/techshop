
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
        <div className="absolute inset-0">
           <Image 
            src="https://picsum.photos/seed/techhero/1200/400" 
            alt="Modern electronics on a sleek background" 
            fill
            priority
            className="object-cover opacity-30"
            data-ai-hint="electronics store"
          />
        </div>
        <div className="relative container mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Welcome to TechShop</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your ultimate destination for the latest and greatest in electronics. Explore a world of innovation!
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/products">Shop Electronics</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">Featured Electronics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Call to Action / Promotions (Optional) */}
      <section className="bg-card p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-primary mb-3">Hot Tech Deals This Week!</h3>
          <p className="text-muted-foreground mb-6">
            Don&apos;t miss out on exclusive offers on top electronic gadgets. Limited time only.
          </p>
          <Button asChild variant="outline">
            <Link href="/products?filter=sale">View Tech Deals</Link>
          </Button>
        </div>
      </section>
      
      {/* AI Recommendations can be added here if desired for the homepage */}
      {/* <RecommendedProducts /> */}
    </div>
  );
}

    