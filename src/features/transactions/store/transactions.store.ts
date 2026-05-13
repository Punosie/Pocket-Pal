import { subscribeWithSelector } from 'zustand/middleware';
import { create } from 'zustand/react';

import type { Transaction, TransactionFilter } from '@/types';

interface TransactionsState {
  transactions: Transaction[];
  recentTransactions: Transaction[];
  filter: TransactionFilter;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  hasMore: boolean;
  totalCount: number;

  setTransactions: (transactions: Transaction[]) => void;
  setRecentTransactions: (transactions: Transaction[]) => void;
  appendTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  setFilter: (filter: Partial<TransactionFilter>) => void;
  resetFilter: () => void;
  setLoading: (loading: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setLastSyncedAt: (date: Date) => void;
  reset: () => void;
}

const DEFAULT_FILTER: TransactionFilter = {};

export const useTransactionsStore = create<TransactionsState>()(
  subscribeWithSelector((set) => ({
    transactions: [],
    recentTransactions: [],
    filter: DEFAULT_FILTER,
    isLoading: false,
    isSyncing: false,
    lastSyncedAt: null,
    hasMore: true,
    totalCount: 0,

    setTransactions: (transactions) => set({ transactions }),

    setRecentTransactions: (recentTransactions) => set({ recentTransactions }),

    appendTransactions: (newTxs) =>
      set((state) => ({
        transactions: [...state.transactions, ...newTxs],
      })),

    addTransaction: (transaction) =>
      set((state) => ({
        transactions: [transaction, ...state.transactions],
        recentTransactions: [transaction, ...state.recentTransactions].slice(0, 10),
        totalCount: state.totalCount + 1,
      })),

    updateTransaction: (id, updates) =>
      set((state) => ({
        transactions: state.transactions.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx)),
        recentTransactions: state.recentTransactions.map((tx) =>
          tx.id === id ? { ...tx, ...updates } : tx,
        ),
      })),

    removeTransaction: (id) =>
      set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id),
        recentTransactions: state.recentTransactions.filter((tx) => tx.id !== id),
        totalCount: Math.max(0, state.totalCount - 1),
      })),

    setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),

    resetFilter: () => set({ filter: DEFAULT_FILTER }),

    setLoading: (isLoading) => set({ isLoading }),

    setSyncing: (isSyncing) => set({ isSyncing }),

    setHasMore: (hasMore) => set({ hasMore }),

    setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),

    reset: () =>
      set({
        transactions: [],
        recentTransactions: [],
        filter: DEFAULT_FILTER,
        isLoading: false,
        hasMore: true,
        totalCount: 0,
      }),
  })),
);

// Selectors
export const selectTransactions = (s: TransactionsState) => s.transactions;
export const selectRecentTransactions = (s: TransactionsState) => s.recentTransactions;
export const selectFilter = (s: TransactionsState) => s.filter;
export const selectIsLoading = (s: TransactionsState) => s.isLoading;
