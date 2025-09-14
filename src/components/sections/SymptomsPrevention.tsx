'use client';

import React, { useState } from 'react';
import { Card } from '../ui';

/**
 * 🩺 Система симптомов и профилактики
 * Образовательный контент для распознавания инсульта
 * Интерактивные элементы для лучшего понимания
 */
export const SymptomsPrevention: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'prevention' | 'risk'>('symptoms');

  const symptoms = [
    {
      letter: 'F',
      title: 'Face (Лицо)',
      description: 'Асимметрия лица, опущение одного угла рта',
      icon: '😐',
      details: [
        'Попросите человека улыбнуться',
        'Одна сторона лица может не двигаться',
        'Глаз может быть опущен или закрыт'
      ]
    },
    {
      letter: 'A',
      title: 'Arms (Руки)',
      description: 'Слабость или онемение в одной руке',
      icon: '🤚',
      details: [
        'Попросите поднять обе руки',
        'Одна рука может опускаться',
        'Нарушение координации движений'
      ]
    },
    {
      letter: 'S',
      title: 'Speech (Речь)',
      description: 'Невнятная речь или трудности понимания',
      icon: '🗣️',
      details: [
        'Попросите повторить простую фразу',
        'Речь может быть невнятной',
        'Трудности с пониманием слов'
      ]
    },
    {
      letter: 'T',
      title: 'Time (Время)',
      description: 'Каждая минута важна! Немедленно звоните 112',
      icon: '⏰',
      details: [
        'Золотые 4.5 часа для лечения',
        'Чем раньше помощь - тем лучше исход',
        'Не ждите улучшения!'
      ]
    }
  ];

  const preventionTips = [
    {
      title: 'Контроль давления',
      description: 'Регулярно измеряйте артериальное давление',
      icon: '🩺',
      tips: [
        'Норма: менее 120/80 мм рт.ст.',
        'Измеряйте ежедневно в одно время',
        'Ведите дневник показателей'
      ]
    },
    {
      title: 'Здоровое питание',
      description: 'Сбалансированная диета с низким содержанием соли',
      icon: '🥗',
      tips: [
        'Больше овощей и фруктов',
        'Меньше соли (менее 5г в день)',
        'Ограничьте жирную пищу'
      ]
    },
    {
      title: 'Физическая активность',
      description: 'Регулярные упражнения укрепляют сосуды',
      icon: '🏃‍♂️',
      tips: [
        '150 минут умеренной активности в неделю',
        'Ходьба, плавание, велосипед',
        'Начните с 10 минут в день'
      ]
    },
    {
      title: 'Отказ от курения',
      description: 'Курение значительно увеличивает риск инсульта',
      icon: '🚭',
      tips: [
        'Обратитесь к врачу за помощью',
        'Используйте никотинозаместительную терапию',
        'Избегайте пассивного курения'
      ]
    }
  ];

  const riskFactors = [
    { factor: 'Возраст 55+', risk: 'Высокий', color: 'red' },
    { factor: 'Высокое давление', risk: 'Очень высокий', color: 'red' },
    { factor: 'Диабет', risk: 'Высокий', color: 'orange' },
    { factor: 'Курение', risk: 'Высокий', color: 'red' },
    { factor: 'Ожирение', risk: 'Средний', color: 'yellow' },
    { factor: 'Стресс', risk: 'Средний', color: 'yellow' },
    { factor: 'Малоподвижность', risk: 'Средний', color: 'yellow' },
    { factor: 'Семейная история', risk: 'Высокий', color: 'orange' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🩺 Симптомы и профилактика инсульта
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Знание симптомов может спасти жизнь. Профилактика - лучшая защита.
        </p>
      </div>

      {/* Табы */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'symptoms'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Симптомы (FAST)
          </button>
          <button
            onClick={() => setActiveTab('prevention')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'prevention'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Профилактика
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'risk'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Факторы риска
          </button>
        </div>
      </div>

      {/* Контент */}
      {activeTab === 'symptoms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {symptoms.map((symptom, index) => (
            <Card key={index} variant="primary" className="text-center">
              <div className="text-4xl mb-4">{symptom.icon}</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {symptom.letter}
              </div>
              <h3 className="text-xl font-semibold mb-2">{symptom.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {symptom.description}
              </p>
              <ul className="text-sm text-left space-y-1">
                {symptom.details.map((detail, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'prevention' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {preventionTips.map((tip, index) => (
            <Card key={index} variant="success" className="h-full">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{tip.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {tip.description}
                  </p>
                  <ul className="space-y-2">
                    {tip.tips.map((tipItem, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {tipItem}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="max-w-4xl mx-auto">
          <Card variant="warning" className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Оценка факторов риска
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskFactors.map((factor, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    factor.color === 'red'
                      ? 'border-red-200 bg-red-50 dark:bg-red-900/20'
                      : factor.color === 'orange'
                      ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{factor.factor}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        factor.color === 'red'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : factor.color === 'orange'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {factor.risk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Обратитесь к врачу для полной оценки рисков
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Записаться на консультацию
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomsPrevention;
