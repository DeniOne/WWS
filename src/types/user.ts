// 👤 Типы пользователей и ролей
// Without Words Stroke - User Types

// 👤 Типы пользователей (5 ролей)
export type UserRole = 'patient' | 'family' | 'doctor' | 'volunteer' | 'partner' | 'admin';

// 🎨 Цветовые схемы для ролей
export const ROLE_COLORS: Record<UserRole, string> = {
  patient: '#4A90E2',    // Синий - спокойствие
  family: '#7ED321',     // Зеленый - поддержка
  doctor: '#6C757D',     // Серый - профессионализм
  volunteer: '#FFD93D',  // Желтый - активность
  partner: '#FF6B6B',    // Красный - важность
  admin: '#212529'       // Темно-серый - управление
};

// 👤 Базовый пользователь
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: string;
  theme: 'light' | 'dark';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// 🏥 Пациент (расширение User)
export interface Patient extends User {
  role: 'patient';
  dateOfBirth: Date;
  strokeDate?: Date;
  medicalHistory: string[];
  emergencyContacts: EmergencyContact[];
  currentMedications: Medication[];
  rehabilitationPlan?: RehabilitationPlan;
}

// 👨‍👩‍👧‍👦 Семья (расширение User)
export interface Family extends User {
  role: 'family';
  relatedPatients: string[]; // ID пациентов
  relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'other';
}

// 👨‍⚕️ Врач (расширение User)
export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  patients: string[]; // ID пациентов
  hospital: string;
  experience: number; // лет опыта
}

// 🤝 Волонтер (расширение User)
export interface Volunteer extends User {
  role: 'volunteer';
  skills: string[];
  availability: Availability[];
  assignedPatients: string[]; // ID пациентов
  rating: number;
}

// 🤝 Партнер (расширение User)
export interface Partner extends User {
  role: 'partner';
  companyName: string;
  services: string[];
  products: string[];
  partnershipType: 'medical' | 'rehabilitation' | 'equipment' | 'other';
}

// 🚨 Экстренные контакты
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

// 💊 Лекарства
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

// 🏥 План реабилитации
export interface RehabilitationPlan {
  id: string;
  patientId: string;
  doctorId: string;
  goals: string[];
  exercises: Exercise[];
  schedule: Schedule[];
  progress: Progress[];
  createdAt: Date;
  updatedAt: Date;
}

// 🏃‍♂️ Упражнения
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'physical' | 'cognitive' | 'speech' | 'emotional';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // минуты
  instructions: string[];
  videoUrl?: string;
}

// 📅 Расписание
export interface Schedule {
  id: string;
  exerciseId: string;
  dayOfWeek: number; // 0-6 (воскресенье-суббота)
  time: string; // HH:MM
  duration: number; // минуты
  isCompleted: boolean;
}

// 📊 Прогресс
export interface Progress {
  id: string;
  exerciseId: string;
  completedAt: Date;
  duration: number; // фактическая длительность
  notes?: string;
  rating?: number; // 1-5
}

// 🎯 Доступность
export interface Availability {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
}
