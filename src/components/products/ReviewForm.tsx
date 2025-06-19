
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StarRating } from './StarRating';
import { useToast } from '@/hooks/use-toast';
import { addReview } from '@/lib/data';
import type { Review } from '@/types';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider'; // Import useLanguage

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: (newReview: Review) => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = auth.currentUser;
  const { translate } = useLanguage(); // Get translate function

  const reviewSchema = z.object({
    rating: z.number().min(1, translate('reviews.rating_required')).max(5),
    comment: z.string()
      .min(10, { message: translate('reviews.comment_min_length') })
      .max(1000, { message: translate('reviews.comment_max_length') }),
  });

  type ReviewFormValues = z.infer<typeof reviewSchema>;

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!currentUser) {
      toast({
        title: translate('reviews.toast_error_title'),
        description: translate('reviews.toast_auth_error_desc'),
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const newReviewData = {
        productId,
        userName: currentUser.displayName || currentUser.email || translate('user.anonymous', {defaultValue: 'Anonymous User'}),
        userId: currentUser.uid,
        rating: data.rating,
        comment: data.comment,
      };
      const submittedReview = addReview(newReviewData);
      
      onReviewSubmitted(submittedReview);
      toast({
        title: translate('reviews.toast_submitted_title'),
        description: translate('reviews.toast_submitted_desc'),
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: translate('reviews.toast_error_title'),
        description: translate('reviews.toast_error_desc'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('reviews.your_rating_label')}</FormLabel>
              <FormControl>
                <StarRating 
                  rating={field.value} 
                  onRatingChange={field.onChange} 
                  interactive 
                  size="lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('reviews.your_comment_label')}</FormLabel>
              <FormControl>
                <Textarea placeholder={translate('reviews.comment_placeholder')} {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? translate('reviews.submitting_button') : translate('reviews.submit_button')}
        </Button>
      </form>
    </Form>
  );
}
