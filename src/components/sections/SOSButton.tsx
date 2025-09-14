'use client';

import React, { useState } from 'react';
import { Button } from '../ui';

/**
 * 🚨 SOS кнопка для экстренной помощи
 * Самая важная функция для людей с инсультом
 * Большая, яркая, с анимацией для привлечения внимания
 */
export const SOSButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSOSClick = () => {
    setIsPressed(true);
    setCountdown(3);
    
    // Обратный отсчет
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Здесь будет вызов экстренных служб
          alert('🚨 ВЫЗОВ ЭКСТРЕННЫХ СЛУЖБ! 🚨\n\nСвязываемся с:\n• Скорой помощью (112)\n• Близкими\n• Врачом');
          setIsPressed(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚨 Экстренная помощь
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Если у вас или у близкого инсульт
        </p>
      </div>

      <div className="relative">
        <Button
          variant="danger"
          size="xl"
          onClick={handleSOSClick}
          disabled={isPressed}
          className={`
            ${isPressed ? 'animate-pulse' : ''}
            ${isPressed ? 'scale-110' : 'hover:scale-105'}
            transition-all duration-200
            min-w-[300px]
            min-h-[100px]
            text-2xl font-bold
            shadow-2xl
            border-4 border-red-400
            rounded-2xl
          `}
        >
          {isPressed ? (
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🚨</div>
              <div className="text-2xl">
                {countdown > 0 ? `Вызов через ${countdown}...` : 'Вызываем помощь!'}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🚨</div>
              <div className="text-2xl">У МЕНЯ ИНСУЛЬТ</div>
              <div className="text-sm mt-2 opacity-90">
                Нажмите для вызова помощи
              </div>
            </div>
          )}
        </Button>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-8 text-center max-w-2xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
            Симптомы инсульта (FAST):
          </h3>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            <li><strong>F</strong>ace - Лицо: асимметрия, опущение угла рта</li>
            <li><strong>A</strong>rms - Руки: слабость в одной руке</li>
            <li><strong>S</strong>peech - Речь: невнятная речь, трудности понимания</li>
            <li><strong>T</strong>ime - Время: каждая минута важна!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SOSButton;
