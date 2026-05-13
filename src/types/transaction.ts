export type TransactionType = 'debit' | 'credit' | 'transfer';

export type TransactionSource = 'sms' | 'manual' | 'ocr' | 'email' | 'bank_api' | 'import';

export type PaymentMethod =
  | 'upi'
  | 'card_credit'
  | 'card_debit'
  | 'net_banking'
  | 'wallet'
  | 'cash'
  | 'cheque'
  | 'emi'
  | 'other';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'reversed';

export type CategoryId =
  | 'food_dining'
  | 'shopping'
  | 'transport'
  | 'entertainment'
  | 'bills_utilities'
  | 'health_medical'
  | 'education'
  | 'travel'
  | 'grocery'
  | 'fuel'
  | 'housing_rent'
  | 'investments'
  | 'insurance'
  | 'personal_care'
  | 'gifts_donations'
  | 'salary'
  | 'freelance'
  | 'business'
  | 'refund'
  | 'cashback'
  | 'transfer_in'
  | 'transfer_out'
  | 'subscriptions'
  | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
  isCustom?: boolean;
}

export interface Merchant {
  id: string;
  name: string;
  normalizedName: string;
  category?: CategoryId;
  logoUrl?: string;
  isSubscription?: boolean;
  averageAmount?: number;
  transactionCount?: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountType: 'savings' | 'current' | 'credit' | 'wallet';
  maskedNumber?: string;
  cardType?: 'visa' | 'mastercard' | 'rupay' | 'amex' | 'other';
  upiId?: string;
  color?: string;
  logoUrl?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  categoryId: CategoryId;
  merchantName: string;
  merchantId?: string;
  description?: string;
  notes?: string;
  tags?: string[];
  receiptUrls?: string[];
  source: TransactionSource;
  paymentMethod?: PaymentMethod;
  bankAccount?: Partial<BankAccount>;
  referenceId?: string;
  balance?: number;
  smsId?: string;
  rawSmsBody?: string;
  isRecurring?: boolean;
  recurringGroupId?: string;
  isManuallyEdited?: boolean;
  isFlagged?: boolean;
  flagReason?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  date: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  syncedAt?: Date | string;
}

export interface TransactionFilter {
  startDate?: Date;
  endDate?: Date;
  types?: TransactionType[];
  categoryIds?: CategoryId[];
  paymentMethods?: PaymentMethod[];
  bankCodes?: string[];
  minAmount?: number;
  maxAmount?: number;
  isRecurring?: boolean;
  searchQuery?: string;
  tags?: string[];
  sources?: TransactionSource[];
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  averageExpense: number;
  topCategories: {
    categoryId: CategoryId;
    total: number;
    count: number;
    percentage: number;
  }[];
  period: {
    start: Date;
    end: Date;
  };
}
