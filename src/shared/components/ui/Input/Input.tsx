import React, { forwardRef, useCallback } from 'react';

import { StyleSheet, TextInput, type TextInputProps, TouchableOpacity, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { darkTheme, borderRadius, spacing, fontFamilies, fontSize, duration } from '@/theme';

import { Text } from '../Text/Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const Input = forwardRef<TextInput, InputProps>(
  (
    { label, error, hint, leftIcon, rightIcon, onRightIconPress, onFocus, onBlur, style, ...props },
    ref,
  ) => {
    const focusProgress = useSharedValue(0);

    const handleFocus = useCallback(
      (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
        focusProgress.value = withTiming(1, { duration: duration.fast });
        onFocus?.(e);
      },
      [focusProgress, onFocus],
    );

    const handleBlur = useCallback(
      (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
        focusProgress.value = withTiming(0, { duration: duration.fast });
        onBlur?.(e);
      },
      [focusProgress, onBlur],
    );

    const animatedBorderStyle = useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        [
          error ? darkTheme.status.danger : darkTheme.border.default,
          error ? darkTheme.status.danger : darkTheme.brand.primary,
        ],
      ),
    }));

    return (
      <View style={styles.container}>
        {label && (
          <Text variant="labelMd" color={darkTheme.text.secondary} style={styles.label}>
            {label}
          </Text>
        )}

        <AnimatedView
          style={[styles.inputContainer, animatedBorderStyle, error && styles.errorBorder]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[styles.input, leftIcon && styles.inputWithLeft, style]}
            placeholderTextColor={darkTheme.text.disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectionColor={darkTheme.brand.primary}
            cursorColor={darkTheme.brand.primary}
            {...props}
          />

          {rightIcon && (
            <TouchableOpacity
              onPress={() => {
                void Haptics.selectionAsync();
                onRightIconPress?.();
              }}
              style={styles.rightIcon}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </AnimatedView>

        {(error ?? hint) && (
          <Text
            variant="bodySm"
            color={error ? darkTheme.status.danger : darkTheme.text.tertiary}
            style={styles.helperText}
          >
            {error ?? hint}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: { gap: spacing[2] },
  label: { marginBottom: 2 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.background.glass,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: darkTheme.border.default,
    paddingHorizontal: spacing[4],
    height: 52,
  },
  errorBorder: { borderColor: darkTheme.status.danger },
  input: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSize.base,
    color: darkTheme.text.primary,
    paddingVertical: 0,
  },
  inputWithLeft: { marginLeft: spacing[3] },
  leftIcon: { marginRight: spacing[1] },
  rightIcon: { marginLeft: spacing[1] },
  helperText: { marginTop: 2 },
});
