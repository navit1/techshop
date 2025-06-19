
"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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

const reviewSchema = z.object({
  rating: z.number().min(1, "Пожалуйста, поставьте оценку.").max(5),
  comment: z.string().min(10, { message: "Отзыв должен содержать не менее 10 символов." }).max(1000, { message: "Отзыв не должен превышать 1000 символов." }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: (newReview: Review) => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = auth.currentUser;

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
        title: "Ошибка",
        description: "Вы должны быть авторизованы, чтобы оставить отзыв.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const newReviewData = {
        productId,
        userName: currentUser.displayName || currentUser.email || 'Анонимный пользователь',
        userId: currentUser.uid,
        rating: data.rating,
        comment: data.comment,
      };
      // Simulate API call delay if needed, but addReview is synchronous for now
      // await new Promise(resolve => setTimeout(resolve, 500)); 
      const submittedReview = addReview(newReviewData);
      
      onReviewSubmitted(submittedReview);
      toast({
        title: "Отзыв добавлен!",
        description: "Спасибо за ваш отзыв.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить отзыв. Пожалуйста, попробуйте еще раз.",
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
              <FormLabel>Ваша оценка</FormLabel>
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
              <FormLabel>Ваш отзыв</FormLabel>
              <FormControl>
                <Textarea placeholder="Напишите, что вы думаете о товаре..." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Отправка...' : 'Оставить отзыв'}
        </Button>
      </form>
    </Form>
  );
}
