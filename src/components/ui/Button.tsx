'use client';

import React from 'react';
import { ButtonProps } from '../../types/ui';

/**
 * 🎯 Универсальная кнопка для WWS
 * Поддерживает все варианты: primary, secondary, danger, ghost
 * Адаптивная для инсультников: крупные размеры, четкие контуры
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  // Базовые стили для всех кнопок
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${fullWidth ? 'w-full' : ''}
  `;

  // Варианты стилей
  const variantStyles = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700 focus:ring-blue-500
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gray-200 text-gray-900
      hover:bg-gray-300 focus:ring-gray-500
      border border-gray-300
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700 focus:ring-red-500
      shadow-lg hover:shadow-xl
    `,
    ghost: `
      bg-transparent text-gray-700
      hover:bg-gray-100 focus:ring-gray-500
      border border-gray-300
    `,
    success: `
      bg-green-600 text-white
      hover:bg-green-700 focus:ring-green-500
      shadow-lg hover:shadow-xl
    `,
    warning: `
      bg-orange-500 text-white
      hover:bg-orange-600 focus:ring-orange-400
      shadow-lg hover:shadow-xl
    `,
  };

  // Размеры кнопок (адаптивные для инсультников)
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs min-h-[32px]',
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]',
    xl: 'px-8 py-5 text-xl min-h-[64px]',
  };

  // SOS кнопка - особый стиль
  const isSOS = variant === 'danger' && size === 'xl';
  const sosStyles = isSOS ? `
    animate-pulse
    bg-red-600 hover:bg-red-700
    text-white font-bold text-2xl
    min-h-[80px] px-8 py-6
    shadow-2xl hover:shadow-red-500/50
    border-4 border-red-400
    rounded-2xl
  ` : '';

  const buttonStyles = `
    ${baseStyles}
    ${sosStyles || variantStyles[variant]}
    ${sosStyles ? '' : sizeStyles[size]}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
