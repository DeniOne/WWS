'use client';

import React from 'react';

/**
 * 🎯 Подвал сайта для WWS
 * Информация о проекте, контакты, ссылки
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О проекте */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">WWS</span>
              </div>
              <h3 className="text-xl font-bold">Without Words Stroke</h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Глобальная экосистема поддержки людей после инсульта. 
              Мы помогаем восстановиться, общаться и жить полноценной жизнью.
            </p>
            <p className="text-sm text-gray-400">
              We Will Survive • World Wide Support
            </p>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Разделы</h4>
            <ul className="space-y-2">
              <li>
                <a href="/academy" className="text-gray-300 hover:text-white transition-colors">
                  Stroke Academy
                </a>
              </li>
              <li>
                <a href="/stories" className="text-gray-300 hover:text-white transition-colors">
                  Истории выживших
                </a>
              </li>
              <li>
                <a href="/clinics" className="text-gray-300 hover:text-white transition-colors">
                  Реестр клиник
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-300 hover:text-white transition-colors">
                  Поддержка
                </a>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="mailto:support@withoutwordsstroke.com" className="hover:text-white transition-colors">
                  support@withoutwordsstroke.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <a href="/emergency" className="text-red-400 hover:text-red-300 transition-colors font-semibold">
                  🚨 Экстренная помощь
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 Without Words Stroke. Все права защищены.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Конфиденциальность
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Условия использования
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
