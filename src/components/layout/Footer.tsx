
"use client";

import { useLanguage } from '@/contexts/LanguageProvider';

export function Footer() {
  const { translate } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-muted-foreground py-8 mt-12 border-t">
      <div className="container mx-auto px-4 text-center">
        <p>{translate('footer.copyright', { year: currentYear })}</p>
        <p className="text-sm mt-2">{translate('footer.powered_by')}</p>
      </div>
    </footer>
  );
}
