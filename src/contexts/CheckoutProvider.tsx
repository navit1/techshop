
"use client";

import type { ShippingAddress, PaymentMethod, CheckoutData } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface CheckoutContextType {
  checkoutData: CheckoutData;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearCheckoutData: () => void;
  isInitialized: boolean;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

const CHECKOUT_DATA_STORAGE_KEY = 'checkoutData';

const initialCheckoutData: CheckoutData = {
  shippingAddress: null,
  paymentMethod: null,
};

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutData, setCheckoutDataState] = useState<CheckoutData>(initialCheckoutData);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(CHECKOUT_DATA_STORAGE_KEY);
      if (storedData) {
        setCheckoutDataState(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Error loading checkout data from localStorage:", error);
      setCheckoutDataState(initialCheckoutData);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CHECKOUT_DATA_STORAGE_KEY, JSON.stringify(checkoutData));
      } catch (error) {
        console.error("Error saving checkout data to localStorage:", error);
      }
    }
  }, [checkoutData, isInitialized]);

  const setShippingAddress = useCallback((address: ShippingAddress) => {
    setCheckoutDataState(prevData => ({ ...prevData, shippingAddress: address }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setCheckoutDataState(prevData => ({ ...prevData, paymentMethod: method }));
  }, []);

  const clearCheckoutData = useCallback(() => {
    setCheckoutDataState(initialCheckoutData);
    if (typeof window !== "undefined") {
        localStorage.removeItem(CHECKOUT_DATA_STORAGE_KEY);
    }
  }, []);

  return (
    <CheckoutContext.Provider value={{ 
        checkoutData, 
        setShippingAddress, 
        setPaymentMethod, 
        clearCheckoutData,
        isInitialized 
      }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
