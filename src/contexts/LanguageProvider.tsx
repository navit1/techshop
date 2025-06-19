
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Определяем доступные языки
export type Language = 'ru' | 'en' | 'kk';

// Структура для словарей переводов
type Translations = {
  [key: string]: string;
};

type Dictionaries = {
  [lang in Language]: Translations;
};

// Базовые словари (можно вынести в отдельные файлы JSON/JS)
const dictionaries: Dictionaries = {
  ru: {
    'app.name': 'TechShop',
    'nav.catalog': 'Каталог',
    'nav.cart': 'Корзина',
    'nav.wishlist': 'Избранное',
    'nav.profile': 'Профиль',
    'nav.login': 'Вход',
    'profile.welcome': 'Добро пожаловать',
    'profile.manage_info': 'Управляйте вашей информацией, заказами и настройками.',
    'profile.personal_info': 'Личная информация',
    'profile.personal_info_desc': 'Ваши основные данные учетной записи.',
    'profile.email': 'Email',
    'profile.name': 'Имя',
    'profile.edit_profile_wip': 'Редактировать профиль (в разработке)',
    'profile.order_history': 'История заказов',
    'profile.order_history_desc': 'Просмотр ваших прошлых и текущих заказов.',
    'profile.no_orders': 'У вас пока нет размещенных заказов.',
    'profile.order_status_pending': 'В ожидании',
    'profile.order_status_processing': 'В обработке',
    'profile.order_status_shipped': 'Отправлен',
    'profile.order_status_delivered': 'Доставлен',
    'profile.order_status_cancelled': 'Отменен',
    'profile.order_status_unknown': 'Неизвестен',
    'profile.order_total_amount': 'Сумма',
    'profile.order_items_label': 'Товары:',
    'profile.order_shipping_label': 'Доставка:',
    'profile.order_payment_label': 'Оплата:',
    'profile.account_settings': 'Настройки аккаунта',
    'profile.account_settings_desc': 'Управление параметрами вашей учетной записи.',
    'profile.change_password_wip': 'Изменить пароль (в разработке)',
    'profile.manage_addresses_wip': 'Управление адресами (в разработке)',
    'profile.language_settings': 'Настройки языка',
    'profile.language_settings_desc': 'Выберите предпочитаемый язык интерфейса.',
    'profile.app_language': 'Язык приложения',
    'profile.select_language': 'Выберите язык',
    'profile.language_russian': 'Русский',
    'profile.language_english': 'English',
    'profile.language_kazakh': 'Қазақша',
    'profile.language_change_note': 'Полная смена языка интерфейса будет доступна в следующих обновлениях.',
    'profile.logout': 'Выйти из аккаунта',
    'toast.lang_changed_title': 'Настройки языка',
    'toast.lang_changed_desc_ru': 'Язык изменен на Русский.',
    'toast.lang_changed_desc_en': 'Language changed to English.',
    'toast.lang_changed_desc_kk': 'Тіл Қазақшаға өзгертілді.',
    'footer.copyright': '© {year} TechShop. Все права защищены.',
    'footer.powered_by': 'Работает на Next.js и ShadCN UI',

  },
  en: {
    'app.name': 'TechShop',
    'nav.catalog': 'Catalog',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'profile.welcome': 'Welcome',
    'profile.manage_info': 'Manage your information, orders, and settings.',
    'profile.personal_info': 'Personal Information',
    'profile.personal_info_desc': 'Your main account details.',
    'profile.email': 'Email',
    'profile.name': 'Name',
    'profile.edit_profile_wip': 'Edit Profile (work in progress)',
    'profile.order_history': 'Order History',
    'profile.order_history_desc': 'View your past and current orders.',
    'profile.no_orders': 'You have no placed orders yet.',
    'profile.order_status_pending': 'Pending',
    'profile.order_status_processing': 'Processing',
    'profile.order_status_shipped': 'Shipped',
    'profile.order_status_delivered': 'Delivered',
    'profile.order_status_cancelled': 'Cancelled',
    'profile.order_status_unknown': 'Unknown',
    'profile.order_total_amount': 'Total',
    'profile.order_items_label': 'Items:',
    'profile.order_shipping_label': 'Shipping:',
    'profile.order_payment_label': 'Payment:',
    'profile.account_settings': 'Account Settings',
    'profile.account_settings_desc': 'Manage your account parameters.',
    'profile.change_password_wip': 'Change Password (work in progress)',
    'profile.manage_addresses_wip': 'Manage Addresses (work in progress)',
    'profile.language_settings': 'Language Settings',
    'profile.language_settings_desc': 'Choose your preferred interface language.',
    'profile.app_language': 'Application Language',
    'profile.select_language': 'Select language',
    'profile.language_russian': 'Русский',
    'profile.language_english': 'English',
    'profile.language_kazakh': 'Қазақша',
    'profile.language_change_note': 'Full interface language change will be available in future updates.',
    'profile.logout': 'Logout',
    'toast.lang_changed_title': 'Language Settings',
    'toast.lang_changed_desc_ru': 'Язык изменен на Русский.',
    'toast.lang_changed_desc_en': 'Language changed to English.',
    'toast.lang_changed_desc_kk': 'Тіл Қазақшаға өзгертілді.',
    'footer.copyright': '© {year} TechShop. All rights reserved.',
    'footer.powered_by': 'Powered by Next.js and ShadCN UI',
  },
  kk: {
    'app.name': 'TechShop',
    'nav.catalog': 'Каталог',
    'nav.cart': 'Себет',
    'nav.wishlist': 'Таңдаулылар',
    'nav.profile': 'Профиль',
    'nav.login': 'Кіру',
    'profile.welcome': 'Қош келдіңіз',
    'profile.manage_info': 'Ақпаратыңызды, тапсырыстарыңызды және параметрлеріңізді басқарыңыз.',
    'profile.personal_info': 'Жеке ақпарат',
    'profile.personal_info_desc': 'Сіздің негізгі тіркелгі деректеріңіз.',
    'profile.email': 'Email',
    'profile.name': 'Аты',
    'profile.edit_profile_wip': 'Профильді өңдеу (әзірленуде)',
    'profile.order_history': 'Тапсырыстар тарихы',
    'profile.order_history_desc': 'Өткен және ағымдағы тапсырыстарыңызды қарау.',
    'profile.no_orders': 'Сізде әлі тапсырыстар жоқ.',
    'profile.order_status_pending': 'Күтуде',
    'profile.order_status_processing': 'Өңделуде',
    'profile.order_status_shipped': 'Жіберілді',
    'profile.order_status_delivered': 'Жеткізілді',
    'profile.order_status_cancelled': 'Бас тартылды',
    'profile.order_status_unknown': 'Белгісіз',
    'profile.order_total_amount': 'Сомасы',
    'profile.order_items_label': 'Тауарлар:',
    'profile.order_shipping_label': 'Жеткізу:',
    'profile.order_payment_label': 'Төлем:',
    'profile.account_settings': 'Тіркелгі параметрлері',
    'profile.account_settings_desc': 'Тіркелгі параметрлерін басқару.',
    'profile.change_password_wip': 'Құпия сөзді өзгерту (әзірленуде)',
    'profile.manage_addresses_wip': 'Мекенжайларды басқару (әзірленуде)',
    'profile.language_settings': 'Тіл параметрлері',
    'profile.language_settings_desc': 'Қалаған интерфейс тілін таңдаңыз.',
    'profile.app_language': 'Қолданба тілі',
    'profile.select_language': 'Тілді таңдаңыз',
    'profile.language_russian': 'Русский',
    'profile.language_english': 'English',
    'profile.language_kazakh': 'Қазақша',
    'profile.language_change_note': 'Интерфейс тілін толық өзгерту келесі жаңартуларда қолжетімді болады.',
    'profile.logout': 'Шығу',
    'toast.lang_changed_title': 'Тіл параметрлері',
    'toast.lang_changed_desc_ru': 'Язык изменен на Русский.',
    'toast.lang_changed_desc_en': 'Language changed to English.',
    'toast.lang_changed_desc_kk': 'Тіл Қазақшаға өзгертілді.',
    'footer.copyright': '© {year} TechShop. Барлық құқықтар қорғалған.',
    'footer.powered_by': 'Next.js және ShadCN UI негізінде жұмыс істейді',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'appLanguage';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru'); // По умолчанию русский
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (storedLanguage && dictionaries[storedLanguage]) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    if (dictionaries[lang]) {
      setLanguageState(lang);
      if (isMounted) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      }
    }
  }, [isMounted]);

  const translate = useCallback((key: string, params?: Record<string, string | number>): string => {
    const currentDictionary = dictionaries[language] || dictionaries.ru; // Фоллбэк на русский, если язык не найден
    let translation = currentDictionary[key] || key; // Возвращаем ключ, если перевод не найден

    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`{${paramKey}}`, 'g');
        translation = translation.replace(regex, String(params[paramKey]));
      });
    }
    return translation;
  }, [language]);

  // Предотвращаем рендеринг на сервере с неправильным языком, ждем монтирования на клиенте
  if (!isMounted) {
    return null; 
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
