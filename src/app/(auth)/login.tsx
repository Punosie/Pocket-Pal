import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Controller, useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { darkTheme, spacing, borderRadius } from '@/theme';
import { useAuthStore } from '@features/auth/store/auth.store';
import { authService } from '@infra/firebase/auth/auth.service';
import { Button } from '@shared/components/ui/Button/Button';
import { Input } from '@shared/components/ui/Input/Input';
import { Text } from '@shared/components/ui/Text/Text';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signInWithEmail(data.email, data.password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={['rgba(108,92,231,0.15)', 'transparent', 'transparent']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing[6], paddingBottom: insets.bottom + spacing[6] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo & Title */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          style={styles.brandSection}
        >
          <View style={styles.logoContainer}>
            <Text variant="displayXl" align="center">
              💰
            </Text>
          </View>
          <Text variant="displayMd" align="center">
            Pocket Pal
          </Text>
          <Text variant="bodySm" color={darkTheme.text.tertiary} align="center">
            Your AI-powered finance companion
          </Text>
        </MotiView>

        {/* Form */}
        <MotiView
          from={{ opacity: 0, translateY: 24 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 120, damping: 24, stiffness: 280 }}
          style={styles.formCard}
        >
          <Text variant="h3" style={{ marginBottom: spacing[5] }}>
            Welcome back
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon={
                  <Ionicons name="mail-outline" size={18} color={darkTheme.text.tertiary} />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry={!showPassword}
                autoComplete="password"
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={18} color={darkTheme.text.tertiary} />
                }
                rightIcon={
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={darkTheme.text.tertiary}
                  />
                }
                onRightIconPress={() => setShowPassword((v) => !v)}
              />
            )}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotPassword}
          >
            <Text variant="labelMd" color={darkTheme.brand.primary}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <Button
            label="Sign In"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            fullWidth
            style={{ marginTop: spacing[2] }}
          />
        </MotiView>

        {/* Sign up link */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', delay: 300, duration: 400 }}
          style={styles.signupRow}
        >
          <Text variant="bodySm" color={darkTheme.text.tertiary}>
            {"Don't have an account?"}{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text variant="labelMd" color={darkTheme.brand.primary}>
              Sign up
            </Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: darkTheme.background.primary,
  },
  scroll: {
    paddingHorizontal: spacing[5],
    gap: spacing[6],
  },
  brandSection: {
    alignItems: 'center',
    gap: spacing[2],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius['3xl'],
    backgroundColor: 'rgba(108,92,231,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(108,92,231,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  formCard: {
    backgroundColor: darkTheme.background.glass,
    borderRadius: borderRadius['3xl'],
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
    padding: spacing[6],
    gap: spacing[4],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing[2],
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
