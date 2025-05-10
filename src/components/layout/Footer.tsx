
export function Footer() {
  return (
    <footer className="bg-card text-muted-foreground py-8 mt-12 border-t">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} TechShop. Все права защищены.</p>
        <p className="text-sm mt-2">Работает на Next.js и ShadCN UI</p>
      </div>
    </footer>
  );
}

    
