import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle, Target } from 'lucide-react-native';
import { useTodos } from '@/hooks/useTodos';
import { COLORS } from '@/utils/constants';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { stats, allTodos, categories } = useTodos();

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const getCategoryStats = () => {
    return categories.map(category => {
      const categoryTodos = allTodos.filter(todo => todo.category.id === category.id);
      const completed = categoryTodos.filter(todo => todo.completed).length;
      return {
        ...category,
        total: categoryTodos.length,
        completed,
        percentage: categoryTodos.length > 0 ? (completed / categoryTodos.length) * 100 : 0,
      };
    }).filter(cat => cat.total > 0);
  };

  const getRecentActivity = () => {
    return allTodos
      .filter(todo => {
        const daysDiff = (new Date().getTime() - todo.updatedAt.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 7;
      })
      .length;
  };

  const categoryStats = getCategoryStats();
  const recentActivity = getRecentActivity();

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = COLORS.primary,
    backgroundColor = COLORS.surface 
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    backgroundColor?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
    <View style={styles.progressBarContainer}>
      <View 
        style={[
          styles.progressBar, 
          { width: `${Math.min(percentage, 100)}%`, backgroundColor: color }
        ]} 
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BarChart3 size={32} color={COLORS.primary} />
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Track your productivity</Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={Target}
              title="Total Tasks"
              value={stats.total}
              color={COLORS.primary}
            />
            <StatCard
              icon={CheckCircle}
              title="Completed"
              value={stats.completed}
              color={COLORS.success}
            />
            <StatCard
              icon={Clock}
              title="Pending"
              value={stats.pending}
              color={COLORS.warning}
            />
            <StatCard
              icon={AlertTriangle}
              title="Overdue"
              value={stats.overdue}
              color={COLORS.error}
            />
          </View>
        </View>

        {/* Completion Rate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completion Rate</Text>
          <View style={styles.completionCard}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionPercentage}>
                {completionRate.toFixed(1)}%
              </Text>
              <Text style={styles.completionLabel}>of tasks completed</Text>
            </View>
            <ProgressBar percentage={completionRate} color={COLORS.success} />
          </View>
        </View>

        {/* Category Breakdown */}
        {categoryStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoryList}>
              {categoryStats.map((category) => (
                <View key={category.id} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                      <View 
                        style={[styles.categoryDot, { backgroundColor: category.color }]} 
                      />
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <Text style={styles.categoryCount}>
                      {category.completed}/{category.total}
                    </Text>
                  </View>
                  <ProgressBar percentage={category.percentage} color={category.color} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityValue}>{recentActivity}</Text>
            <Text style={styles.activityLabel}>tasks updated this week</Text>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.section}>
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>
              {completionRate >= 80 
                ? "🎉 Excellent work! You're crushing your goals!"
                : completionRate >= 60
                ? "💪 Great progress! Keep up the good work!"
                : completionRate >= 40
                ? "🚀 You're getting there! Stay focused!"
                : stats.total > 0
                ? "⭐ Every task completed is a step forward!"
                : "✨ Ready to start your productivity journey?"
              }
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  completionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  completionPercentage: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.success,
  },
  completionLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryList: {
    gap: 16,
  },
  categoryItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  motivationCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpace: {
    height: 20,
  },
});