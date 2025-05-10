
import Image from 'next/image';
import { getProductById, getReviewsByProductId } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/products/StarRating';
import { ReviewItem } from '@/components/products/ReviewItem';
import { RecommendedProducts } from '@/components/products/RecommendedProducts';
import { AddToCartButton } from './AddToCartButton'; // Client component for adding to cart
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tag, Info, Package, ListChecks } from 'lucide-react';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  
  if (!product) {
    notFound();
  }

  const reviews = getReviewsByProductId(product.id);
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-12">
      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-square md:aspect-auto min-h-[300px] md:min-h-[500px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              data-ai-hint={`${product.categoryName?.toLowerCase() || 'product detail'} image`}
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <CardHeader className="p-0">
              <Badge variant="secondary" className="w-fit mb-2">{product.categoryName}</Badge>
              <CardTitle className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</CardTitle>
              {product.brand && <p className="text-sm text-muted-foreground">Brand: {product.brand}</p>}
              <div className="flex items-center space-x-2 mt-2">
                <StarRating rating={averageRating} />
                <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
              </div>
            </CardHeader>

            <CardContent className="p-0 mt-6 flex-grow">
              <p className="text-3xl font-extrabold text-primary mb-4">${product.price.toFixed(2)}</p>
              <CardDescription className="text-base text-foreground/80 leading-relaxed">
                {product.description}
              </CardDescription>
              
              {product.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center"><ListChecks className="w-5 h-5 mr-2 text-primary" />Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 text-sm text-muted-foreground space-y-1">
                {product.sku && <p className="flex items-center"><Tag className="w-4 h-4 mr-2 text-primary/70" />SKU: {product.sku}</p>}
                <p className="flex items-center"><Package className="w-4 h-4 mr-2 text-primary/70" />Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}</p>
              </div>

            </CardContent>
            
            <div className="mt-auto pt-6">
               <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Reviews Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Customer Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet for this product. Be the first to write one!</p>
        )}
      </section>
      
      <Separator />

      {/* AI Recommended Products */}
      <RecommendedProducts currentProductId={product.id} />
    </div>
  );
}
