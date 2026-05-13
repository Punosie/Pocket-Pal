import type { CategoryId } from './transaction';

export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type BudgetStatus = 'on_track' | 'warning' | 'exceeded' | 'completed';

export interface Budget {
  id: string;
  userId: string;
  categoryId?: CategoryId;
  name: string;
  amount: number;
  period: BudgetPeriod;
  spentAmount: number;
  remainingAmount: number;
  status: BudgetStatus;
  rollover: boolean;
  rolloverAmount?: number;
  alertThreshold: number;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BudgetInsight {
  budgetId: string;
  projectedSpend: number;
  projectedStatus: BudgetStatus;
  dailyBudgetRemaining: number;
  daysRemaining: number;
  averageDailySpend: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendation: string;
}

export interface SmartBudget {
  categoryId: CategoryId;
  suggestedAmount: number;
  basedOnAverage: number;
  confidence: number;
  reasoning: string;
}
