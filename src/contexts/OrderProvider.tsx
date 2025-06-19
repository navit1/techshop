
"use client";

import type { Order, OrderItem, ShippingAddress, PaymentMethod, CartItem } from '@/types';
import { auth } from '@/lib/firebase'; // Import Firebase auth instance
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface OrderContextType {
  orders: Order[];
  addOrder: (
    items: CartItem[], 
    totalPrice: number, 
    shippingAddress: ShippingAddress, 
    paymentMethod: PaymentMethod
  ) => string; // Returns the new order ID
  getOrdersByCurrentUser: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'techshop_orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (error) {
      console.error("Error loading orders from localStorage:", error);
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch (error) {
        console.error("Error saving orders to localStorage:", error);
      }
    }
  }, [orders, isMounted]);

  const addOrder = useCallback((
    cartItems: CartItem[],
    totalPrice: number,
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod
  ): string => {
    const currentUser = auth.currentUser;
    const newOrderId = `TECHSHOP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    const orderItems: OrderItem[] = cartItems.map(cartItem => ({
      productId: cartItem.id,
      name: cartItem.name,
      price: cartItem.price, // Price at the time of order
      quantity: cartItem.quantity,
      imageUrl: cartItem.imageUrl,
    }));

    const newOrder: Order = {
      id: newOrderId,
      firebaseUserId: currentUser?.uid, // Store user ID if available
      date: new Date().toISOString(),
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'pending', // Initial status
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]); // Add to the beginning of the list
    return newOrderId;
  }, []);
  
  const getOrdersByCurrentUser = useCallback((): Order[] => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return []; // No user logged in, no orders to show for them
    }
    // For this prototype, we filter client-side. In a real app, this would be a backend query.
    // This filter assumes firebaseUserId was stored. If not, it might show all orders or none.
    return orders.filter(order => order.firebaseUserId === currentUser.uid)
                 .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);


  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrdersByCurrentUser }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
