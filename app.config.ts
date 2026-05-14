import { withAndroidManifest, withGradleProperties } from '@expo/config-plugins';

import type { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => 'com.pocketpal.app';

const getAppName = () => {
  if (IS_DEV) return 'Pocket Pal (Dev)';
  if (IS_PREVIEW) return 'Pocket Pal (Preview)';
  return 'Pocket Pal';
};

// expo-notifications and @react-native-firebase/messaging both declare
// default_notification_color — add tools:replace so the app value wins.
const withFCMColorFix = (config: ExpoConfig): ExpoConfig =>
  withAndroidManifest(config, (c) => {
    const { manifest } = c.modResults;
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }
    const app = manifest.application?.[0];
    if (!app?.['meta-data']) return c;
    for (const item of app['meta-data']) {
      if (item.$?.['android:name'] === 'com.google.firebase.messaging.default_notification_color') {
        (item.$ as Record<string, string>)['tools:replace'] = 'android:resource';
        break;
      }
    }
    return c;
  });

const withKotlinVersion = (config: ExpoConfig): ExpoConfig =>
  withGradleProperties(config, (c) => {
    c.modResults = c.modResults.filter(
      (item) => !(item.type === 'property' && item.key === 'android.kotlinVersion'),
    );
    c.modResults.push({ type: 'property', key: 'android.kotlinVersion', value: '2.1.20' });
    return c;
  });

export default ({ config }: ConfigContext): ExpoConfig =>
  withFCMColorFix(
    withKotlinVersion({
      ...config,
      name: getAppName(),
      slug: 'pocket-pal',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: 'pocketpal',
      userInterfaceStyle: 'automatic',
      splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#0A0A0F',
      },
      ios: {
        supportsTablet: false,
        bundleIdentifier: getUniqueIdentifier(),
        googleServicesFile: process.env.GOOGLE_SERVICES_PLIST ?? './GoogleService-Info.plist',
        infoPlist: {
          NSCameraUsageDescription: 'Used to scan receipts and financial documents.',
          NSPhotoLibraryUsageDescription: 'Used to attach receipts to transactions.',
          NSFaceIDUsageDescription: 'Used to authenticate securely into Pocket Pal.',
        },
        entitlements: {
          'com.apple.developer.associated-domains': ['applinks:pocketpal.app'],
        },
        config: {
          usesNonExemptEncryption: false,
        },
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/images/adaptive-icon.png',
          backgroundColor: '#0A0A0F',
        },
        package: getUniqueIdentifier(),
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
        permissions: [
          'android.permission.RECEIVE_SMS',
          'android.permission.READ_SMS',
          'android.permission.VIBRATE',
          'android.permission.RECEIVE_BOOT_COMPLETED',
          'android.permission.USE_BIOMETRIC',
          'android.permission.USE_FINGERPRINT',
          'android.permission.CAMERA',
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.WRITE_EXTERNAL_STORAGE',
          'android.permission.INTERNET',
          'android.permission.ACCESS_NETWORK_STATE',
        ],
        intentFilters: [
          {
            action: 'VIEW',
            autoVerify: true,
            data: [{ scheme: 'https', host: 'pocketpal.app', pathPrefix: '/' }],
            category: ['BROWSABLE', 'DEFAULT'],
          },
        ],
      },
      web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
      },
      plugins: [
        'expo-router',
        'expo-secure-store',
        'expo-local-authentication',
        [
          'expo-build-properties',
          {
            android: {
              compileSdkVersion: 36,
              targetSdkVersion: 36,
              minSdkVersion: 24,
              buildToolsVersion: '36.0.0',
              kotlinVersion: '2.1.20',
            },
            ios: {
              deploymentTarget: '15.1',
              useFrameworks: 'static',
            },
          },
        ],
        [
          'expo-notifications',
          {
            icon: './assets/images/notification-icon.png',
            color: '#6C5CE7',
            sounds: ['./assets/sounds/notification.wav'],
          },
        ],
        [
          'expo-splash-screen',
          {
            backgroundColor: '#0A0A0F',
            image: './assets/images/splash.png',
            imageWidth: 200,
          },
        ],
        '@react-native-firebase/app',
        '@react-native-firebase/auth',
        '@react-native-firebase/crashlytics',
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        router: { origin: false },
        eas: { projectId: process.env.EAS_PROJECT_ID ?? 'dedb2f98-35f4-4a1b-a94e-2ef780f011e2' },
        firebaseWebApiKey: process.env.FIREBASE_WEB_API_KEY,
        firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.FIREBASE_APP_ID,
        firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
        appVariant: process.env.APP_VARIANT ?? 'production',
      },
      updates: {
        url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID ?? 'dedb2f98-35f4-4a1b-a94e-2ef780f011e2'}`,
        fallbackToCacheTimeout: 3000,
      },
      runtimeVersion: { policy: 'appVersion' },
      owner: 'shubhankar03',
    } as ExpoConfig),
  );
