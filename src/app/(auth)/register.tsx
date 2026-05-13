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

const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signUpWithEmail(data.email, data.password, data.displayName);
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
      <LinearGradient
        colors={['rgba(108,92,231,0.12)', 'transparent']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing[4], paddingBottom: insets.bottom + spacing[6] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={darkTheme.text.secondary} />
        </TouchableOpacity>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          style={styles.titleSection}
        >
          <Text variant="displaySm">Create account</Text>
          <Text variant="bodySm" color={darkTheme.text.tertiary}>
            Start tracking your finances automatically
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 80, damping: 24, stiffness: 280 }}
          style={styles.formCard}
        >
          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.displayName?.message}
                autoCapitalize="words"
                autoComplete="name"
                leftIcon={
                  <Ionicons name="person-outline" size={18} color={darkTheme.text.tertiary} />
                }
              />
            )}
          />

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
                placeholder="Min. 8 characters"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry={!showPassword}
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Repeat your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                secureTextEntry={!showPassword}
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={18} color={darkTheme.text.tertiary} />
                }
              />
            )}
          />

          <View style={{ marginTop: spacing[2] }}>
            <Button
              label="Create Account"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              fullWidth
            />
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', delay: 300, duration: 400 }}
          style={styles.loginRow}
        >
          <Text variant="bodySm" color={darkTheme.text.tertiary}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text variant="labelMd" color={darkTheme.brand.primary}>
              Sign in
            </Text>
          </TouchableOpacity>
        </MotiView>

        <Text variant="bodyXs" color={darkTheme.text.disabled} align="center">
          By signing up you agree to our Terms of Service and Privacy Policy
        </Text>
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
    gap: spacing[5],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: darkTheme.background.glass,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  titleSection: {
    gap: spacing[2],
  },
  formCard: {
    backgroundColor: darkTheme.background.glass,
    borderRadius: borderRadius['3xl'],
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
    padding: spacing[6],
    gap: spacing[4],
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
