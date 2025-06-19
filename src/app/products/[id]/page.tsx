
import { getProductById, getReviewsByProductId } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/products/StarRating';
import { ProductReviewManagement } from '@/components/products/ProductReviewManagement'; // Changed
import { AddToCartButton } from './AddToCartButton'; 
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tag, Package, ListChecks, TruckIcon, CreditCardIcon } from 'lucide-react';
import { getReviewNoun } from '@/lib/i18nUtils';

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

  // Initial reviews fetched on the server
  const initialReviews = getReviewsByProductId(product.id);
  const averageRating = initialReviews.length > 0 
    ? initialReviews.reduce((sum, review) => sum + review.rating, 0) / initialReviews.length
    : 0;

  return (
    <div className="space-y-12">
      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <div className="md:p-8">
             <div className="aspect-video bg-muted rounded-lg" data-ai-hint="product detail placeholder">
              {/* Placeholder for product image */}
            </div>
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <CardHeader className="p-0">
              <Badge variant="secondary" className="w-fit mb-2">{product.categoryName}</Badge>
              <CardTitle className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</CardTitle>
              {product.brand && <p className="text-sm text-muted-foreground">Бренд: {product.brand}</p>}
              <div className="flex items-center space-x-2 mt-2">
                <StarRating rating={averageRating} size="md" />
                <span className="text-sm text-muted-foreground">({initialReviews.length} {getReviewNoun(initialReviews.length)})</span>
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
            
            <div className="mt-auto pt-6 space-y-4">
               <AddToCartButton product={product} />
               <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center"><TruckIcon className="w-4 h-4 mr-2 text-primary/70" />Примерный срок доставки: 2-5 дней.</p>
                  <p className="flex items-center"><CreditCardIcon className="w-4 h-4 mr-2 text-primary/70" />Доступные способы оплаты: Kaspi, Visa, MasterCard.</p>
               </div>
            </div>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Reviews Section - managed by client component */}
      <ProductReviewManagement productId={product.id} initialReviews={initialReviews} />
      
      <Separator />

    </div>
  );
}
