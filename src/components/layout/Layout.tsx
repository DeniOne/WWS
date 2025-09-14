'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { UserRole } from '../../types/user';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
}

/**
 * 🎯 Основной макет для WWS
 * Обертка для всех страниц с шапкой, подвалом и темной темой
 */
export const Layout: React.FC<LayoutProps> = ({ children, userRole }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Загружаем тему из localStorage при загрузке
  useEffect(() => {
    const savedTheme = localStorage.getItem('wws-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Автоопределение темы по системным настройкам
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Применяем тему к документу
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('wws-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleMenuToggle = () => {
    // Логика для мобильного меню
    console.log('Menu toggled');
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Header
        userRole={userRole}
        onMenuToggle={handleMenuToggle}
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
