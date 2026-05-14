import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Stack } from 'expo-router';

import { darkTheme, spacing } from '@/theme';
import { Text } from '@shared/components/ui/Text/Text';

export default function ForgotPasswordScreen() {
  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: 'Forgot Password',
          headerShown: true,
          headerStyle: { backgroundColor: darkTheme.background.primary },
          headerTintColor: darkTheme.text.primary,
          headerShadowVisible: false,
        }}
      />
      <Text variant="bodyMd" color={darkTheme.text.secondary} align="center">
        Password reset coming soon
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
    padding: spacing[6],
  },
});
