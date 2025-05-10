
import type { Product, Category, Review } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Books', slug: 'books' },
  { id: '3', name: 'Clothing', slug: 'clothing' },
  { id: '4', name: 'Home & Kitchen', slug: 'home-kitchen' },
];

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immerse yourself in sound with these premium wireless headphones featuring active noise-cancellation and long battery life.',
    price: 199.99,
    imageUrl: 'https://picsum.photos/seed/headphones/600/400',
    categoryId: '1',
    categoryName: 'Electronics',
    stock: 50,
    features: ['Active Noise Cancellation', 'Bluetooth 5.0', '20-hour battery life', 'Comfortable earcups'],
    sku: 'EL-HP-001',
    brand: 'SoundWave',
  },
  {
    id: 'prod_2',
    name: 'The Great Gatsby - F. Scott Fitzgerald',
    description: 'A classic novel set in the Roaring Twenties, exploring themes of wealth, love, and the American Dream.',
    price: 12.50,
    imageUrl: 'https://picsum.photos/seed/gatsbybook/600/400',
    categoryId: '2',
    categoryName: 'Books',
    stock: 120,
    features: ['Paperback', '218 pages', 'Classic Literature'],
    sku: 'BK-CL-005',
    brand: 'Scribner',
  },
  {
    id: 'prod_3',
    name: 'Men\'s Classic Cotton T-Shirt',
    description: 'A comfortable and versatile t-shirt made from 100% premium cotton. Perfect for everyday wear.',
    price: 25.00,
    imageUrl: 'https://picsum.photos/seed/tshirtmen/600/400',
    categoryId: '3',
    categoryName: 'Clothing',
    stock: 200,
    features: ['100% Cotton', 'Regular Fit', 'Available in multiple colors'],
    sku: 'CL-MT-012',
    brand: 'UrbanStyle',
  },
  {
    id: 'prod_4',
    name: 'Stainless Steel Coffee Maker',
    description: 'Brew delicious coffee at home with this easy-to-use stainless steel coffee maker. Features a programmable timer.',
    price: 79.50,
    imageUrl: 'https://picsum.photos/seed/coffeemaker/600/400',
    categoryId: '4',
    categoryName: 'Home & Kitchen',
    stock: 75,
    features: ['12-cup capacity', 'Programmable timer', 'Keep warm function', 'Durable stainless steel'],
    sku: 'HK-CM-003',
    brand: 'HomeBrew',
  },
  {
    id: 'prod_5',
    name: 'Advanced Smartwatch',
    description: 'Track your fitness, receive notifications, and more with this sleek and powerful smartwatch.',
    price: 249.00,
    imageUrl: 'https://picsum.photos/seed/smartwatch/600/400',
    categoryId: '1',
    categoryName: 'Electronics',
    stock: 30,
    features: ['Heart rate monitor', 'GPS tracking', 'Water resistant', 'Customizable watch faces'],
    sku: 'EL-SW-002',
    brand: 'TechFit',
  },
  {
    id: 'prod_6',
    name: 'Organic Green Tea - 50 Bags',
    description: 'Enjoy a refreshing and healthy cup of organic green tea. Sourced from the finest tea leaves.',
    price: 9.99,
    imageUrl: 'https://picsum.photos/seed/greentea/600/400',
    categoryId: '4',
    categoryName: 'Home & Kitchen',
    stock: 150,
    features: ['USDA Organic', '50 tea bags', 'Rich in antioxidants'],
    sku: 'HK-GT-001',
    brand: 'PureLeaf',
  },
  {
    id: 'prod_7',
    name: 'Women\'s Lightweight Running Shoes',
    description: 'Experience comfort and performance with these lightweight running shoes, designed for speed and agility.',
    price: 89.95,
    imageUrl: 'https://picsum.photos/seed/runningshoes/600/400',
    categoryId: '3',
    categoryName: 'Clothing',
    stock: 90,
    features: ['Breathable mesh upper', 'Cushioned sole', 'Lightweight design'],
    sku: 'CL-WR-007',
    brand: 'FastStride',
  },
  {
    id: 'prod_8',
    name: '"Sapiens: A Brief History of Humankind" - Yuval Noah Harari',
    description: 'A thought-provoking exploration of human history, from the Stone Age to the present day.',
    price: 18.75,
    imageUrl: 'https://picsum.photos/seed/sapiensbook/600/400',
    categoryId: '2',
    categoryName: 'Books',
    stock: 80,
    features: ['Hardcover', '512 pages', 'International Bestseller'],
    sku: 'BK-NF-011',
    brand: 'Harper',
  }
];

export const reviews: Review[] = [
  {
    id: 'rev_1',
    productId: 'prod_1',
    userName: 'Alice Wonderland',
    rating: 5,
    comment: 'Absolutely love these headphones! The noise cancellation is top-notch and they are so comfortable.',
    date: '2023-10-15T10:00:00Z',
  },
  {
    id: 'rev_2',
    productId: 'prod_1',
    userName: 'Bob The Builder',
    rating: 4,
    comment: 'Great sound quality, but the battery could last a bit longer for my usage.',
    date: '2023-10-20T14:30:00Z',
  },
  {
    id: 'rev_3',
    productId: 'prod_2',
    userName: 'Charlie Brown',
    rating: 5,
    comment: 'A timeless classic. Beautifully written and thought-provoking.',
    date: '2023-09-05T09:15:00Z',
  },
  {
    id: 'rev_4',
    productId: 'prod_3',
    userName: 'Diana Prince',
    rating: 4,
    comment: 'Good quality t-shirt, fits well. Would buy again.',
    date: '2023-11-01T11:00:00Z',
  },
  {
    id: 'rev_5',
    productId: 'prod_4',
    userName: 'Edward Scissorhands',
    rating: 3,
    comment: 'Makes decent coffee, but the programming is a bit tricky.',
    date: '2023-08-25T16:45:00Z',
  },
  {
    id: 'rev_6',
    productId: 'prod_4',
    userName: 'Fiona Gallagher',
    rating: 5,
    comment: 'Love this coffee maker! Easy to use and clean. Makes my mornings better.',
    date: '2023-08-28T07:30:00Z',
  },
];

// Helper functions to get data
export const getProductById = (id: string): Product | undefined =>
  products.find(p => p.id === id);

export const getReviewsByProductId = (productId: string): Review[] =>
  reviews.filter(r => r.productId === productId);

export const getProductsByCategoryId = (categoryId: string): Product[] =>
  products.filter(p => p.categoryId === categoryId);

export const getAllProducts = (): Product[] => products;

export const getAllCategories = (): Category[] => categories;
