import React, { useCallback } from 'react';

import { Pressable, StyleSheet, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

import { categoryColors, darkTheme, borderRadius, spacing } from '@/theme';
import type { Transaction } from '@/types';

import { AmountDisplay } from '../ui/AmountDisplay/AmountDisplay';
import { Text } from '../ui/Text/Text';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
  index?: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  food_dining: '🍽️',
  shopping: '🛍️',
  transport: '🚗',
  entertainment: '🎬',
  bills_utilities: '💡',
  health_medical: '💊',
  education: '📚',
  travel: '✈️',
  grocery: '🛒',
  fuel: '⛽',
  housing_rent: '🏠',
  investments: '📈',
  insurance: '🛡️',
  personal_care: '💆',
  gifts_donations: '🎁',
  salary: '💰',
  freelance: '💻',
  business: '💼',
  refund: '↩️',
  cashback: '🎯',
  transfer_in: '📥',
  transfer_out: '📤',
  subscriptions: '🔄',
  other: '💳',
};

export const TransactionCard = React.memo<TransactionCardProps>(
  ({ transaction, onPress, index = 0 }) => {
    const handlePress = useCallback(() => {
      void Haptics.selectionAsync();
      onPress?.(transaction);
    }, [onPress, transaction]);

    const categoryColor = categoryColors[transaction.categoryId] ?? darkTheme.text.tertiary;
    const categoryIcon = CATEGORY_ICONS[transaction.categoryId] ?? '💳';

    const date = new Date(transaction.date);
    const timeStr = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return (
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: index * 40, damping: 24, stiffness: 300 }}
      >
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [styles.container, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${transaction.merchantName}, ${transaction.type === 'debit' ? 'expense' : 'income'}, ${transaction.amount}`}
        >
          {/* Category indicator dot */}
          <View style={[styles.categoryDot, { backgroundColor: categoryColor + '22' }]}>
            <Text variant="bodyLg">{categoryIcon}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text variant="labelLg" numberOfLines={1} style={styles.merchantName}>
                {transaction.merchantName}
              </Text>
              <AmountDisplay
                amount={transaction.amount}
                type={transaction.type === 'credit' ? 'credit' : 'debit'}
                variant="amountSm"
                showSign
              />
            </View>

            <View style={styles.bottomRow}>
              <Text variant="bodyXs" color={darkTheme.text.tertiary} numberOfLines={1}>
                {transaction.bankAccount?.bankName ?? 'Unknown Bank'} · {timeStr}
              </Text>
              {transaction.isRecurring && (
                <View style={styles.recurringBadge}>
                  <Text variant="labelXs" color={darkTheme.brand.primary}>
                    🔄 Recurring
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Category accent */}
          <View style={[styles.accentBar, { backgroundColor: categoryColor }]} />
        </Pressable>
      </MotiView>
    );
  },
);

TransactionCard.displayName = 'TransactionCard';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.background.glass,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
    padding: spacing[3],
    gap: spacing[3],
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  categoryDot: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: spacing[1],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[2],
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  merchantName: {
    flex: 1,
  },
  recurringBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    backgroundColor: darkTheme.status.infoBg,
    borderRadius: borderRadius.full,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
  },
});
