
export const metadata = {
  title: 'Товары - TechShop',
  description: 'Ознакомьтесь со всеми нашими товарами в TechShop. Фильтруйте по цене, бренду и другим характеристикам.',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Removed the <h1>Каталог товаров</h1> from here as it's better handled by the page itself or a shared component if needed globally
  return (
    <div>
      {children}
    </div>
  );
}
