import React from 'react';

import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { textVariants, darkTheme } from '@/theme';
import type { TextVariant } from '@/theme/typography';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  opacity?: number;
}

export const Text = React.memo<TextProps>(
  ({ variant = 'bodyMd', color, align, opacity, style, children, ...props }) => {
    const variantStyle = textVariants[variant];
    const resolvedColor = color ?? darkTheme.text.primary;

    return (
      <RNText
        style={[
          variantStyle,
          { color: resolvedColor },
          align && { textAlign: align },
          opacity !== undefined && { opacity },
          style,
        ]}
        {...props}
      >
        {children}
      </RNText>
    );
  },
);

Text.displayName = 'Text';
