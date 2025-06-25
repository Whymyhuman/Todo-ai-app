import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, Category } from '@/types/todo';

const TODOS_KEY = '@todos';
const CATEGORIES_KEY = '@categories';

export const StorageService = {
  async getTodos(): Promise<Todo[]> {
    try {
      const todosJson = await AsyncStorage.getItem(TODOS_KEY);
      if (todosJson) {
        const todos = JSON.parse(todosJson);
        return todos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  },

  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_KEY);
      if (categoriesJson) {
        return JSON.parse(categoriesJson);
      }
      return [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  },

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  },
};