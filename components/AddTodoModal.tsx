import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Calendar, Flag } from 'lucide-react-native';
import { Todo, Category, Priority } from '@/types/todo';
import { COLORS } from '@/utils/constants';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  priorities: Priority[];
  editingTodo?: Todo | null;
}

export function AddTodoModal({
  visible,
  onClose,
  onSave,
  categories,
  priorities,
  editingTodo,
}: AddTodoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [selectedPriority, setSelectedPriority] = useState<Priority>(priorities[0]);
  const [dueDate, setDueDate] = useState<Date | undefined>();

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setSelectedCategory(editingTodo.category);
      setSelectedPriority(editingTodo.priority);
      setDueDate(editingTodo.dueDate);
    } else {
      resetForm();
    }
  }, [editingTodo, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedCategory(categories[0]);
    setSelectedPriority(priorities[0]);
    setDueDate(undefined);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: editingTodo?.completed || false,
      category: selectedCategory,
      priority: selectedPriority,
      dueDate,
    });

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingTodo ? 'Edit Task' : 'Add New Task'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor={COLORS.textLight}
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add a description (optional)"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    selectedCategory.id === category.id && styles.selectedCategoryOption,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                  <Text style={[
                    styles.categoryOptionText,
                    selectedCategory.id === category.id && styles.selectedCategoryText
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.id}
                  style={[
                    styles.priorityOption,
                    selectedPriority.id === priority.id && styles.selectedPriorityOption,
                    { borderColor: priority.color }
                  ]}
                  onPress={() => setSelectedPriority(priority)}
                >
                  <Flag 
                    size={16} 
                    color={selectedPriority.id === priority.id ? priority.color : COLORS.textSecondary} 
                  />
                  <Text style={[
                    styles.priorityOptionText,
                    selectedPriority.id === priority.id && { color: priority.color }
                  ]}>
                    {priority.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Due Date (Optional)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                // For now, just set to tomorrow as an example
                // In a real app, you'd integrate a date picker
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setDueDate(tomorrow);
              }}
            >
              <Calendar size={20} color={COLORS.primary} />
              <Text style={styles.dateButtonText}>
                {dueDate ? dueDate.toLocaleDateString() : 'Set due date'}
              </Text>
            </TouchableOpacity>
            {dueDate && (
              <TouchableOpacity
                style={styles.clearDateButton}
                onPress={() => setDueDate(undefined)}
              >
                <Text style={styles.clearDateText}>Clear date</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
    backgroundColor: COLORS.surface,
  },
  selectedCategoryOption: {
    backgroundColor: '#f0f9ff',
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  selectedCategoryText: {
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: COLORS.surface,
    gap: 8,
  },
  selectedPriorityOption: {
    backgroundColor: '#f0f9ff',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  clearDateButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  clearDateText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '500',
  },
});