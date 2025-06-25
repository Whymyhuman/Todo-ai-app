import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Check, Trash2, CreditCard as Edit3, Clock } from 'lucide-react-native';
import { Todo } from '@/types/todo';
import { COLORS } from '@/utils/constants';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle(todo.id);
  };

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.todoItem,
          todo.completed && styles.completedItem,
          isOverdue && styles.overdueItem,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          <View style={[
            styles.checkbox,
            todo.completed && styles.checkedBox,
            { borderColor: todo.category.color }
          ]}>
            {todo.completed && (
              <Check size={16} color="#ffffff" strokeWidth={3} />
            )}
          </View>
          
          <View style={styles.contentSection}>
            <Text style={[
              styles.title,
              todo.completed && styles.completedTitle
            ]}>
              {todo.title}
            </Text>
            
            {todo.description && (
              <Text style={[
                styles.description,
                todo.completed && styles.completedDescription
              ]}>
                {todo.description}
              </Text>
            )}
            
            <View style={styles.metaSection}>
              <View style={[styles.categoryBadge, { backgroundColor: todo.category.color }]}>
                <Text style={styles.categoryText}>{todo.category.name}</Text>
              </View>
              
              <View style={[styles.priorityBadge, { backgroundColor: todo.priority.color }]}>
                <Text style={styles.priorityText}>{todo.priority.name}</Text>
              </View>
              
              {todo.dueDate && (
                <View style={[styles.dueDateBadge, isOverdue && styles.overdueBadge]}>
                  <Clock size={12} color={isOverdue ? COLORS.error : COLORS.textSecondary} />
                  <Text style={[styles.dueDateText, isOverdue && styles.overdueText]}>
                    {todo.dueDate.toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(todo)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Edit3 size={18} color={COLORS.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(todo.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  todoItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  completedItem: {
    opacity: 0.7,
    backgroundColor: '#f9fafb',
  },
  overdueItem: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  contentSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  completedDescription: {
    color: COLORS.textLight,
  },
  metaSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  overdueBadge: {
    backgroundColor: '#fef2f2',
  },
  dueDateText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  overdueText: {
    color: COLORS.error,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
});