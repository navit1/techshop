
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
  sku?: string;
  brand?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
