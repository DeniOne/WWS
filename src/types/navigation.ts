// 🧭 Навигация и роутинг типы
// Without Words Stroke - Navigation Types

import { UserRole } from './user';

// 📱 Навигация
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  role?: UserRole[]; // доступно для ролей
  isExternal?: boolean;
  isCritical?: boolean; // критически важные кнопки
}

// 🚨 SOS запрос
export interface SOSRequest {
  id: string;
  patientId: string;
  type: 'stroke' | 'fall' | 'emergency' | 'other';
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  message?: string;
  status: 'pending' | 'responded' | 'resolved';
  createdAt: Date;
  respondedAt?: Date;
  resolvedAt?: Date;
}

// 📱 PWA
export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui';
  orientation: 'portrait' | 'landscape' | 'any';
  startUrl: string;
  scope: string;
  icons: {
    src: string;
    sizes: string;
    type: string;
  }[];
}

// 🎯 Цели и задачи
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'rehabilitation' | 'social' | 'emotional';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  progress: number; // 0-100
}
