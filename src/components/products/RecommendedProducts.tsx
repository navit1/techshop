
"use client";

import type { Product } from '@/types';
import { productRecommendations } from '@/ai/flows/product-recommendations';
import { getProductById } from '@/lib/data';
import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
// Removed: import { isGoogleAIPluginActive } from '@/ai/genkit'; 

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
      setIsLoading(true);
      setError(null);

      // Removed the check for isGoogleAIPluginActive. 
      // The try-catch block below will handle failures if the AI flow cannot execute.

      try {
        let history: string[] = [];
        if (typeof window !== 'undefined') {
          const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (storedHistory) {
            history = JSON.parse(storedHistory);
          }
        }
        
        const relevantHistory = currentProductId ? history.filter(id => id !== currentProductId) : history;
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
          setRecommendations(recommendedProductDetails.slice(0, 4));
        } else {
          setRecommendations([]);
        }
      } catch (e) {
        console.error("Failed to fetch recommendations:", e);
        setError("AI-рекомендации в данный момент недоступны. Убедитесь, что сервис настроен правильно, или попробуйте позже.");
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Вам также может понравиться</h2>
        <p className="text-destructive mt-4 p-4 bg-destructive/10 rounded-md">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't render the section if there are no recommendations and no error
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Вам также может понравиться</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
