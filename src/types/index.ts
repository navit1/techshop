
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string; // Добавлено для поддержки иерархии
}

export interface Review {
  id: string;
  productId: string;
  userId?: string; // Firebase User ID, optional for now
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
  // reviews?: Review[]; // Reviews will be fetched or managed separately
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

// Defines the structure of an item within an order
export interface OrderItem {
  productId: string;
  name: string;
  price: number; // Price at the time of order
  quantity: number;
  imageUrl?: string;
}

// Defines the structure of an order
export interface Order {
  id: string; // Unique order ID
  firebaseUserId?: string; // ID of the Firebase user who placed the order (optional for prototype)
  date: string; // ISO date string of when the order was placed
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Order status
}
