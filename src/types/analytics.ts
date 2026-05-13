import type { CategoryId } from './transaction';

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';

export interface SpendingTrend {
  date: string;
  amount: number;
  count: number;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  categoryId: CategoryId;
  categoryName: string;
  total: number;
  count: number;
  percentage: number;
  trend: number;
  color: string;
  icon: string;
}

export interface MerchantBreakdown {
  merchantName: string;
  total: number;
  count: number;
  percentage: number;
  lastTransactionDate: string;
}

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyNet: number;
  savingsRate: number;
  comparedToLastMonth: {
    income: number;
    expense: number;
    percentage: number;
  };
  topSpendingCategory: CategoryBreakdown | null;
  recentTransactionCount: number;
}

export interface AnalyticsReport {
  period: AnalyticsPeriod;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  transactionCount: number;
  trends: SpendingTrend[];
  categoryBreakdown: CategoryBreakdown[];
  topMerchants: MerchantBreakdown[];
  averageTransactionAmount: number;
  largestExpense: number;
  largestIncome: number;
  mostFrequentCategory: CategoryId;
}

export interface Insight {
  id: string;
  userId: string;
  type:
    | 'anomaly'
    | 'prediction'
    | 'subscription'
    | 'savings_opportunity'
    | 'budget_alert'
    | 'milestone'
    | 'recommendation';
  title: string;
  description: string;
  data?: Record<string, unknown>;
  actionable: boolean;
  action?: {
    label: string;
    route: string;
    params?: Record<string, unknown>;
  };
  severity: 'info' | 'warning' | 'success' | 'critical';
  isRead: boolean;
  isDismissed: boolean;
  createdAt: Date | string;
  expiresAt?: Date | string;
}

export interface Subscription {
  id: string;
  userId: string;
  merchantName: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextBillingDate?: Date | string;
  categoryId: CategoryId;
  isActive: boolean;
  confidence: number;
  transactionIds: string[];
  detectedAt: Date | string;
}
