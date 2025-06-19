
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string; // Добавлено для поддержки иерархии
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date string
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional field for a specific product image
  categoryId: string;
  categoryName?: string; // Denormalized for convenience
  stock: number;
  reviews?: Review[]; // Optional, can be fetched separately
  features?: string[];
  attributes?: Record<string, string | string[]>; // For specific filterable attributes like { "Цвет": "Черный", "RAM": "8GB" }
  brand?: string;
  sku?: string;
  dateAdded: string; // ISO date string for "Newness" sorting
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
}
