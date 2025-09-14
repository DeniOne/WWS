'use client';

import React from 'react';
import { User, Users, Stethoscope, HandHeart, Handshake } from 'lucide-react';
import UserRoleCard from './UserRoleCard';

/**
 * 🎯 Главный портал выбора ролей для WWS
 * Адаптивная сетка карточек ролей с анимациями
 */
export const MainPortal: React.FC = () => {
  const userRoles = [
    {
      title: 'Пациент',
      description: 'Личный кабинет для восстановления и реабилитации',
      icon: User,
      color: '#1E88E5',
      features: [
        'Дневник восстановления',
        'Персональные упражнения',
        'Связь с врачами',
        'SOS кнопка',
        'Сообщество поддержки'
      ]
    },
    {
      title: 'Семья',
      description: 'Инструменты поддержки близких после инсульта',
      icon: Users,
      color: '#4CAF50',
      features: [
        'Мониторинг состояния',
        'Обучающие материалы',
        'Группы поддержки семей',
        'Ресурсы для ухода',
        'Консультации специалистов'
      ]
    },
    {
      title: 'Врач',
      description: 'Профессиональные инструменты для медработников',
      icon: Stethoscope,
      color: '#6C757D',
      features: [
        'База пациентов',
        'Планы реабилитации',
        'Медицинская библиотека',
        'Консультации коллег',
        'Статистика и отчеты'
      ]
    },
    {
      title: 'Волонтер',
      description: 'Помощь и поддержка нуждающихся',
      icon: HandHeart,
      color: '#FFD93D',
      features: [
        'Расписание помощи',
        'Список подопечных',
        'Обучение волонтеров',
        'Отчеты о деятельности',
        'Координация с командой'
      ]
    },
    {
      title: 'Партнер',
      description: 'Коммерческие услуги и партнерство',
      icon: Handshake,
      color: '#FF6B6B',
      features: [
        'Маркетплейс услуг',
        'Аналитика рынка',
        'Партнерские программы',
        'Реклама и продвижение',
        'Финансовые отчеты'
      ]
    }
  ];

  const handleRoleClick = (role: string) => {
    console.log(`Переход в кабинет: ${role}`);
    // Здесь будет логика перехода в соответствующий кабинет
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-4xl font-bold heading-medical mb-4 text-primary">
          Выберите свою роль
        </h2>
        <p className="text-xl text-supportive max-w-3xl mx-auto leading-relaxed">
          Наша экосистема предоставляет персонализированные инструменты и ресурсы 
          для каждой роли в процессе восстановления после инсульта
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {userRoles.map((role, index) => (
          <div key={role.title} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
            <UserRoleCard
              title={role.title}
              description={role.description}
              icon={role.icon}
              color={role.color}
              features={role.features}
              onClick={() => handleRoleClick(role.title)}
            />
          </div>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-4xl font-bold text-primary mb-2">150K+</div>
          <div className="text-supportive">Пользователей по всему миру</div>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="text-4xl font-bold text-coral mb-2">24/7</div>
          <div className="text-supportive">Круглосуточная поддержка</div>  
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="text-4xl font-bold text-primary mb-2">95%</div>
          <div className="text-supportive">Показатель успешности</div>
        </div>
      </div>
    </main>
  );
};

export default MainPortal;
