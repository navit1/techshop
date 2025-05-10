
import type { Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const userInitial = review.userName?.[0]?.toUpperCase() || 'U';
  return (
    <Card className="mb-4 bg-secondary/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=random`} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-md font-semibold">{review.userName}</CardTitle>
          </div>
          <StarRating rating={review.rating} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-1">
          {new Date(review.date).toLocaleDateString()}
        </p>
        <p className="text-foreground">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
