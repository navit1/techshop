import { notFound } from 'next/navigation'; // Keep if you use notFound for server-side checks
import { getAllProducts } from '@/lib/data'; // Assuming getAllProducts is a server-side function
import ProductDetailClient from '@/components/products/ProductDetailClient'; // Import the new client component
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state - can be simple skeleton here


// Add an async function generateStaticParams to fetch all product IDs for static export
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const allProducts = getAllProducts(); // Assuming getAllProducts returns an array of products with id

  return allProducts.map(product => ({
    id: product.id.toString(), // Return an array of objects with the 'id' parameter as string
  }));
}
function SearchResultGridSkeleton() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[150px] sm:h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </>
  );
}

type PageProps = {
  searchParams: Promise<any>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams; // Теперь params — объект с неизвестным типом
  const id = Array.isArray(params.id) 
    ? params.id[0] || "" 
    : params.id || ""; // Проверяем тип id

  return (
    <Suspense fallback={<SearchResultGridSkeleton />}>
      <ProductDetailClient id={id} />
    </Suspense>
  );
}
