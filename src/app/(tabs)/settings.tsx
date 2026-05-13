import React from 'react';

import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkTheme, spacing, borderRadius } from '@/theme';
import { useAuthStore } from '@features/auth/store/auth.store';
import { authService } from '@infra/firebase/auth/auth.service';
import { GlassCard } from '@shared/components/ui/Card/GlassCard';
import { Text } from '@shared/components/ui/Text/Text';

interface SettingRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

function SettingRow({
  icon,
  label,
  subtitle,
  onPress,
  destructive = false,
  showChevron = true,
  rightElement,
}: SettingRowProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.row}>
      <View style={styles.rowIconContainer}>
        <Text variant="bodyLg">{icon}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text
          variant="labelLg"
          color={destructive ? darkTheme.status.danger : darkTheme.text.primary}
        >
          {label}
        </Text>
        {subtitle && (
          <Text variant="bodyXs" color={darkTheme.text.tertiary}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement ??
        (showChevron && (
          <Ionicons name="chevron-forward" size={16} color={darkTheme.text.tertiary} />
        ))}
    </TouchableOpacity>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="labelXs" color={darkTheme.text.tertiary} style={styles.sectionTitle}>
        {title}
      </Text>
      <GlassCard style={styles.sectionCard} padding={0}>
        {children}
      </GlassCard>
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const reset = useAuthStore((s) => s.reset);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await authService.signOut();
          reset();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          style={styles.header}
        >
          <Text variant="h2">Settings</Text>
        </MotiView>

        {/* Profile Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 80, damping: 24, stiffness: 280 }}
        >
          <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.8}>
            <GlassCard gradient glow style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text variant="h2" align="center">
                  {user?.displayName?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text variant="h4">{user?.displayName ?? 'User'}</Text>
                <Text variant="bodySm" color={darkTheme.text.tertiary}>
                  {user?.email ?? ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={darkTheme.text.tertiary} />
            </GlassCard>
          </TouchableOpacity>
        </MotiView>

        {/* Sections */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 140, damping: 24, stiffness: 300 }}
        >
          <SettingSection title="TRACKING">
            <SettingRow
              icon="💬"
              label="SMS Permissions"
              subtitle="Allow SMS reading for auto-tracking"
              onPress={() => router.push('/sms-settings')}
            />
            <View style={styles.separator} />
            <SettingRow
              icon="🔔"
              label="Notifications"
              subtitle="Alerts and reminders"
              onPress={() => router.push('/notifications-settings')}
            />
            <View style={styles.separator} />
            <SettingRow
              icon="🔄"
              label="Sync Settings"
              subtitle="Background sync preferences"
              onPress={() => router.push('/sync-settings')}
            />
          </SettingSection>

          <SettingSection title="APPEARANCE">
            <SettingRow
              icon="🎨"
              label="Theme"
              subtitle="Dark (default)"
              onPress={() => router.push('/theme-settings')}
            />
            <View style={styles.separator} />
            <SettingRow
              icon="💱"
              label="Currency"
              subtitle="Indian Rupee (₹)"
              onPress={() => router.push('/currency-settings')}
            />
          </SettingSection>

          <SettingSection title="SECURITY">
            <SettingRow
              icon="🔐"
              label="Biometric Lock"
              subtitle="Use fingerprint or Face ID"
              onPress={() => router.push('/biometric-settings')}
            />
            <View style={styles.separator} />
            <SettingRow
              icon="🔑"
              label="Change Password"
              onPress={() => router.push('/change-password')}
            />
          </SettingSection>

          <SettingSection title="DATA">
            <SettingRow
              icon="📥"
              label="Import Data"
              subtitle="Import from bank statements"
              onPress={() => router.push('/import-data')}
            />
            <View style={styles.separator} />
            <SettingRow
              icon="📤"
              label="Export Data"
              subtitle="Export as CSV or PDF"
              onPress={() => router.push('/export-data')}
            />
            <View style={styles.separator} />
            <SettingRow
              icon="🗑️"
              label="Clear Cache"
              subtitle="Free up storage space"
              onPress={() => Alert.alert('Clear Cache', 'Cache cleared successfully.')}
              showChevron={false}
            />
          </SettingSection>

          <SettingSection title="ABOUT">
            <SettingRow icon="ℹ️" label="About Pocket Pal" onPress={() => router.push('/about')} />
            <View style={styles.separator} />
            <SettingRow icon="🔒" label="Privacy Policy" onPress={() => router.push('/privacy')} />
            <View style={styles.separator} />
            <SettingRow icon="📄" label="Terms of Service" onPress={() => router.push('/terms')} />
            <View style={styles.separator} />
            <SettingRow icon="⭐" label="Rate the App" onPress={() => {}} />
          </SettingSection>

          <SettingSection title="ACCOUNT">
            <SettingRow
              icon="🚪"
              label="Sign Out"
              destructive
              onPress={handleSignOut}
              showChevron={false}
            />
          </SettingSection>

          <Text
            variant="bodyXs"
            color={darkTheme.text.disabled}
            align="center"
            style={{ marginTop: spacing[2] }}
          >
            Pocket Pal v1.0.0 · Made with ❤️ in India
          </Text>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  header: {
    paddingTop: spacing[4],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    backgroundColor: darkTheme.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  section: {
    gap: spacing[2],
  },
  sectionTitle: {
    paddingLeft: spacing[2],
    letterSpacing: 0.8,
  },
  sectionCard: {
    overflow: 'hidden',
    borderRadius: borderRadius['2xl'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: darkTheme.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  separator: {
    height: 1,
    backgroundColor: darkTheme.border.subtle,
    marginLeft: spacing[4] + 36 + spacing[3],
  },
});
