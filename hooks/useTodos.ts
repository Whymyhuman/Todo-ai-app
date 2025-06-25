import { useState, useEffect, useCallback } from 'react';
import { Todo, Category, FilterType, TodoStats } from '@/types/todo';
import { StorageService } from '@/utils/storage';
import { DEFAULT_CATEGORIES, PRIORITIES } from '@/utils/constants';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save todos when they change
  useEffect(() => {
    if (!loading) {
      StorageService.saveTodos(todos);
    }
  }, [todos, loading]);

  // Save categories when they change
  useEffect(() => {
    if (!loading) {
      StorageService.saveCategories(categories);
    }
  }, [categories, loading]);

  const loadData = async () => {
    try {
      const [loadedTodos, loadedCategories] = await Promise.all([
        StorageService.getTodos(),
        StorageService.getCategories(),
      ]);

      setTodos(loadedTodos);
      setCategories(loadedCategories.length > 0 ? loadedCategories : DEFAULT_CATEGORIES);
    } catch (error) {
      console.error('Error loading data:', error);
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date() }
        : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  }, []);

  const getFilteredTodos = useCallback(() => {
    let filtered = todos;

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [todos, filter, searchQuery]);

  const getStats = useCallback((): TodoStats => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(todo => 
      todo.dueDate && 
      !todo.completed && 
      new Date(todo.dueDate) < new Date()
    ).length;

    return { total, completed, pending, overdue };
  }, [todos]);

  return {
    todos: getFilteredTodos(),
    allTodos: todos,
    categories,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    stats: getStats(),
    priorities: PRIORITIES,
  };
}