import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes in cache
      retry: (failureCount, error) => {
        if ((error as { status?: number }).status === 404) return false;
        if ((error as { status?: number }).status === 403) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

export const queryKeys = {
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (filter: Record<string, unknown>) =>
      [...queryKeys.transactions.lists(), { filter }] as const,
    detail: (id: string) => [...queryKeys.transactions.all, 'detail', id] as const,
    recent: () => [...queryKeys.transactions.all, 'recent'] as const,
    summary: (period: string) => [...queryKeys.transactions.all, 'summary', period] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    report: (period: string, start?: string, end?: string) =>
      [...queryKeys.analytics.all, 'report', period, start, end] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    trends: (period: string) => [...queryKeys.analytics.all, 'trends', period] as const,
  },
  budgets: {
    all: ['budgets'] as const,
    list: () => [...queryKeys.budgets.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.budgets.all, 'detail', id] as const,
    insights: (id: string) => [...queryKeys.budgets.all, 'insights', id] as const,
  },
  insights: {
    all: ['insights'] as const,
    list: () => [...queryKeys.insights.all, 'list'] as const,
    subscriptions: () => [...queryKeys.insights.all, 'subscriptions'] as const,
  },
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
  },
} as const;
