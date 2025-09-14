'use client';

import React from 'react';
import { CardProps } from '../../types/ui';

/**
 * 🎯 Карточка для WWS
 * Адаптивная карточка с поддержкой темной темы
 * Оптимизирована для людей с нарушениями зрения
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  // Базовые стили
  const baseStyles = `
    rounded-xl border
    transition-all duration-200 ease-in-out
    ${onClick ? 'cursor-pointer' : ''}
    ${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
  `;

  // Варианты карточек
  const variantStyles = {
    default: `
      bg-white dark:bg-gray-800
      border-gray-200 dark:border-gray-700
      text-gray-900 dark:text-gray-100
    `,
    primary: `
      bg-blue-50 dark:bg-blue-900/20
      border-blue-200 dark:border-blue-700
      text-blue-900 dark:text-blue-100
    `,
    success: `
      bg-green-50 dark:bg-green-900/20
      border-green-200 dark:border-green-700
      text-green-900 dark:text-green-100
    `,
    warning: `
      bg-orange-50 dark:bg-orange-900/20
      border-orange-200 dark:border-orange-700
      text-orange-900 dark:text-orange-100
    `,
    danger: `
      bg-red-50 dark:bg-red-900/20
      border-red-200 dark:border-red-700
      text-red-900 dark:text-red-100
    `,
    ghost: `
      bg-transparent
      border-gray-200 dark:border-gray-700
      text-gray-900 dark:text-gray-100
    `,
  };

  // Отступы
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  // Тени
  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const cardStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${shadowStyles[shadow]}
    ${className}
  `;

  return (
    <div
      className={cardStyles}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
