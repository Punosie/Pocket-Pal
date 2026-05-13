import { useRef } from 'react';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Transaction, TransactionFilter } from '@/types';
import { useAuthStore } from '@features/auth/store/auth.store';
import { TransactionsRepository } from '@infra/firebase/firestore/transactions.repository';
import { queryKeys } from '@infra/query/query-client';

import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const PAGE_SIZE = 20;

export function useTransactionsList(filter: TransactionFilter = {}) {
  const uid = useAuthStore((s) => s.user?.uid);
  const repoRef = useRef<TransactionsRepository | null>(null);

  if (uid && !repoRef.current) {
    repoRef.current = new TransactionsRepository(uid);
  }

  return useInfiniteQuery({
    queryKey: queryKeys.transactions.list(filter as Record<string, unknown>),
    queryFn: async ({ pageParam }) => {
      if (!repoRef.current) return { transactions: [], lastDoc: null, hasMore: false };
      return repoRef.current.fetchPage(
        filter,
        PAGE_SIZE,
        pageParam as FirebaseFirestoreTypes.DocumentSnapshot | undefined,
      );
    },
    initialPageParam: undefined as FirebaseFirestoreTypes.DocumentSnapshot | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.lastDoc : undefined),
    enabled: !!uid,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddTransaction() {
  const uid = useAuthStore((s) => s.user?.uid);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
    ) => {
      if (!uid) throw new Error('Not authenticated');
      const repo = new TransactionsRepository(uid);
      return repo.create(transaction);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateTransaction() {
  const uid = useAuthStore((s) => s.user?.uid);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Transaction> }) => {
      if (!uid) throw new Error('Not authenticated');
      const repo = new TransactionsRepository(uid);
      await repo.update(id, updates);
    },
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.transactions.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.transactions.lists() });
    },
  });
}

export function useDeleteTransaction() {
  const uid = useAuthStore((s) => s.user?.uid);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!uid) throw new Error('Not authenticated');
      const repo = new TransactionsRepository(uid);
      await repo.delete(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}
