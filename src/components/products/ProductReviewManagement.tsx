
"use client";

import { useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useOrder } from '@/contexts/OrderProvider';
import type { Review } from '@/types';
import { ReviewItem } from './ReviewItem';
import { ReviewForm } from './ReviewForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MessageSquareText, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider'; 

interface ProductReviewManagementProps {
  productId: string;
  initialReviews: Review[];
}

export function ProductReviewManagement({ productId, initialReviews }: ProductReviewManagementProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { getOrdersByCurrentUser } = useOrder();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const { translate } = useLanguage(); 

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
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const reviewNoun = translate('noun.review', { count: reviews.length });

  const renderReviewFormSection = () => {
    if (isLoadingAuth) {
      return <p className="text-sm text-muted-foreground">{translate('reviews.loading_auth_status')}</p>;
    }

    if (!currentUser) {
      return (
        <Card className="mt-6 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><MessageSquareText className="w-5 h-5 mr-2 text-primary"/>{translate('reviews.login_prompt_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              {translate('reviews.login_prompt_text_before_links')}
              <Link href="/login" className="text-primary hover:underline font-semibold">{translate('reviews.login_prompt_login_link')}</Link>
              {translate('reviews.login_prompt_text_between_links')}
              <Link href="/register" className="text-primary hover:underline font-semibold">{translate('reviews.login_prompt_register_link')}</Link>
              {translate('reviews.login_prompt_text_after_links')}
            </p>
          </CardContent>
        </Card>
      );
    }

    if (!userHasPurchasedProduct) {
      return (
        <Card className="mt-6 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><MessageSquareText className="w-5 h-5 mr-2 text-primary"/>{translate('reviews.purchase_required_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {translate('reviews.purchase_required_text')}
            </p>
          </CardContent>
        </Card>
      );
    }

    if (userHasAlreadyReviewed) {
      return (
        <Card className="mt-6 bg-green-50 border border-green-200">
           <CardHeader>
            <CardTitle className="text-lg flex items-center text-green-700"><UserCheck className="w-5 h-5 mr-2"/>{translate('reviews.already_reviewed_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">{translate('reviews.already_reviewed_text')}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">{translate('reviews.leave_review_title')}</CardTitle>
          <CardDescription>{translate('reviews.leave_review_description')}</CardDescription>
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
        <h2 className="text-2xl font-semibold mb-1 text-foreground">{translate('reviews.title', { count: reviews.length, noun: reviewNoun })}</h2>
        {reviews.length > 0 && (
             <p className="text-sm text-muted-foreground">{translate('reviews.average_rating', { rating: averageRating.toFixed(1) })}</p>
        )}
       
        {reviews.length > 0 ? (
          <div className="space-y-6 mt-6">
            {reviews.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mt-6">{translate('reviews.no_reviews')}</p>
        )}
      </div>
      
      {renderReviewFormSection()}
    </section>
  );
}
