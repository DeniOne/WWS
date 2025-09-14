// 📝 Формы и валидация типы
// Without Words Stroke - Forms Types

// 📝 Поля форм
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'date' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
}

// 📝 Состояние формы
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// 📝 Валидация
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

// 📝 Форма регистрации
export interface RegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: string;
  language: string;
  agreeToTerms: boolean;
}

// 📝 Форма входа
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

// 📝 Форма профиля
export interface ProfileForm {
  name: string;
  email: string;
  language: string;
  theme: string;
  avatar?: File;
}

// 📝 Форма SOS
export interface SOSForm {
  type: 'stroke' | 'fall' | 'emergency' | 'other';
  message?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// 📝 Форма обратной связи
export interface FeedbackForm {
  type: 'bug' | 'feature' | 'general' | 'complaint';
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  contactEmail?: string;
}
