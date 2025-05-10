
import type { Product, Category, Review } from '@/types';

export const categories: Category[] = [
  { id: 'cat_el_1', name: 'Smartphones & Accessories', slug: 'smartphones-accessories' },
  { id: 'cat_el_2', name: 'Laptops & Computers', slug: 'laptops-computers' },
  { id: 'cat_el_3', name: 'Audio & Headphones', slug: 'audio-headphones' },
  { id: 'cat_el_4', name: 'Cameras & Drones', slug: 'cameras-drones' },
  { id: 'cat_el_5', name: 'Gaming Consoles & Accessories', slug: 'gaming' },
  { id: 'cat_el_6', name: 'Wearable Technology', slug: 'wearables' },
  { id: 'cat_el_7', name: 'Smart Home Devices', slug: 'smart-home' },
];

export const products: Product[] = [
  {
    id: 'prod_el_1',
    name: 'AuraBeat Pro Wireless Headphones',
    description: 'Immerse yourself in pure audio bliss with AuraBeat Pro. Features active noise-cancellation, 30-hour battery life, and ultra-soft earcups for maximum comfort.',
    price: 249.99,
    imageUrl: 'https://picsum.photos/seed/auraheadphones/600/400',
    categoryId: 'cat_el_3',
    categoryName: 'Audio & Headphones',
    stock: 50,
    features: ['Active Noise Cancellation', 'Bluetooth 5.2', '30-hour battery life', 'Comfort-fit earcups', 'Crystal-clear microphone'],
    sku: 'AU-HP-789',
    brand: 'AuraAudio',
  },
  {
    id: 'prod_el_2',
    name: 'NovaPhone X2 Ultra Smartphone',
    description: 'Experience the future with NovaPhone X2 Ultra. Stunning 120Hz AMOLED display, powerful new-gen processor, and a revolutionary 108MP camera system.',
    price: 999.00,
    imageUrl: 'https://picsum.photos/seed/novaphone/600/400',
    categoryId: 'cat_el_1',
    categoryName: 'Smartphones & Accessories',
    stock: 35,
    features: ['6.8" 120Hz AMOLED Display', '12GB RAM', '256GB Storage', '108MP Triple Camera', '5G Connectivity'],
    sku: 'SM-NP-X2U',
    brand: 'NovaTech',
  },
  {
    id: 'prod_el_3',
    name: 'ZenithBook Air 14" Laptop',
    description: 'Ultra-portable and powerful, the ZenithBook Air is perfect for professionals and creatives on the go. Feather-light design with all-day battery life.',
    price: 1299.50,
    imageUrl: 'https://picsum.photos/seed/zenithbook/600/400',
    categoryId: 'cat_el_2',
    categoryName: 'Laptops & Computers',
    stock: 25,
    features: ['14" QHD+ Display', 'Latest Gen Intel Core i7', '16GB RAM', '1TB NVMe SSD', 'Backlit Keyboard', 'Thunderbolt 4'],
    sku: 'LT-ZB-A14',
    brand: 'ZenithComputers',
  },
  {
    id: 'prod_el_4',
    name: 'SkyHawk Pro Drone',
    description: 'Capture breathtaking aerial footage with the SkyHawk Pro Drone. Features 4K HDR video, 3-axis gimbal stabilization, and intelligent flight modes.',
    price: 799.00,
    imageUrl: 'https://picsum.photos/seed/skyhawkdrone/600/400',
    categoryId: 'cat_el_4',
    categoryName: 'Cameras & Drones',
    stock: 40,
    features: ['4K HDR Video @ 60fps', '30-min Flight Time', '5-mile Range', 'Obstacle Avoidance', 'Foldable Design'],
    sku: 'DR-SH-P4K',
    brand: 'AeroVision',
  },
  {
    id: 'prod_el_5',
    name: 'Vortex G1 Gaming Console',
    description: 'Enter the next generation of gaming with the Vortex G1. Experience lightning-fast load times, stunning 4K graphics, and a vast library of exclusive titles.',
    price: 499.99,
    imageUrl: 'https://picsum.photos/seed/vortexconsole/600/400',
    categoryId: 'cat_el_5',
    categoryName: 'Gaming Consoles & Accessories',
    stock: 60,
    features: ['8K Output Support', 'Custom NVMe SSD', 'Ray Tracing Technology', 'Backward Compatibility', 'Haptic Feedback Controller'],
    sku: 'GM-VG-001',
    brand: 'QuantumPlay',
  },
  {
    id: 'prod_el_6',
    name: 'ChronoFit Active Smartwatch',
    description: 'Stay connected and track your fitness goals with the ChronoFit Active. ECG, SpO2 monitoring, built-in GPS, and a vibrant always-on display.',
    price: 329.00,
    imageUrl: 'https://picsum.photos/seed/chronofitwatch/600/400',
    categoryId: 'cat_el_6',
    categoryName: 'Wearable Technology',
    stock: 70,
    features: ['ECG & SpO2 Monitor', 'Built-in GPS', 'Water Resistant (5ATM)', '1.4" AMOLED Display', '7-Day Battery Life'],
    sku: 'WT-CF-A05',
    brand: 'ChronoWear',
  },
  {
    id: 'prod_el_7',
    name: 'AuraHome Smart Hub Pro',
    description: 'Control your smart home devices with ease using the AuraHome Smart Hub Pro. Compatible with Zigbee, Z-Wave, and Wi-Fi devices.',
    price: 129.99,
    imageUrl: 'https://picsum.photos/seed/aurahomehub/600/400',
    categoryId: 'cat_el_7',
    categoryName: 'Smart Home Devices',
    stock: 55,
    features: ['Multi-protocol support', 'Voice assistant integration', 'Customizable automation scenes', 'Secure local control'],
    sku: 'SH-AH-PRO',
    brand: 'AuraHome',
  },
  {
    id: 'prod_el_8',
    name: 'StealthStrike Pro Gaming Mouse',
    description: 'Dominate the competition with the StealthStrike Pro Gaming Mouse. Ultra-lightweight design, 20K DPI optical sensor, and customizable RGB lighting.',
    price: 69.95,
    imageUrl: 'https://picsum.photos/seed/gamingmouse/600/400',
    categoryId: 'cat_el_5',
    categoryName: 'Gaming Consoles & Accessories',
    stock: 90,
    features: ['20,000 DPI Optical Sensor', 'Lightweight 60g Design', '8 Programmable Buttons', 'Customizable RGB Lighting'],
    sku: 'GM-MS-SSP',
    brand: 'RaptorGaming',
  }
];

export const reviews: Review[] = [
  {
    id: 'rev_el_1',
    productId: 'prod_el_1', // AuraBeat Pro Wireless Headphones
    userName: 'Alice Wonderland',
    rating: 5,
    comment: 'Absolutely love these headphones! The noise cancellation is top-notch and they are so comfortable for long listening sessions.',
    date: '2024-03-15T10:00:00Z',
  },
  {
    id: 'rev_el_2',
    productId: 'prod_el_1', // AuraBeat Pro Wireless Headphones
    userName: 'Bob The Builder',
    rating: 4,
    comment: 'Great sound quality and ANC. The battery life is fantastic. A bit pricey, but worth it.',
    date: '2024-03-20T14:30:00Z',
  },
  {
    id: 'rev_el_3',
    productId: 'prod_el_2', // NovaPhone X2 Ultra Smartphone
    userName: 'Charlie R.',
    rating: 5,
    comment: 'This phone is a beast! Camera is incredible, and it handles everything I throw at it. Display is gorgeous.',
    date: '2024-04-05T09:15:00Z',
  },
  {
    id: 'rev_el_4',
    productId: 'prod_el_3', // ZenithBook Air 14" Laptop
    userName: 'Diana P.',
    rating: 4,
    comment: 'Super light and portable, battery lasts all day. Keyboard is comfortable for typing. Screen is crisp.',
    date: '2024-04-01T11:00:00Z',
  },
  {
    id: 'rev_el_5',
    productId: 'prod_el_6', // ChronoFit Active Smartwatch
    userName: 'Eddie M.',
    rating: 5,
    comment: 'Best smartwatch I\'ve owned. Tracks everything accurately and the screen is very bright outdoors.',
    date: '2024-03-25T16:45:00Z',
  },
  {
    id: 'rev_el_6',
    productId: 'prod_el_4', // SkyHawk Pro Drone
    userName: 'Fiona G.',
    rating: 5,
    comment: 'Incredible drone for the price. Stable flight and amazing video quality. Easy to learn for beginners too!',
    date: '2024-02-28T07:30:00Z',
  },
   {
    id: 'rev_el_7',
    productId: 'prod_el_5', // Vortex G1 Gaming Console
    userName: 'GamerGuyX',
    rating: 5,
    comment: 'Next-gen is finally here! Load times are insane and the graphics are breathtaking. Controller feels great.',
    date: '2024-04-10T18:00:00Z',
  },
  {
    id: 'rev_el_8',
    productId: 'prod_el_7', // AuraHome Smart Hub Pro
    userName: 'SmartHomeFan',
    rating: 4,
    comment: 'Connects all my devices seamlessly. App is pretty good, but could use a few more integrations.',
    date: '2024-03-01T12:00:00Z',
  }
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

    