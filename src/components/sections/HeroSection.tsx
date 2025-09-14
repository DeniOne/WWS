'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui';
import { SOSButton } from './SOSButton';

/**
 * 🎯 Главная секция с живым логотипом
 * Анимированный логотип и основные кнопки
 * Первое, что видят пользователи
 */
export const HeroSection: React.FC = () => {
  const [logoAnimation, setLogoAnimation] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(0);

  const slogans = [
    'We Will Survive',
    'World Wide Support', 
    'Wellness With Strength',
    'Way With Support'
  ];

  // Анимация логотипа при загрузке
  useEffect(() => {
    setLogoAnimation(true);
  }, []);

  // Смена слоганов
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slogans.length]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Живой логотип */}
          <div className="mb-12">
            <div className={`inline-block transition-all duration-1000 ${
              logoAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}>
              <div className="relative">
                {/* Основной логотип */}
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl shadow-2xl flex items-center justify-center mb-6 animate-pulse">
                  <span className="text-white font-bold text-4xl">WWS</span>
                </div>
                
                {/* Анимированные кольца */}
                <div className="absolute inset-0 w-32 h-32 mx-auto">
                  <div className="absolute inset-0 border-4 border-blue-400 rounded-3xl animate-ping opacity-20"></div>
                  <div className="absolute inset-0 border-2 border-green-400 rounded-3xl animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
            </div>

            {/* Название проекта */}
            <h1 className={`text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-1000 ${
              logoAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '0.3s' }}>
              Without Words Stroke
            </h1>

            {/* Анимированный слоган */}
            <div className="h-16 flex items-center justify-center mb-8">
              <p className={`text-2xl md:text-3xl text-blue-600 dark:text-blue-400 font-semibold transition-all duration-500 ${
                logoAnimation ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: '0.6s' }}>
                {slogans[currentSlogan]}
              </p>
            </div>
          </div>

          {/* Основные кнопки */}
          <div className={`space-y-6 transition-all duration-1000 ${
            logoAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`} style={{ transitionDelay: '0.9s' }}>
            {/* SOS кнопка */}
            <div className="mb-8">
              <SOSButton />
            </div>

            {/* Дополнительные кнопки */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                className="min-w-[250px]"
              >
                🩺 Симптомы и профилактика
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="min-w-[250px]"
              >
                🎓 Stroke Academy
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="ghost"
                size="lg"
                className="min-w-[250px]"
              >
                📖 Истории выживших
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="min-w-[250px]"
              >
                🏥 Найти клинику
              </Button>
            </div>
          </div>

          {/* Статистика */}
          <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${
            logoAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`} style={{ transitionDelay: '1.2s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                10M+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Пользователей по всему миру
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                100K+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Клиник-партнеров
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                100+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Стран присутствия
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
