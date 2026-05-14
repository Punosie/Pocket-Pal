import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Stack, useLocalSearchParams } from 'expo-router';

import { darkTheme, spacing } from '@/theme';
import { Text } from '@shared/components/ui/Text/Text';

export default function BudgetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: 'Budget Detail',
          headerShown: true,
          headerStyle: { backgroundColor: darkTheme.background.secondary },
          headerTintColor: darkTheme.text.primary,
          headerShadowVisible: false,
        }}
      />
      <Text variant="bodyMd" color={darkTheme.text.secondary} align="center">
        Budget {id}
      </Text>
      <Text variant="bodySm" color={darkTheme.text.tertiary} align="center">
        Full budget detail coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: darkTheme.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[6],
  },
});
