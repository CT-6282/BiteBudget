import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es-MX';
export type Currency = 'USD' | 'MXN';

interface LanguageContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
}

const translations = {
  'en': {
    // Navigation
    'dashboard': 'Dashboard',
    'receipts': 'Receipts',
    'budget': 'Budget',
    'analytics': 'Analytics',
    'products': 'Products',
    'profile': 'Profile',
    'shoppingList': 'Shopping List',
    'map': 'Map',
    'logout': 'Logout',
    'login': 'Login',
    'register': 'Register',

    // Dashboard
    'welcome_back': 'Welcome back! Here\'s your grocery spending overview.',
    'total_spent_month': 'Total Spent This Month',
    'budget_utilization': 'Budget Utilization',
    'receipts_scanned': 'Receipts Scanned',
    'sustainability_score': 'Sustainability Score',
    'spending_breakdown': 'Spending Breakdown',
    'monthly_trend': 'Monthly Spending Trend',
    'recent_activity': 'Recent Activity',
    'quick_actions': 'Quick Actions',
    'scan_receipt': 'Scan Receipt',
    'add_budget': 'Add Budget',
    'shopping_list': 'Shopping List',
    'view_analytics': 'View Analytics',

    // Common
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'add': 'Add',
    'search': 'Search',
    'filter': 'Filter',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
  },
  'es-MX': {
    // Navigation
    'dashboard': 'Panel Principal',
    'receipts': 'Recibos',
    'budget': 'Presupuesto',
    'analytics': 'Análisis',
    'products': 'Productos',
    'profile': 'Perfil',
    'shoppingList': 'Lista de Compras',
    'map': 'Mapa',
    'logout': 'Cerrar Sesión',
    'login': 'Iniciar Sesión',
    'register': 'Registrarse',

    // Dashboard
    'welcome_back': '¡Bienvenido de vuelta! Aquí tienes tu resumen de gastos en compras.',
    'total_spent_month': 'Total Gastado Este Mes',
    'budget_utilization': 'Uso del Presupuesto',
    'receipts_scanned': 'Recibos Escaneados',
    'sustainability_score': 'Puntuación de Sustentabilidad',
    'spending_breakdown': 'Desglose de Gastos',
    'monthly_trend': 'Tendencia Mensual de Gastos',
    'recent_activity': 'Actividad Reciente',
    'quick_actions': 'Acciones Rápidas',
    'scan_receipt': 'Escanear Recibo',
    'add_budget': 'Añadir Presupuesto',
    'shopping_list': 'Lista de Compras',
    'view_analytics': 'Ver Análisis',

    // Common
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'add': 'Añadir',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'loading': 'Cargando...',
    'error': 'Error',
    'success': 'Éxito',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  const formatCurrency = (amount: number): string => {
    const locale = language === 'es-MX' ? 'es-MX' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const value = {
    language,
    currency,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      setCurrency(lang === 'es-MX' ? 'MXN' : 'USD');
    },
    setCurrency,
    t,
    formatCurrency,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
