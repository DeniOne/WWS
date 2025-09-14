'use client';

import React, { useState } from 'react';
import { Button } from '../ui';
import { UserRole } from '../../types/user';
import Image from 'next/image';

interface HeaderProps {
  userRole?: UserRole;
  onMenuToggle?: () => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

/**
 * 🎯 Шапка сайта для WWS с дизайном из репозитория
 * Адаптивная навигация с поддержкой темной темы
 * Оптимизирована для людей с нарушениями моторики
 */
export const Header: React.FC<HeaderProps> = ({
  userRole,
  onMenuToggle,
  onThemeToggle,
  isDarkMode = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  const handleThemeToggle = () => {
    onThemeToggle?.();
  };

  return (
    <header className="w-full bg-gradient-to-r from-background via-secondary to-accent border-b border-primary/10">
      <div className="container mx-auto px-4 py-6">
        {/* Top Section - Logo and Slogans */}
        <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <Image 
              src="/wws-logo.png" 
              alt="Without Words Stroke Logo" 
              width={80} 
              height={80} 
              className="animate-float" 
            />
            <div>
              <h1 className="text-4xl heading-medical text-left px-[10px] font-bold md:text-5xl text-primary">
                Without Words Stroke
              </h1>
              <div className="text-3xl text-muted-foreground mt-2">
                <span className="gradient-text font-semibold">We Will Survive</span>
                <span className="mx-2">•</span>
                <span className="gradient-text font-semibold">World Wide Support</span>
              </div>
            </div>
          </div>
          
          <p className="text-supportive max-w-2xl text-lg">
            Комплексная экосистема поддержки для людей, перенесших инсульт, их семей и медицинских специалистов
          </p>
        </div>

        {/* Critical Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button 
            variant="danger" 
            size="xl" 
            className="w-full sm:w-auto bg-sos hover:bg-sos-soft text-sos-foreground shadow-sos"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            У МЕНЯ ИНСУЛЬТ
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </Button>
          
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full sm:w-auto bg-coral hover:bg-coral/90 text-coral-foreground"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            СИМПТОМЫ И ПРОФИЛАКТИКА
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          <Button variant="secondary" size="default">О проекте</Button>
          <Button variant="ghost" size="default">Stroke Academy</Button>
          <Button variant="ghost" size="default">Истории выживших</Button>
          <Button variant="ghost" size="default">Сообщество</Button>
          <Button variant="ghost" size="default">Реестр клиник</Button>
          <Button variant="ghost" size="default">Ресурсы</Button>
          <Button variant="primary" size="default" className="bg-coral hover:bg-coral/90 text-coral-foreground">Поддержка</Button>
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden mt-4 flex justify-center">
          <button
            onClick={handleMenuToggle}
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="Открыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t border-primary/10 pt-4">
            <nav className="flex flex-col space-y-2">
              <Button variant="ghost" size="default" className="justify-start">О проекте</Button>
              <Button variant="ghost" size="default" className="justify-start">Stroke Academy</Button>
              <Button variant="ghost" size="default" className="justify-start">Истории выживших</Button>
              <Button variant="ghost" size="default" className="justify-start">Сообщество</Button>
              <Button variant="ghost" size="default" className="justify-start">Реестр клиник</Button>
              <Button variant="ghost" size="default" className="justify-start">Ресурсы</Button>
              <Button variant="primary" size="default" className="justify-start bg-coral hover:bg-coral/90 text-coral-foreground">Поддержка</Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
