import * as ExpoSecureStore from 'expo-secure-store';

export const SecureKeys = {
  BIOMETRIC_TOKEN: 'biometric_token',
  REFRESH_TOKEN: 'refresh_token',
  PIN_HASH: 'pin_hash',
  ENCRYPTION_KEY: 'encryption_key',
} as const;

export type SecureKey = (typeof SecureKeys)[keyof typeof SecureKeys];

const defaultOptions: ExpoSecureStore.SecureStoreOptions = {
  requireAuthentication: false,
  keychainAccessible: ExpoSecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const secureStore = {
  async set(
    key: SecureKey,
    value: string,
    options?: ExpoSecureStore.SecureStoreOptions,
  ): Promise<void> {
    await ExpoSecureStore.setItemAsync(key, value, { ...defaultOptions, ...options });
  },

  async get(key: SecureKey): Promise<string | null> {
    try {
      return await ExpoSecureStore.getItemAsync(key, defaultOptions);
    } catch {
      return null;
    }
  },

  async delete(key: SecureKey): Promise<void> {
    await ExpoSecureStore.deleteItemAsync(key);
  },

  async has(key: SecureKey): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  },

  async clearAll(): Promise<void> {
    await Promise.all(Object.values(SecureKeys).map((k) => this.delete(k as SecureKey)));
  },
};
