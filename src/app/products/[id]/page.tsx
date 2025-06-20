
import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/data';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const allProducts = getAllProducts();
  return allProducts.map(product => ({
    id: product.id.toString(),
  }));
}

function ProductDetailSkeleton() {
  return (
    <div className="space-y-12">
        <Card className="overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-0 md:gap-8">
            <div className="md:p-8">
              <Skeleton className="aspect-video bg-muted rounded-lg w-full h-[300px] md:h-[400px]" />
            </div>
            <div className="p-6 md:p-8 flex flex-col">
              <Skeleton className="h-6 w-1/4 mb-2" /> {/* Badge */}
              <Skeleton className="h-10 w-3/4 mb-2" /> {/* Title */}
              <Skeleton className="h-4 w-1/2 mb-4" /> {/* Brand & Rating */}
              <Skeleton className="h-8 w-1/3 mb-4" /> {/* Price */}
              <Skeleton className="h-20 w-full mb-6" /> {/* Description */}
              <Skeleton className="h-10 w-full" /> {/* Add to cart button area */}
            </div>
          </div>
        </Card>
        <div className="space-y-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      </div>
  );
}

// Props for the page component, expecting `id` from dynamic route segment
interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = params.id;

  if (!id) {
    // This case should ideally be handled by Next.js routing if id is missing
    // or you can explicitly call notFound()
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient id={id} />
    </Suspense>
  );
}

// Re-add Card import needed for ProductDetailSkeleton
import { Card } from '@/components/ui/card';
