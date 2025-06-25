import { Category, Priority } from '@/types/todo';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Personal',
    color: '#3b82f6',
    icon: 'user',
  },
  {
    id: '2',
    name: 'Work',
    color: '#8b5cf6',
    icon: 'briefcase',
  },
  {
    id: '3',
    name: 'Shopping',
    color: '#06b6d4',
    icon: 'shopping-cart',
  },
  {
    id: '4',
    name: 'Health',
    color: '#10b981',
    icon: 'heart',
  },
];

export const PRIORITIES: Priority[] = [
  {
    id: '1',
    name: 'Low',
    level: 1,
    color: '#6b7280',
  },
  {
    id: '2',
    name: 'Medium',
    level: 2,
    color: '#f59e0b',
  },
  {
    id: '3',
    name: 'High',
    level: 3,
    color: '#ef4444',
  },
];

export const COLORS = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  primaryDark: '#1d4ed8',
  secondary: '#6b7280',
  success: '#16a34a',
  warning: '#ea580c',
  error: '#dc2626',
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e5e7eb',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
};