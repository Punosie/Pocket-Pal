import { useCallback, useEffect, useState } from 'react';

import * as LocalAuthentication from 'expo-local-authentication';

import { storage, StorageKeys } from '@infra/storage/mmkv';

export function useBiometrics() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState<LocalAuthentication.AuthenticationType[]>(
    [],
  );

  useEffect(() => {
    void checkBiometrics();
    setIsEnabled(storage.getBoolean(StorageKeys.BIOMETRICS_ENABLED) ?? false);
  }, []);

  const checkBiometrics = async () => {
    const available = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    setIsAvailable(available);
    setIsEnrolled(enrolled);
    setSupportedTypes(types);
  };

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!isAvailable || !isEnrolled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access Pocket Pal',
      fallbackLabel: 'Use Passcode',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return result.success;
  }, [isAvailable, isEnrolled]);

  const enableBiometrics = useCallback(async (): Promise<boolean> => {
    const success = await authenticate();
    if (success) {
      storage.setBoolean(StorageKeys.BIOMETRICS_ENABLED, true);
      setIsEnabled(true);
    }
    return success;
  }, [authenticate]);

  const disableBiometrics = useCallback(() => {
    storage.setBoolean(StorageKeys.BIOMETRICS_ENABLED, false);
    setIsEnabled(false);
  }, []);

  const canUseBiometrics = isAvailable && isEnrolled;

  const biometricType = supportedTypes.includes(
    LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
  )
    ? 'Face ID'
    : supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
      ? 'Fingerprint'
      : 'Biometrics';

  return {
    isAvailable,
    isEnrolled,
    isEnabled,
    canUseBiometrics,
    biometricType,
    authenticate,
    enableBiometrics,
    disableBiometrics,
  };
}
