import React from 'react';

import { StyleSheet, View } from 'react-native';

import { darkTheme } from '@/theme';
import type { TextVariant } from '@/theme/typography';

import { Text } from '../Text/Text';

interface AmountDisplayProps {
  amount: number;
  type?: 'debit' | 'credit' | 'neutral';
  currency?: string;
  variant?: TextVariant;
  showSign?: boolean;
  hideCents?: boolean;
  style?: object;
}

export const AmountDisplay = React.memo<AmountDisplayProps>(
  ({
    amount,
    type = 'neutral',
    currency = '₹',
    variant = 'amountMd',
    showSign = true,
    hideCents = false,
    style,
  }) => {
    const color = {
      debit: darkTheme.status.danger,
      credit: darkTheme.status.success,
      neutral: darkTheme.text.primary,
    }[type];

    const sign = showSign ? (type === 'debit' ? '−' : type === 'credit' ? '+' : '') : '';

    const formatted = hideCents
      ? Math.abs(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : Math.abs(amount).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

    return (
      <View style={[styles.container, style]}>
        <Text variant={variant} color={color}>
          {sign}
          {currency}
          {formatted}
        </Text>
      </View>
    );
  },
);

AmountDisplay.displayName = 'AmountDisplay';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
