import { darkTheme } from '@/theme';
import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'food_dining',
    name: 'Food & Dining',
    icon: '🍽️',
    color: darkTheme.category.food_dining,
    type: 'expense',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: darkTheme.category.shopping,
    type: 'expense',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚗',
    color: darkTheme.category.transport,
    type: 'expense',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: darkTheme.category.entertainment,
    type: 'expense',
  },
  {
    id: 'bills_utilities',
    name: 'Bills & Utilities',
    icon: '💡',
    color: darkTheme.category.bills_utilities,
    type: 'expense',
  },
  {
    id: 'health_medical',
    name: 'Health & Medical',
    icon: '💊',
    color: darkTheme.category.health_medical,
    type: 'expense',
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: darkTheme.category.education,
    type: 'expense',
  },
  { id: 'travel', name: 'Travel', icon: '✈️', color: darkTheme.category.travel, type: 'expense' },
  {
    id: 'grocery',
    name: 'Grocery',
    icon: '🛒',
    color: darkTheme.category.grocery,
    type: 'expense',
  },
  { id: 'fuel', name: 'Fuel', icon: '⛽', color: darkTheme.category.fuel, type: 'expense' },
  {
    id: 'housing_rent',
    name: 'Housing & Rent',
    icon: '🏠',
    color: darkTheme.category.housing_rent,
    type: 'expense',
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: '📈',
    color: darkTheme.category.investments,
    type: 'both',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    color: darkTheme.category.insurance,
    type: 'expense',
  },
  {
    id: 'personal_care',
    name: 'Personal Care',
    icon: '💆',
    color: darkTheme.category.personal_care,
    type: 'expense',
  },
  {
    id: 'gifts_donations',
    name: 'Gifts & Donations',
    icon: '🎁',
    color: darkTheme.category.gifts_donations,
    type: 'expense',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: '🔄',
    color: darkTheme.category.subscriptions,
    type: 'expense',
  },
  { id: 'salary', name: 'Salary', icon: '💰', color: darkTheme.category.salary, type: 'income' },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: '💻',
    color: darkTheme.category.freelance,
    type: 'income',
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    color: darkTheme.category.business,
    type: 'income',
  },
  { id: 'refund', name: 'Refund', icon: '↩️', color: darkTheme.category.refund, type: 'income' },
  {
    id: 'cashback',
    name: 'Cashback',
    icon: '🎯',
    color: darkTheme.category.cashback,
    type: 'income',
  },
  {
    id: 'transfer_in',
    name: 'Transfer In',
    icon: '📥',
    color: darkTheme.category.transfer_in,
    type: 'income',
  },
  {
    id: 'transfer_out',
    name: 'Transfer Out',
    icon: '📤',
    color: darkTheme.category.transfer_out,
    type: 'expense',
  },
  { id: 'other', name: 'Other', icon: '💳', color: darkTheme.category.other, type: 'both' },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  string,
  Category
>;

export const EXPENSE_CATEGORIES = CATEGORIES.filter(
  (c) => c.type === 'expense' || c.type === 'both',
);
export const INCOME_CATEGORIES = CATEGORIES.filter((c) => c.type === 'income' || c.type === 'both');
