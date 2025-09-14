'use client';

import React, { forwardRef } from 'react';
import { InputProps } from '../../types/ui';

/**
 * 🎯 Поле ввода для WWS
 * Адаптивное для людей с нарушениями моторики и зрения
 * Поддержка крупных размеров и четких контуров
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'default',
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  // Базовые стили
  const baseStyles = `
    w-full rounded-lg border
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:bg-gray-50 dark:disabled:bg-gray-800
  `;

  // Варианты стилей
  const variantStyles = {
    default: `
      bg-white dark:bg-gray-800
      border-gray-300 dark:border-gray-600
      text-gray-900 dark:text-gray-100
      placeholder-gray-500 dark:placeholder-gray-400
      focus:ring-blue-500 focus:border-blue-500
    `,
    error: `
      bg-white dark:bg-gray-800
      border-red-500 dark:border-red-400
      text-gray-900 dark:text-gray-100
      placeholder-red-300 dark:placeholder-red-600
      focus:ring-red-500 focus:border-red-500
    `,
    success: `
      bg-white dark:bg-gray-800
      border-green-500 dark:border-green-400
      text-gray-900 dark:text-gray-100
      placeholder-gray-500 dark:placeholder-gray-400
      focus:ring-green-500 focus:border-green-500
    `,
  };

  // Размеры (адаптивные для инсультников)
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]',
    xl: 'px-8 py-5 text-xl min-h-[64px]',
  };

  // Определяем вариант на основе ошибки
  const currentVariant = error ? 'error' : variant;

  const inputStyles = `
    ${baseStyles}
    ${variantStyles[currentVariant]}
    ${sizeStyles[size]}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        className={inputStyles}
        disabled={disabled}
        required={required}
        {...props}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
