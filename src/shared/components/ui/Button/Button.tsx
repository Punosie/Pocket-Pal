import React, { useCallback } from 'react';

import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { darkTheme, spacing, borderRadius, spring } from '@/theme';

import { Text } from '../Text/Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = React.memo<ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    label,
    leftIcon,
    rightIcon,
    isLoading = false,
    fullWidth = false,
    disabled,
    onPress,
    ...props
  }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.96, spring.snappy);
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, spring.snappy);
    }, [scale]);

    const handlePress = useCallback(
      (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      },
      [onPress],
    );

    const isDisabled = disabled || isLoading;

    return (
      <AnimatedPressable
        style={[
          animatedStyle,
          styles.base,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isDisabled, busy: isLoading }}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? '#fff' : darkTheme.brand.primary}
          />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <Text
              variant={size === 'sm' ? 'labelMd' : 'labelLg'}
              color={
                variant === 'primary' || variant === 'danger' ? '#fff' : darkTheme.brand.primary
              }
            >
              {label}
            </Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </View>
        )}
      </AnimatedPressable>
    );
  },
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: { marginRight: spacing[2] },
  iconRight: { marginLeft: spacing[2] },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  // Variants
  primary: {
    backgroundColor: darkTheme.brand.primary,
    shadowColor: darkTheme.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  secondary: {
    backgroundColor: darkTheme.background.glass,
    borderWidth: 1,
    borderColor: darkTheme.border.default,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: darkTheme.status.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: darkTheme.brand.primary,
  },

  // Sizes
  sm: {
    height: 36,
    paddingHorizontal: spacing[4],
  },
  md: {
    height: 48,
    paddingHorizontal: spacing[6],
  },
  lg: {
    height: 56,
    paddingHorizontal: spacing[8],
  },
});
