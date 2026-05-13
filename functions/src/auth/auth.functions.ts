import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  functions.logger.info('New user created', { uid: user.uid });

  const profileData = {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    phoneNumber: user.phoneNumber ?? null,
    isEmailVerified: user.emailVerified,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastSeenAt: admin.firestore.FieldValue.serverTimestamp(),
    onboardingCompleted: false,
    onboardingStep: 'welcome',
    preferences: {
      currency: 'INR',
      locale: 'en-IN',
      theme: 'dark',
      useBiometrics: false,
      notificationsEnabled: true,
      smsParsingEnabled: true,
      backgroundSyncEnabled: true,
      hideSensitiveAmounts: false,
      defaultView: 'monthly',
    },
    totalTransactions: 0,
    totalBanksLinked: 0,
    isPremium: false,
  };

  await db.collection('users').doc(user.uid).set(profileData);
});

export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  functions.logger.info('User deleted, cleaning up data', { uid: user.uid });

  const userRef = db.collection('users').doc(user.uid);

  // Delete all subcollections
  const subcollections = [
    'transactions',
    'budgets',
    'analytics',
    'insights',
    'subscriptions',
    'devices',
    'sms_processing',
    'notifications',
  ];

  await Promise.all(
    subcollections.map(async (sub) => {
      const snapshot = await userRef.collection(sub).limit(500).get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }),
  );

  await userRef.delete();
  functions.logger.info('User data deleted', { uid: user.uid });
});
