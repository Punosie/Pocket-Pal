import React, { useCallback, useState } from 'react';

import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkTheme, spacing, borderRadius } from '@/theme';
import type { Transaction } from '@/types';
import { queryKeys } from '@infra/query/query-client';
import { TransactionCard } from '@shared/components/transactions/TransactionCard';
import { Input } from '@shared/components/ui/Input/Input';
import { Skeleton } from '@shared/components/ui/Skeleton/Skeleton';
import { Text } from '@shared/components/ui/Text/Text';

function GroupHeader({ date }: { date: string }) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  let label: string;
  if (d.toDateString() === today.toDateString()) label = 'Today';
  else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
  else label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <View style={groupStyles.container}>
      <Text variant="labelSm" color={darkTheme.text.tertiary}>
        {label}
      </Text>
    </View>
  );
}

const groupStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
});

type ListItem = { type: 'header'; date: string } | { type: 'transaction'; data: Transaction };

function groupTransactions(transactions: Transaction[]): ListItem[] {
  const items: ListItem[] = [];
  let lastDate = '';

  for (const tx of transactions) {
    const dateStr = new Date(tx.date).toDateString();
    if (dateStr !== lastDate) {
      items.push({ type: 'header', date: new Date(tx.date).toISOString() });
      lastDate = dateStr;
    }
    items.push({ type: 'transaction', data: tx });
  }

  return items;
}

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: queryKeys.transactions.lists(),
    queryFn: async () => [],
    staleTime: 1000 * 60 * 2,
  });

  const filteredTransactions = transactions.filter((tx) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tx.merchantName.toLowerCase().includes(q) ||
      tx.description?.toLowerCase().includes(q) ||
      tx.notes?.toLowerCase().includes(q)
    );
  });

  const items = groupTransactions(filteredTransactions);

  const renderItem = useCallback(
    ({ item, index }: { item: ListItem; index: number }) => {
      if (item.type === 'header') {
        return <GroupHeader date={item.date} />;
      }
      return (
        <View style={{ paddingHorizontal: spacing[5], marginBottom: spacing[2] }}>
          <TransactionCard
            transaction={item.data}
            index={index}
            onPress={(tx) => router.push(`/transaction/${tx.id}`)}
          />
        </View>
      );
    },
    [router],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        style={styles.header}
      >
        <Text variant="h2">Transactions</Text>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => router.push('/transaction-filter')}
        >
          <Ionicons name="options-outline" size={20} color={darkTheme.text.secondary} />
        </TouchableOpacity>
      </MotiView>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search transactions..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Ionicons name="search-outline" size={18} color={darkTheme.text.tertiary} />}
          rightIcon={
            search ? (
              <Ionicons name="close-circle" size={18} color={darkTheme.text.tertiary} />
            ) : undefined
          }
          onRightIconPress={() => setSearch('')}
          returnKeyType="search"
        />
      </View>

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              height={72}
              borderRadiusSize="xl"
              style={{ marginHorizontal: spacing[5], marginBottom: spacing[2] }}
            />
          ))}
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="displayMd" align="center">
            🔍
          </Text>
          <Text variant="h3" align="center">
            {search ? 'No results found' : 'No transactions'}
          </Text>
          <Text variant="bodySm" color={darkTheme.text.tertiary} align="center">
            {search
              ? 'Try a different search term'
              : 'Your transactions will appear here after adding them'}
          </Text>
        </View>
      ) : (
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, i) =>
            item.type === 'header' ? `header-${item.date}` : (item.data.id ?? String(i))
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          getItemType={(item) => item.type}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: darkTheme.background.glass,
    borderWidth: 1,
    borderColor: darkTheme.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
  },
  skeletonContainer: {
    marginTop: spacing[2],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[8],
  },
});
