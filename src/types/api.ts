// 🌐 API и сетевые типы
// Without Words Stroke - API Types

// 🌐 API ответы
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 📊 Аналитика
export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

// 📈 Статистика
export interface Statistics {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  mostUsedFeatures: string[];
  userSatisfaction: number;
  systemUptime: number;
  errorRate: number;
}

// 🔐 Безопасность
export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  bcryptRounds: number;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  corsOrigins: string[];
  allowedHosts: string[];
}

// 🌍 Локализация
export interface LocalizationConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  fallbackLanguage: string;
  namespaceSeparator: string;
  keySeparator: string;
  pluralSeparator: string;
  contextSeparator: string;
}
