import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Stack } from 'expo-router';

import { darkTheme, spacing } from '@/theme';
import { Text } from '@shared/components/ui/Text/Text';

export default function AboutScreen() {
  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: 'About Pocket Pal',
          headerShown: true,
          headerStyle: { backgroundColor: darkTheme.background.secondary },
          headerTintColor: darkTheme.text.primary,
          headerShadowVisible: false,
        }}
      />
      <Text variant="displayMd" align="center">
        💰
      </Text>
      <Text variant="h3" align="center">
        Pocket Pal
      </Text>
      <Text variant="bodyMd" color={darkTheme.text.secondary} align="center">
        Version 1.0.0
      </Text>
      <Text variant="bodySm" color={darkTheme.text.tertiary} align="center">
        Your AI-powered finance companion
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
