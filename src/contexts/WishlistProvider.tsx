
"use client";

import type { Product } from '@/types';
import { getProductById } from '@/lib/data';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface WishlistContextType {
  wishlistProductIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;
  wishlistItems: Product[]; // Derived from productIds
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'wishlistItems';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) {
        setWishlistProductIds(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Error parsing wishlist from localStorage:", error);
      setWishlistProductIds([]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistProductIds));
    }
  }, [wishlistProductIds, isMounted]);

  const addToWishlist = useCallback((productId: string) => {
    setWishlistProductIds(prevIds => {
      if (!prevIds.includes(productId)) {
        return [...prevIds, productId];
      }
      return prevIds;
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistProductIds(prevIds => prevIds.filter(id => id !== productId));
  }, []);

  const isProductInWishlist = useCallback((productId: string) => {
    return wishlistProductIds.includes(productId);
  }, [wishlistProductIds]);

  const wishlistItems = React.useMemo(() => {
    return wishlistProductIds
      .map(id => getProductById(id))
      .filter(product => product !== undefined) as Product[];
  }, [wishlistProductIds]);

  const itemCount = wishlistProductIds.length;

  return (
    <WishlistContext.Provider value={{ 
        wishlistProductIds, 
        addToWishlist, 
        removeFromWishlist, 
        isProductInWishlist, 
        wishlistItems,
        itemCount 
      }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
