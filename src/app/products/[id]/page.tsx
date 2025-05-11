
import { getProductById, getReviewsByProductId } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/products/StarRating';
import { ReviewItem } from '@/components/products/ReviewItem';
import { RecommendedProducts } from '@/components/products/RecommendedProducts';
import { AddToCartButton } from './AddToCartButton'; // Client component for adding to cart
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tag, Package, ListChecks } from 'lucide-react';
import { getReviewNoun } from '@/lib/i18nUtils';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) {
    return { title: 'Товар не найден' };
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

  const imageSrc = product.imageUrl ? product.imageUrl : `https://picsum.photos/seed/${product.id}/600/600`;
  const imageHint = product.imageUrl && product.id === 'prod_el_9' ? "iphone pro" : "product detail";

  return (
    <div className="space-y-12">
      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <div className="aspect-square md:aspect-auto bg-muted relative min-h-[300px] md:min-h-0">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              priority
              className="object-cover"
              data-ai-hint={imageHint}
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <CardHeader className="p-0">
              <Badge variant="secondary" className="w-fit mb-2">{product.categoryName}</Badge>
              <CardTitle className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</CardTitle>
              {product.brand && <p className="text-sm text-muted-foreground">Бренд: {product.brand}</p>}
              <div className="flex items-center space-x-2 mt-2">
                <StarRating rating={averageRating} />
                <span className="text-sm text-muted-foreground">({reviews.length} {getReviewNoun(reviews.length)})</span>
              </div>
            </CardHeader>

            <CardContent className="p-0 mt-6 flex-grow">
              <p className="text-3xl font-extrabold text-primary mb-4">₸{product.price.toFixed(2)}</p>
              <CardDescription className="text-base text-foreground/80 leading-relaxed">
                {product.description}
              </CardDescription>
              
              {product.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center"><ListChecks className="w-5 h-5 mr-2 text-primary" />Характеристики</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 text-sm text-muted-foreground space-y-1">
                {product.sku && <p className="flex items-center"><Tag className="w-4 h-4 mr-2 text-primary/70" />Артикул: {product.sku}</p>}
                <p className="flex items-center"><Package className="w-4 h-4 mr-2 text-primary/70" />Наличие: {product.stock > 0 ? `${product.stock} доступно` : 'Нет в наличии'}</p>
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
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Отзывы покупателей</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Отзывов на этот товар пока нет. Будьте первым!</p>
        )}
      </section>
      
      <Separator />

      {/* AI Recommended Products */}
      <RecommendedProducts currentProductId={product.id} />
    </div>
  );
}
