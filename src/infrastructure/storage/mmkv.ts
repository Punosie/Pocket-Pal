import { MMKV } from 'react-native-mmkv';

// Separate namespaced stores
export const appStorage = new MMKV({ id: 'app-storage' });
export const cacheStorage = new MMKV({ id: 'cache-storage' });
export const analyticsCache = new MMKV({ id: 'analytics-cache' });
export const offlineQueue = new MMKV({ id: 'offline-queue' });

// Typed wrapper with auto JSON serialization
class TypedStorage {
  constructor(private storage: MMKV) {}

  get<T>(key: string): T | null {
    try {
      const raw = this.storage.getString(key);
      if (raw === undefined) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value));
  }

  delete(key: string): void {
    this.storage.delete(key);
  }

  has(key: string): boolean {
    return this.storage.contains(key);
  }

  clearAll(): void {
    this.storage.clearAll();
  }

  getAllKeys(): string[] {
    return this.storage.getAllKeys();
  }

  getString(key: string): string | null {
    return this.storage.getString(key) ?? null;
  }

  setString(key: string, value: string): void {
    this.storage.set(key, value);
  }

  getBoolean(key: string): boolean | null {
    return this.storage.getBoolean(key) ?? null;
  }

  setBoolean(key: string, value: boolean): void {
    this.storage.set(key, value);
  }

  getNumber(key: string): number | null {
    return this.storage.getNumber(key) ?? null;
  }

  setNumber(key: string, value: number): void {
    this.storage.set(key, value);
  }
}

export const storage = new TypedStorage(appStorage);
export const cache = new TypedStorage(cacheStorage);
export const analyticsStore = new TypedStorage(analyticsCache);
export const queue = new TypedStorage(offlineQueue);

// Typed storage keys — single source of truth
export const StorageKeys = {
  // Auth
  USER_UID: 'user_uid',
  AUTH_PROVIDER: 'auth_provider',
  LAST_ACTIVE: 'last_active',

  // Onboarding
  ONBOARDING_COMPLETE: 'onboarding_complete',
  SMS_PERMISSION_ASKED: 'sms_permission_asked',

  // App state
  SELECTED_PERIOD: 'selected_period',
  DASHBOARD_SCROLL: 'dashboard_scroll',

  // Cache timestamps
  TRANSACTIONS_LAST_SYNC: 'transactions_last_sync',
  ANALYTICS_LAST_SYNC: 'analytics_last_sync',
  INSIGHTS_LAST_SYNC: 'insights_last_sync',

  // Features
  BIOMETRICS_ENABLED: 'biometrics_enabled',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  THEME: 'theme',

  // SMS
  LAST_SMS_PROCESSED_ID: 'last_sms_processed_id',
  SMS_PROCESSED_COUNT: 'sms_processed_count',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
