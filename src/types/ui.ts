// 🎨 UI и интерфейс типы
// Without Words Stroke - UI Types

// 🌍 Поддерживаемые языки
export type Language = 'ru' | 'en' | 'vi' | 'zh' | 'ko' | 'ja';

// 🎨 Темы
export type Theme = 'light' | 'dark';

// 🎨 Цветовая палитра
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

// 📱 Breakpoints
export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

// 🎭 Анимации
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  iterationCount?: number | 'infinite';
}

// 🎨 Тема
export interface ThemeConfig {
  name: string;
  colors: ColorPalette;
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    fast: string;
    normal: string;
    slow: string;
  };
}

// 🎨 UI состояния
export interface UIState {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  notifications: Notification[];
}

// 🔔 Уведомления
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// 📊 Доступность
export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  voiceCommands: boolean;
}

// 📱 Устройства
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux';
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'other';
  version: string;
  isTouch: boolean;
  isRetina: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
}

// 🔄 Состояние приложения
export interface AppState {
  user: any | null; // User | null
  theme: Theme;
  language: Language;
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
  accessibility: AccessibilitySettings;
  device: DeviceInfo;
  isOnline: boolean;
  lastSync: Date | null;
}

// 📱 Навигация
export interface NavigationState {
  currentPath: string;
  previousPath: string | null;
  history: string[];
  breadcrumbs: Breadcrumb[];
  isNavigating: boolean;
}

// 🍞 Хлебные крошки
export interface Breadcrumb {
  label: string;
  href: string;
  isActive: boolean;
}
