
"use client";

import type { Product } from '@/types';
import { productRecommendations } from '@/ai/flows/product-recommendations';
import { getProductById } from '@/lib/data';
import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendedProductsProps {
  currentProductId?: string; // Optional: to exclude current product from recommendations
}

const MAX_HISTORY_ITEMS = 10;
const LOCAL_STORAGE_KEY = 'browsingHistory';

export function RecommendedProducts({ currentProductId }: RecommendedProductsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let history: string[] = [];
        if (typeof window !== 'undefined') {
          const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (storedHistory) {
            history = JSON.parse(storedHistory);
          }
        }
        
        // Filter out current product ID from history if provided
        const relevantHistory = currentProductId ? history.filter(id => id !== currentProductId) : history;

        if (relevantHistory.length === 0 && !currentProductId) { // If no history and no current product to base on, show nothing or popular
            setRecommendations([]);
            setIsLoading(false);
            return;
        }
        
        // Use current product ID as part of history if history is empty
        const inputHistory = relevantHistory.length > 0 ? relevantHistory : (currentProductId ? [currentProductId] : []);


        if (inputHistory.length === 0) {
            setRecommendations([]);
            setIsLoading(false);
            return;
        }
        
        const result = await productRecommendations({ browsingHistory: inputHistory });
        
        if (result && result.recommendedProducts) {
          const recommendedProductDetails = result.recommendedProducts
            .map(id => getProductById(id))
            .filter(p => p !== undefined && p.id !== currentProductId) as Product[];
          setRecommendations(recommendedProductDetails.slice(0, 4)); // Show up to 4 recommendations
        } else {
          setRecommendations([]);
        }
      } catch (e) {
        console.error("Failed to fetch recommendations:", e);
        setError("Не удалось загрузить рекомендации в данный момент.");
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId]);

  const updateBrowsingHistory = (productId: string) => {
    if (typeof window !== 'undefined') {
      let history: string[] = [];
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        history = JSON.parse(storedHistory);
      }
      // Add to front, remove duplicates, and limit size
      history = [productId, ...history.filter(id => id !== productId)].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    }
  };

  useEffect(() => {
    if (currentProductId) {
      updateBrowsingHistory(currentProductId);
    }
  }, [currentProductId]);


  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Вам также может понравиться</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[150px] sm:h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive mt-4">{error}</p>;
  }

  if (recommendations.length === 0) {
    return null; // Don't show section if no recommendations
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Вам также может понравиться</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
