
"use client";
import * as React from "react"; // Added import for React
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  starClassName?: string;
  onRatingChange?: (rating: number) => void; // For interactive rating
  interactive?: boolean; // To enable hover and click effects
  size?: 'sm' | 'md' | 'lg'; // Optional size prop
}

const starSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({ 
  rating, 
  maxRating = 5, 
  className, 
  starClassName,
  onRatingChange,
  interactive = false,
  size = 'md' 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleStarClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const handleStarHover = (index: number) => {
    if (interactive) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const currentDisplayRating = hoverRating > 0 ? hoverRating : rating;
  const baseStarSize = starSizeClasses[size] || starSizeClasses.md;

  return (
    <div 
      className={cn("flex items-center space-x-1", interactive && "cursor-pointer", className)}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={cn(
              baseStarSize,
              starValue <= currentDisplayRating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground",
              interactive && starValue <= hoverRating && "transform scale-110 transition-transform",
              starClassName
            )}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarHover(index)}
          />
        );
      })}
    </div>
  );
}

