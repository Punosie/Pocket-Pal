import type { UserProfile, UserPreferences } from '@/types';

import { collections, serverTimestamp } from '../config';

import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'INR',
  locale: 'en-IN',
  theme: 'dark',
  useBiometrics: false,
  notificationsEnabled: true,
  smsParsingEnabled: true,
  backgroundSyncEnabled: true,
  hideSensitiveAmounts: false,
  defaultView: 'monthly',
};

class UserRepository {
  async createProfile(
    uid: string,
    info: Pick<UserProfile, 'email' | 'displayName' | 'photoURL' | 'phoneNumber'>,
  ): Promise<void> {
    await collections.user(uid).set({
      uid,
      ...info,
      isEmailVerified: false,
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
      onboardingCompleted: false,
      onboardingStep: 'welcome',
      preferences: DEFAULT_PREFERENCES,
      totalTransactions: 0,
      totalBanksLinked: 0,
      isPremium: false,
    });
  }

  async getProfile(uid: string): Promise<UserProfile | null> {
    const doc = await collections.user(uid).get();
    if (!doc.exists) return null;
    return this.fromSnapshot(doc);
  }

  subscribeToProfile(uid: string, onUpdate: (profile: UserProfile | null) => void) {
    return collections.user(uid).onSnapshot((doc) => {
      if (!doc.exists) {
        onUpdate(null);
        return;
      }
      onUpdate(this.fromSnapshot(doc));
    });
  }

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    await collections.user(uid).update({
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async updatePreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(preferences)) {
      updates[`preferences.${key}`] = value;
    }
    await collections.user(uid).update({
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async updateLastSeen(uid: string): Promise<void> {
    await collections.user(uid).update({ lastSeenAt: serverTimestamp() });
  }

  async completeOnboarding(uid: string): Promise<void> {
    await collections.user(uid).update({
      onboardingCompleted: true,
      onboardingStep: 'complete',
      updatedAt: serverTimestamp(),
    });
  }

  async updateOnboardingStep(uid: string, step: UserProfile['onboardingStep']): Promise<void> {
    await collections.user(uid).update({ onboardingStep: step });
  }

  async deleteProfile(uid: string): Promise<void> {
    await collections.user(uid).delete();
  }

  private fromSnapshot(doc: FirebaseFirestoreTypes.DocumentSnapshot): UserProfile {
    const data = doc.data()!;
    return {
      ...(data as Omit<UserProfile, 'createdAt' | 'lastSeenAt'>),
      createdAt: (data.createdAt as FirebaseFirestoreTypes.Timestamp)?.toDate() ?? new Date(),
      lastSeenAt: (data.lastSeenAt as FirebaseFirestoreTypes.Timestamp)?.toDate() ?? new Date(),
    };
  }
}

export const userRepository = new UserRepository();
