import React, { useState } from 'react';

import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkTheme, spacing, borderRadius } from '@/theme';
import type { AnalyticsPeriod, CategoryBreakdown } from '@/types';
import { queryKeys } from '@infra/query/query-client';
import { AmountDisplay } from '@shared/components/ui/AmountDisplay/AmountDisplay';
import { GlassCard } from '@shared/components/ui/Card/GlassCard';
import { Skeleton } from '@shared/components/ui/Skeleton/Skeleton';
import { Text } from '@shared/components/ui/Text/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PERIODS: { label: string; value: AnalyticsPeriod }[] = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
];

function PeriodSelector({
  selected,
  onSelect,
}: {
  selected: AnalyticsPeriod;
  onSelect: (p: AnalyticsPeriod) => void;
}) {
  return (
    <GlassCard style={styles.periodSelector} padding={spacing[1]}>
      {PERIODS.map((p) => (
        <TouchableOpacity
          key={p.value}
          onPress={() => onSelect(p.value)}
          style={[styles.periodOption, selected === p.value && styles.periodSelected]}
          activeOpacity={0.7}
        >
          <Text variant="labelMd" color={selected === p.value ? '#fff' : darkTheme.text.tertiary}>
            {p.label}
          </Text>
        </TouchableOpacity>
      ))}
    </GlassCard>
  );
}

function CategoryBar({ item, maxAmount }: { item: CategoryBreakdown; maxAmount: number }) {
  const width = (item.total / maxAmount) * (SCREEN_WIDTH - spacing[5] * 2 - spacing[6] * 2 - 80);
  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryInfo}>
        <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
        <Text variant="labelMd" numberOfLines={1} style={styles.categoryName}>
          {item.categoryName}
        </Text>
      </View>
      <View style={styles.barContainer}>
        <MotiView
          from={{ width: 0 }}
          animate={{ width }}
          transition={{ type: 'spring', damping: 24, stiffness: 200, delay: 100 }}
          style={[styles.bar, { backgroundColor: item.color }]}
        />
      </View>
      <AmountDisplay
        amount={item.total}
        type="debit"
        variant="amountXs"
        showSign={false}
        style={styles.categoryAmount}
      />
    </View>
  );
}

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<AnalyticsPeriod>('month');

  const { data: report, isLoading } = useQuery({
    queryKey: queryKeys.analytics.report(period),
    queryFn: async () => ({
      totalIncome: 85000,
      totalExpense: 42350,
      netBalance: 42650,
      savingsRate: 50.2,
      transactionCount: 47,
      categoryBreakdown: [
        {
          categoryId: 'food_dining' as const,
          categoryName: 'Food & Dining',
          total: 8500,
          count: 18,
          percentage: 20,
          trend: 5,
          color: '#FF6B6B',
          icon: '🍽️',
        },
        {
          categoryId: 'shopping' as const,
          categoryName: 'Shopping',
          total: 7200,
          count: 8,
          percentage: 17,
          trend: -10,
          color: '#4ECDC4',
          icon: '🛍️',
        },
        {
          categoryId: 'transport' as const,
          categoryName: 'Transport',
          total: 4800,
          count: 22,
          percentage: 11,
          trend: 2,
          color: '#45B7D1',
          icon: '🚗',
        },
        {
          categoryId: 'bills_utilities' as const,
          categoryName: 'Bills',
          total: 6500,
          count: 5,
          percentage: 15,
          trend: 0,
          color: '#FFEAA7',
          icon: '💡',
        },
      ],
    }),
    staleTime: 1000 * 60 * 5,
  });

  const maxCategoryAmount = Math.max(...(report?.categoryBreakdown.map((c) => c.total) ?? [1]));

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
          <Text variant="h2">Analytics</Text>
        </MotiView>

        {/* Period Selector */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 80 }}
        >
          <PeriodSelector selected={period} onSelect={setPeriod} />
        </MotiView>

        {/* Summary Cards */}
        {isLoading ? (
          <View style={styles.summaryGrid}>
            <Skeleton height={100} borderRadiusSize="2xl" style={{ flex: 1 }} />
            <Skeleton height={100} borderRadiusSize="2xl" style={{ flex: 1 }} />
          </View>
        ) : (
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 120, damping: 24, stiffness: 300 }}
            style={styles.summaryGrid}
          >
            <LinearGradient
              colors={['rgba(16,185,129,0.2)', 'rgba(16,185,129,0.05)']}
              style={styles.summaryCard}
            >
              <Text variant="labelXs" color={darkTheme.text.tertiary}>
                INCOME
              </Text>
              <AmountDisplay
                amount={report?.totalIncome ?? 0}
                type="credit"
                variant="amountMd"
                showSign={false}
              />
              <Text variant="bodyXs" color={darkTheme.status.success}>
                {report?.transactionCount} transactions
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(244,63,94,0.2)', 'rgba(244,63,94,0.05)']}
              style={styles.summaryCard}
            >
              <Text variant="labelXs" color={darkTheme.text.tertiary}>
                EXPENSE
              </Text>
              <AmountDisplay
                amount={report?.totalExpense ?? 0}
                type="debit"
                variant="amountMd"
                showSign={false}
              />
              <Text variant="bodyXs" color={darkTheme.status.danger}>
                {report?.savingsRate.toFixed(0)}% savings rate
              </Text>
            </LinearGradient>
          </MotiView>
        )}

        {/* Category Breakdown */}
        {!isLoading && report && (
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 180, damping: 24, stiffness: 300 }}
          >
            <GlassCard style={styles.categoryCard}>
              <Text variant="h3" style={{ marginBottom: spacing[4] }}>
                By Category
              </Text>
              <View style={styles.categoryList}>
                {report.categoryBreakdown.map((item) => (
                  <CategoryBar key={item.categoryId} item={item} maxAmount={maxCategoryAmount} />
                ))}
              </View>
            </GlassCard>
          </MotiView>
        )}

        {/* Savings Rate */}
        {!isLoading && report && (
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 240, damping: 24, stiffness: 300 }}
          >
            <GlassCard glow glowColor={darkTheme.status.success} style={styles.savingsCard}>
              <View style={styles.savingsHeader}>
                <Text variant="h3">Savings Rate</Text>
                <Text variant="amountMd" color={darkTheme.status.success}>
                  {report.savingsRate.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.savingsBarBg}>
                <MotiView
                  from={{ width: '0%' }}
                  animate={{ width: `${report.savingsRate}%` as `${number}%` }}
                  transition={{ type: 'spring', damping: 20, stiffness: 150, delay: 300 }}
                  style={styles.savingsBarFill}
                />
              </View>
              <Text variant="bodyXs" color={darkTheme.text.tertiary}>
                You saved ₹{(report.totalIncome - report.totalExpense).toLocaleString('en-IN')} this{' '}
                {period}
              </Text>
            </GlassCard>
          </MotiView>
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
    paddingTop: spacing[4],
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  periodOption: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  periodSelected: {
    backgroundColor: darkTheme.brand.primary,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  summaryCard: {
    flex: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing[4],
    gap: spacing[1],
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
  },
  categoryCard: {
    padding: spacing[5],
  },
  categoryList: {
    gap: spacing[4],
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    width: 80,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  categoryName: {
    flex: 1,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: darkTheme.background.glass,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  categoryAmount: {
    width: 70,
    justifyContent: 'flex-end',
  },
  savingsCard: {
    gap: spacing[3],
    padding: spacing[5],
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsBarBg: {
    height: 12,
    backgroundColor: darkTheme.background.glass,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  savingsBarFill: {
    height: '100%',
    backgroundColor: darkTheme.status.success,
    borderRadius: borderRadius.full,
  },
});
