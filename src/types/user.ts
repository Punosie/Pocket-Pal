export type OnboardingStep =
  | 'welcome'
  | 'permissions'
  | 'sms_scan'
  | 'account_setup'
  | 'budget_setup'
  | 'complete';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type ThemePreference = 'dark' | 'light' | 'system';

export interface UserPreferences {
  currency: CurrencyCode;
  locale: string;
  theme: ThemePreference;
  useBiometrics: boolean;
  notificationsEnabled: boolean;
  smsParsingEnabled: boolean;
  backgroundSyncEnabled: boolean;
  dailyReminderTime?: string;
  weeklyReportDay?: number;
  hideSensitiveAmounts: boolean;
  defaultView: 'monthly' | 'weekly' | 'daily';
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  isEmailVerified: boolean;
  createdAt: Date | string;
  lastSeenAt: Date | string;
  onboardingCompleted: boolean;
  onboardingStep: OnboardingStep;
  preferences: UserPreferences;
  totalTransactions: number;
  totalBanksLinked: number;
  isPremium: boolean;
  premiumExpiresAt?: Date | string;
  referralCode?: string;
  referredBy?: string;
  fcmToken?: string;
}

export interface Device {
  id: string;
  userId: string;
  platform: 'android' | 'ios';
  osVersion: string;
  appVersion: string;
  deviceModel: string;
  fcmToken?: string;
  lastActiveAt: Date | string;
  smsPermissionGranted?: boolean;
  notificationPermissionGranted?: boolean;
}
