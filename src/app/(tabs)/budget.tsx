import React from 'react';

import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkTheme, spacing, borderRadius } from '@/theme';
import type { Budget } from '@/types';
import { queryKeys } from '@infra/query/query-client';
import { AmountDisplay } from '@shared/components/ui/AmountDisplay/AmountDisplay';
import { GlassCard } from '@shared/components/ui/Card/GlassCard';
import { Text } from '@shared/components/ui/Text/Text';

function BudgetProgressCard({ budget }: { budget: Budget }) {
  const progress = Math.min(budget.spentAmount / budget.amount, 1);
  const isExceeded = progress >= 1;
  const isWarning = progress >= budget.alertThreshold / 100;

  const progressColor = isExceeded
    ? darkTheme.status.danger
    : isWarning
      ? darkTheme.status.warning
      : darkTheme.status.success;

  return (
    <GlassCard style={styles.budgetCard}>
      <View style={styles.budgetHeader}>
        <View>
          <Text variant="labelLg">{budget.name}</Text>
          <Text variant="bodyXs" color={darkTheme.text.tertiary} style={{ marginTop: 2 }}>
            {budget.period} budget
          </Text>
        </View>
        <AmountDisplay amount={budget.amount} type="neutral" variant="amountSm" showSign={false} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <MotiView
          from={{ width: '0%' }}
          animate={{ width: `${progress * 100}%` as `${number}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 150, delay: 200 }}
          style={[styles.progressFill, { backgroundColor: progressColor }]}
        />
        {/* Threshold marker */}
        <View
          style={[styles.thresholdMarker, { left: `${budget.alertThreshold}%` as `${number}%` }]}
        />
      </View>

      {/* Stats */}
      <View style={styles.budgetStats}>
        <View>
          <Text variant="labelXs" color={darkTheme.text.tertiary}>
            SPENT
          </Text>
          <AmountDisplay
            amount={budget.spentAmount}
            type="debit"
            variant="amountXs"
            showSign={false}
          />
        </View>
        <View>
          <Text variant="labelXs" color={darkTheme.text.tertiary}>
            REMAINING
          </Text>
          <AmountDisplay
            amount={Math.max(0, budget.remainingAmount)}
            type={isExceeded ? 'debit' : 'credit'}
            variant="amountXs"
            showSign={false}
          />
        </View>
        <View style={[styles.statusBadge, { backgroundColor: progressColor + '22' }]}>
          <Text variant="labelXs" color={progressColor}>
            {isExceeded ? 'Exceeded' : isWarning ? 'Warning' : 'On Track'}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: budgets = [], isLoading } = useQuery<Budget[]>({
    queryKey: queryKeys.budgets.list(),
    queryFn: async () =>
      [
        {
          id: '1',
          userId: 'u1',
          name: 'Overall Budget',
          amount: 50000,
          period: 'monthly',
          spentAmount: 42350,
          remainingAmount: 7650,
          status: 'warning',
          rollover: false,
          alertThreshold: 80,
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-05-31'),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'u1',
          categoryId: 'food_dining',
          name: 'Food & Dining',
          amount: 10000,
          period: 'monthly',
          spentAmount: 8500,
          remainingAmount: 1500,
          status: 'warning',
          rollover: false,
          alertThreshold: 80,
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-05-31'),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as Budget[],
  });

  const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spentAmount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          style={styles.header}
        >
          <Text variant="h2">Budget</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-budget')}>
            <Ionicons name="add" size={22} color={darkTheme.brand.primary} />
          </TouchableOpacity>
        </MotiView>

        {/* Summary */}
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 80, damping: 24, stiffness: 280 }}
        >
          <LinearGradient
            colors={['rgba(108,92,231,0.3)', 'rgba(108,92,231,0.05)']}
            style={styles.summaryCard}
          >
            <Text variant="labelMd" color={darkTheme.text.secondary}>
              Monthly Budget Health
            </Text>
            <View style={styles.summaryRow}>
              <View>
                <Text variant="labelXs" color={darkTheme.text.tertiary}>
                  TOTAL BUDGETED
                </Text>
                <AmountDisplay
                  amount={totalBudgeted}
                  type="neutral"
                  variant="amountMd"
                  showSign={false}
                />
              </View>
              <View style={styles.summaryDivider} />
              <View>
                <Text variant="labelXs" color={darkTheme.text.tertiary}>
                  TOTAL SPENT
                </Text>
                <AmountDisplay
                  amount={totalSpent}
                  type="debit"
                  variant="amountMd"
                  showSign={false}
                />
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Budget List */}
        {budgets.map((budget, i) => (
          <MotiView
            key={budget.id}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 140 + i * 60, damping: 24, stiffness: 300 }}
          >
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/budget/[id]', params: { id: budget.id } })}
              activeOpacity={0.9}
            >
              <BudgetProgressCard budget={budget} />
            </TouchableOpacity>
          </MotiView>
        ))}

        {budgets.length === 0 && !isLoading && (
          <GlassCard style={styles.emptyCard}>
            <Text variant="bodyLg" align="center">
              🎯
            </Text>
            <Text variant="h4" align="center">
              No budgets set
            </Text>
            <Text variant="bodySm" color={darkTheme.text.tertiary} align="center">
              Create a budget to track your spending goals
            </Text>
            <TouchableOpacity onPress={() => router.push('/add-budget')} style={styles.createBtn}>
              <Text variant="labelMd" color={darkTheme.brand.primary}>
                Create Budget
              </Text>
            </TouchableOpacity>
          </GlassCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: darkTheme.background.glass,
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    borderRadius: borderRadius['3xl'],
    padding: spacing[5],
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
    gap: spacing[4],
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: darkTheme.border.subtle,
  },
  budgetCard: {
    gap: spacing[3],
    padding: spacing[4],
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressBg: {
    height: 10,
    backgroundColor: darkTheme.background.elevated,
    borderRadius: borderRadius.full,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  thresholdMarker: {
    position: 'absolute',
    top: -3,
    width: 2,
    height: 16,
    backgroundColor: darkTheme.status.warning,
    borderRadius: 1,
  },
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  emptyCard: {
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[8],
  },
  createBtn: {
    marginTop: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius['2xl'],
    borderWidth: 1.5,
    borderColor: darkTheme.brand.primary,
  },
});
