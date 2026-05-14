import React, { useEffect } from 'react';

import { StyleSheet } from 'react-native';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { darkTheme } from '@/theme';
import type { UserProfile } from '@/types';
import { useAuthStore } from '@features/auth/store/auth.store';
import { authService } from '@infra/firebase/auth/auth.service';
import { userRepository } from '@infra/firebase/firestore/user.repository';
import { queryClient } from '@infra/query/query-client';

SplashScreen.preventAutoHideAsync();

function buildFallbackProfile(firebaseUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
}): UserProfile {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    phoneNumber: firebaseUser.phoneNumber,
    isEmailVerified: firebaseUser.emailVerified,
    createdAt: new Date(),
    lastSeenAt: new Date(),
    onboardingCompleted: false,
    onboardingStep: 'welcome',
    preferences: {
      currency: 'INR',
      locale: 'en-IN',
      theme: 'dark',
      useBiometrics: false,
      notificationsEnabled: true,
      smsParsingEnabled: true,
      backgroundSyncEnabled: true,
      hideSensitiveAmounts: false,
      defaultView: 'monthly',
    },
    totalTransactions: 0,
    totalBanksLinked: 0,
    isPremium: false,
  };
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized, setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await userRepository.getProfile(firebaseUser.uid);
          setUser(profile ?? buildFallbackProfile(firebaseUser));
        } catch {
          // Firestore unavailable — use basic auth info so user can still access the app
          setUser(buildFallbackProfile(firebaseUser));
        }
      } else {
        setUser(null);
      }
      setInitialized(true);
    });

    return unsubscribe;
  }, [setUser, setInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }

    void SplashScreen.hideAsync();
  }, [isAuthenticated, isInitialized, segments, router]);

  if (!isInitialized) return null;

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthGate>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: darkTheme.background.primary },
                animation: 'fade_from_bottom',
                animationDuration: 300,
              }}
            >
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen
                name="transaction/[id]"
                options={{ presentation: 'card', animation: 'slide_from_right' }}
              />
            </Stack>
          </AuthGate>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
