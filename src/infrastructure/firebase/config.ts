import analytics from '@react-native-firebase/analytics';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import messaging from '@react-native-firebase/messaging';
import perf from '@react-native-firebase/perf';
import remoteConfig from '@react-native-firebase/remote-config';

export const db = firestore();
export const fbAuth = auth();
export const fbFunctions = functions();
export const fbRemoteConfig = remoteConfig();
export const fbAnalytics = analytics();
export const fbCrashlytics = crashlytics();
export const fbPerf = perf();
export const fbMessaging = messaging();

// Enable offline persistence
firestore().settings({
  persistence: true,
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});

// Firestore collection references — single source of truth
export const collections = {
  users: () => db.collection('users'),
  user: (uid: string) => db.collection('users').doc(uid),
  transactions: (uid: string) => db.collection('users').doc(uid).collection('transactions'),
  transaction: (uid: string, txId: string) =>
    db.collection('users').doc(uid).collection('transactions').doc(txId),
  categories: () => db.collection('categories'),
  budgets: (uid: string) => db.collection('users').doc(uid).collection('budgets'),
  budget: (uid: string, budgetId: string) =>
    db.collection('users').doc(uid).collection('budgets').doc(budgetId),
  analytics: (uid: string) => db.collection('users').doc(uid).collection('analytics'),
  insights: (uid: string) => db.collection('users').doc(uid).collection('insights'),
  subscriptions: (uid: string) => db.collection('users').doc(uid).collection('subscriptions'),
  devices: (uid: string) => db.collection('users').doc(uid).collection('devices'),
  smsProcessing: (uid: string) => db.collection('users').doc(uid).collection('sms_processing'),
  notifications: (uid: string) => db.collection('users').doc(uid).collection('notifications'),
  featureFlags: () => db.collection('feature_flags'),
} as const;

export const serverTimestamp = firestore.FieldValue.serverTimestamp;
export const firestoreDelete = firestore.FieldValue.delete;
export const arrayUnion = firestore.FieldValue.arrayUnion;
export const arrayRemove = firestore.FieldValue.arrayRemove;
export const increment = firestore.FieldValue.increment;
