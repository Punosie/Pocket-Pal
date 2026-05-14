import React from 'react';

import { ScrollView, StyleSheet } from 'react-native';

import { Stack } from 'expo-router';

import { darkTheme, spacing } from '@/theme';
import { Text } from '@shared/components/ui/Text/Text';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: 'Terms of Service',
          headerShown: true,
          headerStyle: { backgroundColor: darkTheme.background.secondary },
          headerTintColor: darkTheme.text.primary,
          headerShadowVisible: false,
        }}
      />
      <Text variant="h3">Terms of Service</Text>
      <Text variant="bodyMd" color={darkTheme.text.secondary}>
        Terms of service content coming soon.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: darkTheme.background.primary,
  },
  content: {
    padding: spacing[6],
    gap: spacing[4],
  },
});
