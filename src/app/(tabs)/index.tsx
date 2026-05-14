import React, { useCallback } from 'react';

import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkTheme, spacing, borderRadius } from '@/theme';
import type { Transaction } from '@/types';
import { useAuthStore } from '@features/auth/store/auth.store';
import { queryKeys } from '@infra/query/query-client';
import { TransactionCard } from '@shared/components/transactions/TransactionCard';
import { AmountDisplay } from '@shared/components/ui/AmountDisplay/AmountDisplay';
import { GlassCard } from '@shared/components/ui/Card/GlassCard';
import { Skeleton } from '@shared/components/ui/Skeleton/Skeleton';
import { Text } from '@shared/components/ui/Text/Text';

function BalanceCard({ income, expense }: { income: number; expense: number }) {
  const net = income - expense;
  return (
    <LinearGradient
      colors={['rgba(108,92,231,0.4)', 'rgba(108,92,231,0.1)', 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceCard}
    >
      <View style={styles.balanceHeader}>
        <Text variant="labelMd" color={darkTheme.text.secondary}>
          This Month
        </Text>
        <Text variant="bodyXs" color={darkTheme.text.tertiary}>
          May 2025
        </Text>
      </View>

      <AmountDisplay
        amount={net}
        type={net >= 0 ? 'credit' : 'debit'}
        variant="amountXl"
        showSign={false}
      />
      <Text variant="labelSm" color={darkTheme.text.tertiary} style={{ marginTop: 4 }}>
        Net Balance
      </Text>

      <View style={styles.incomeExpenseRow}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: darkTheme.status.success }]} />
          <View>
            <Text variant="labelXs" color={darkTheme.text.tertiary}>
              Income
            </Text>
            <AmountDisplay amount={income} type="credit" variant="amountXs" showSign={false} />
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: darkTheme.status.danger }]} />
          <View>
            <Text variant="labelXs" color={darkTheme.text.tertiary}>
              Expenses
            </Text>
            <AmountDisplay amount={expense} type="debit" variant="amountXs" showSign={false} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.quickActionIcon}>
        <Text variant="bodyLg">{icon}</Text>
      </View>
      <Text variant="labelSm" color={darkTheme.text.secondary} align="center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [refreshing, setRefreshing] = React.useState(false);

  const {
    data: recentTransactions,
    isLoading: loadingTx,
    refetch: refetchTx,
  } = useQuery<Transaction[]>({
    queryKey: queryKeys.transactions.recent(),
    queryFn: async () => [],
    staleTime: 1000 * 60 * 2,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchTx();
    setRefreshing(false);
  }, [refetchTx]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
            tintColor={darkTheme.brand.primary}
          />
        }
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          style={styles.header}
        >
          <View>
            <Text variant="bodySm" color={darkTheme.text.tertiary}>
              {greeting()},
            </Text>
            <Text variant="h2">{user?.displayName?.split(' ')[0] ?? 'there'} 👋</Text>
          </View>

          <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={22} color={darkTheme.text.secondary} />
          </TouchableOpacity>
        </MotiView>

        {/* Balance Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 80, damping: 24, stiffness: 280 }}
        >
          <BalanceCard income={85000} expense={42350} />
        </MotiView>

        {/* Quick Actions */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 140, damping: 24, stiffness: 300 }}
        >
          <GlassCard style={styles.quickActionsCard}>
            <QuickAction icon="➕" label="Add" onPress={() => router.push('/add-transaction')} />
            <QuickAction
              icon="📊"
              label="Analytics"
              onPress={() => router.push('/(tabs)/analytics')}
            />
            <QuickAction icon="🎯" label="Budget" onPress={() => router.push('/(tabs)/budget')} />
            <QuickAction
              icon="🔍"
              label="Search"
              onPress={() => router.push('/(tabs)/transactions')}
            />
          </GlassCard>
        </MotiView>

        {/* Recent Transactions */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 200, damping: 24, stiffness: 300 }}
        >
          <View style={styles.sectionHeader}>
            <Text variant="h3">Recent</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text variant="labelMd" color={darkTheme.brand.primary}>
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {loadingTx ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  height={72}
                  borderRadiusSize="xl"
                  style={{ marginBottom: spacing[2] }}
                />
              ))
            ) : recentTransactions?.length ? (
              recentTransactions.map((tx, i) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  index={i}
                  onPress={(t) =>
                    router.push({ pathname: '/transaction/[id]', params: { id: t.id } })
                  }
                />
              ))
            ) : (
              <GlassCard style={styles.emptyCard}>
                <Text variant="bodyLg" align="center">
                  💸
                </Text>
                <Text variant="h4" align="center" style={{ marginTop: spacing[2] }}>
                  No transactions yet
                </Text>
                <Text variant="bodySm" color={darkTheme.text.tertiary} align="center">
                  Add your first transaction or grant SMS access to auto-track
                </Text>
              </GlassCard>
            )}
          </View>
        </MotiView>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 88 }]}
        onPress={() => router.push('/add-transaction')}
        activeOpacity={0.85}
      >
        <LinearGradient colors={['#8566FF', '#6C5CE7']} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background.primary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[5],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: darkTheme.background.glass,
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    borderRadius: borderRadius['3xl'],
    padding: spacing[6],
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
    gap: spacing[1],
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  incomeExpenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: darkTheme.border.subtle,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: darkTheme.border.subtle,
    marginHorizontal: spacing[4],
  },
  quickActionsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing[4],
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing[2],
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: darkTheme.background.glass,
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionsList: { gap: spacing[2] },
  emptyCard: {
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[8],
  },
  fab: {
    position: 'absolute',
    right: spacing[5],
    borderRadius: borderRadius.full,
    shadowColor: darkTheme.brand.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  fabGradient: {
    width: 58,
    height: 58,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
