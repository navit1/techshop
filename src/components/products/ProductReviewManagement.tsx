
"use client";

import { useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useOrder } from '@/contexts/OrderProvider';
import type { Review } from '@/types';
import { ReviewItem } from './ReviewItem';
import { ReviewForm } from './ReviewForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getReviewNoun } from '@/lib/i18nUtils';
import { MessageSquareText, UserCheck } from 'lucide-react';

interface ProductReviewManagementProps {
  productId: string;
  initialReviews: Review[];
}

export function ProductReviewManagement({ productId, initialReviews }: ProductReviewManagementProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { getOrdersByCurrentUser } = useOrder();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const userHasPurchasedProduct = useMemo(() => {
    if (!currentUser) return false;
    const userOrders = getOrdersByCurrentUser();
    return userOrders.some(order => 
      order.items.some(item => item.productId === productId)
    );
  }, [currentUser, getOrdersByCurrentUser, productId]);

  const userHasAlreadyReviewed = useMemo(() => {
    if (!currentUser) return false;
    return reviews.some(review => review.userId === currentUser.uid && review.productId === productId);
  }, [currentUser, reviews, productId]);

  const handleReviewSubmitted = (newReview: Review) => {
    // Add to the beginning to show newest first, matching getReviewsByProductId sort order
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;


  const renderReviewFormSection = () => {
    if (isLoadingAuth) {
      return <p className="text-sm text-muted-foreground">Проверка статуса авторизации...</p>;
    }

    if (!currentUser) {
      return (
        <Card className="mt-6 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><MessageSquareText className="w-5 h-5 mr-2 text-primary"/>Хотите оставить отзыв?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              <Link href="/login" className="text-primary hover:underline font-semibold">Войдите</Link> или <Link href="/register" className="text-primary hover:underline font-semibold">зарегистрируйтесь</Link>, чтобы поделиться своим мнением о товаре.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (!userHasPurchasedProduct) {
      return (
        <Card className="mt-6 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><MessageSquareText className="w-5 h-5 mr-2 text-primary"/>Поделитесь мнением</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Вы сможете оставить отзыв на этот товар после его покупки.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (userHasAlreadyReviewed) {
      return (
        <Card className="mt-6 bg-green-50 border border-green-200">
           <CardHeader>
            <CardTitle className="text-lg flex items-center text-green-700"><UserCheck className="w-5 h-5 mr-2"/>Спасибо за ваш отзыв!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">Вы уже оставили отзыв на этот товар.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Оставить отзыв</CardTitle>
          <CardDescription>Поделитесь своим мнением о товаре с другими покупателями.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-1 text-foreground">Отзывы покупателей ({reviews.length} {getReviewNoun(reviews.length)})</h2>
        {reviews.length > 0 && (
             <p className="text-sm text-muted-foreground">Средняя оценка: {averageRating.toFixed(1)} из 5</p>
        )}
       
        {reviews.length > 0 ? (
          <div className="space-y-6 mt-6">
            {reviews.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mt-6">Отзывов на этот товар пока нет.</p>
        )}
      </div>
      
      {renderReviewFormSection()}
    </section>
  );
}
