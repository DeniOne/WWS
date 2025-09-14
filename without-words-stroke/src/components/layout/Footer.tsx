'use client';

import React from 'react';

/**
 * 🎯 Подвал сайта для WWS
 * Информация о проекте, контакты, ссылки
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О проекте */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">WWS</span>
              </div>
              <h3 className="text-xl font-bold">Without Words Stroke</h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Глобальная экосистема поддержки людей после инсульта. 
              Мы помогаем восстановиться, общаться и жить полноценной жизнью.
            </p>
            <p className="text-sm text-muted-foreground">
              We Will Survive • World Wide Support
            </p>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Разделы</h4>
            <ul className="space-y-2">
              <li>
                <a href="/academy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Stroke Academy
                </a>
              </li>
              <li>
                <a href="/stories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Истории выживших
                </a>
              </li>
              <li>
                <a href="/clinics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Реестр клиник
                </a>
              </li>
              <li>
                <a href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Поддержка
                </a>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="mailto:support@withoutwordsstroke.com" className="hover:text-foreground transition-colors">
                  support@withoutwordsstroke.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-foreground transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <a href="/emergency" className="text-sos hover:text-sos-soft transition-colors font-semibold">
                  🚨 Экстренная помощь
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm">
              © 2025 Without Words Stroke. Все права защищены.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Конфиденциальность
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Условия использования
              </a>
              <a href="/cookies" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
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
