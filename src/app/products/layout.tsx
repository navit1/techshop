
import type { Metadata } from 'next';

// Metadata here is static. For dynamic titles based on language,
// the page component itself (if client-side) would need to update document.title.
export const metadata: Metadata = {
  title: 'Products - TechShop', // A more generic title, specific pages can override
  description: 'Browse all our products at TechShop. Filter by price, brand, and other features.',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
