import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, Trash2, Info, CircleHelp as HelpCircle, Mail, Star, Smartphone, Palette, Bell } from 'lucide-react-native';
import { COLORS } from '@/utils/constants';
import { useTodos } from '@/hooks/useTodos';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { allTodos, stats } = useTodos();

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your tasks and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['@todos', '@categories']);
              Alert.alert('Success', 'All data has been cleared. Please restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature allows you to backup your tasks. In a full implementation, this would generate a file you can save or share.',
      [{ text: 'OK' }]
    );
  };

  const handleContact = () => {
    Alert.alert(
      'Contact Support',
      'Need help? In a production app, this would open your email client or support system.',
      [{ text: 'OK' }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate App',
      'Thank you for using our Todo app! In a production app, this would open the app store for rating.',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    danger = false,
    rightText,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
    rightText?: string;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.settingIconContainer,
        { backgroundColor: danger ? COLORS.error + '15' : COLORS.primary + '15' }
      ]}>
        <Icon size={20} color={danger ? COLORS.error : COLORS.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && { color: COLORS.error }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      {rightText && (
        <Text style={styles.settingRightText}>{rightText}</Text>
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SettingsIcon size={32} color={COLORS.primary} />
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your app preferences</Text>
        </View>

        {/* App Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round((stats.completed / Math.max(stats.total, 1)) * 100)}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <SectionHeader title="Preferences" />
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={Bell}
              title="Notifications"
              subtitle="Manage reminder settings"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available in a future update.')}
            />
            <SettingItem
              icon={Palette}
              title="Theme"
              subtitle="Light mode"
              onPress={() => Alert.alert('Coming Soon', 'Theme customization will be available in a future update.')}
              rightText="Light"
            />
            <SettingItem
              icon={Smartphone}
              title="App Icon"
              subtitle="Customize your app appearance"
              onPress={() => Alert.alert('Coming Soon', 'App icon customization will be available in a future update.')}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <SectionHeader title="Data Management" />
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={Star}
              title="Export Data"
              subtitle="Backup your tasks"
              onPress={handleExportData}
            />
            <SettingItem
              icon={Trash2}
              title="Clear All Data"
              subtitle="Delete all tasks and settings"
              onPress={handleClearAllData}
              danger
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <SectionHeader title="Support" />
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={HelpCircle}
              title="Help & FAQ"
              subtitle="Get answers to common questions"
              onPress={() => Alert.alert('Help', 'FAQ and help documentation would be available here in a production app.')}
            />
            <SettingItem
              icon={Mail}
              title="Contact Support"
              subtitle="Get help from our team"
              onPress={handleContact}
            />
            <SettingItem
              icon={Star}
              title="Rate App"
              subtitle="Share your feedback"
              onPress={handleRateApp}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <SectionHeader title="About" />
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={Info}
              title="App Version"
              subtitle="1.0.0"
              onPress={() => {}}
              rightText="1.0.0"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for productivity
          </Text>
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
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingsGroup: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  settingRightText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  bottomSpace: {
    height: 20,
  },
});