import React from 'react';

import { StyleSheet, View, type ViewProps } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { darkTheme, borderRadius, spacing } from '@/theme';

interface GlassCardProps extends ViewProps {
  intensity?: 'subtle' | 'default' | 'strong';
  gradient?: boolean;
  glow?: boolean;
  glowColor?: string;
  padding?: number;
  borderless?: boolean;
}

export const GlassCard = React.memo<GlassCardProps>(
  ({
    intensity = 'default',
    gradient = false,
    glow = false,
    glowColor,
    padding = spacing[4],
    borderless = false,
    style,
    children,
    ...props
  }) => {
    const bgColor = {
      subtle: 'rgba(255, 255, 255, 0.03)',
      default: 'rgba(255, 255, 255, 0.06)',
      strong: 'rgba(255, 255, 255, 0.10)',
    }[intensity];

    const glowStyle = glow
      ? {
          shadowColor: glowColor ?? darkTheme.brand.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 12,
        }
      : {};

    if (gradient) {
      return (
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, !borderless && styles.border, glowStyle, { padding }, style]}
          {...(props as object)}
        >
          {children}
        </LinearGradient>
      );
    }

    return (
      <View
        style={[
          styles.base,
          { backgroundColor: bgColor },
          !borderless && styles.border,
          glowStyle,
          { padding },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  },
);

GlassCard.displayName = 'GlassCard';

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  border: {
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
  },
});
