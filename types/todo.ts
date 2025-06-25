export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Priority {
  id: string;
  name: string;
  level: number;
  color: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export type FilterType = 'all' | 'active' | 'completed';