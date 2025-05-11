
"use client";

import type { Product } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define CartItem based on the updated Product type
// imageUrl is now optional on Product, so CartItem will also have imageUrl?: string
export interface CartItem extends Omit<Product, 'reviews'> { 
  quantity: number;
}


interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reviews, ...productDetails } = product; 
      // productDetails will now include imageUrl if present on product
      return [...prevCart, { ...productDetails, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) } // Ensure quantity is not negative or over stock
          : item
      ).filter(item => item.quantity > 0) // Remove if quantity becomes 0
    );
  };

  const clearCart = () => {
    setCart([]);
  };
  
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
