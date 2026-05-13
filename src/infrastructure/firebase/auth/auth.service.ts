import analytics from '@react-native-firebase/analytics';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';

import { userRepository } from '../firestore/user.repository';

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  get currentUser() {
    return auth().currentUser;
  }

  get isAuthenticated(): boolean {
    return !!auth().currentUser;
  }

  onAuthStateChanged(callback: (user: ReturnType<typeof auth>['currentUser']) => void) {
    return auth().onAuthStateChanged(callback);
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const credential = await auth().signInWithEmailAndPassword(email, password);
      await this.postSignIn(credential.user.uid);
      return credential;
    } catch (error) {
      void crashlytics().recordError(error as Error);
      throw this.transformAuthError(error);
    }
  }

  async signUpWithEmail(email: string, password: string, displayName: string) {
    try {
      const credential = await auth().createUserWithEmailAndPassword(email, password);
      await credential.user.updateProfile({ displayName });
      await userRepository.createProfile(credential.user.uid, {
        email,
        displayName,
        photoURL: null,
        phoneNumber: null,
      });
      await this.postSignIn(credential.user.uid);
      void analytics().logSignUp({ method: 'email' });
      return credential;
    } catch (error) {
      void crashlytics().recordError(error as Error);
      throw this.transformAuthError(error);
    }
  }

  async signOut() {
    try {
      void analytics().logEvent('sign_out');
      await auth().signOut();
    } catch (error) {
      void crashlytics().recordError(error as Error);
      throw error;
    }
  }

  async sendPasswordReset(email: string) {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw this.transformAuthError(error);
    }
  }

  async updatePassword(currentPassword: string, newPassword: string) {
    const user = auth().currentUser;
    if (!user || !user.email) throw new Error('Not authenticated');

    const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(credential);
    await user.updatePassword(newPassword);
  }

  async deleteAccount(password: string) {
    const user = auth().currentUser;
    if (!user || !user.email) throw new Error('Not authenticated');

    const credential = auth.EmailAuthProvider.credential(user.email, password);
    await user.reauthenticateWithCredential(credential);
    await userRepository.deleteProfile(user.uid);
    await user.delete();
  }

  private async postSignIn(uid: string) {
    await crashlytics().setUserId(uid);
    void analytics().setUserId(uid);
    await userRepository.updateLastSeen(uid);
  }

  private transformAuthError(error: unknown): Error {
    const firebaseError = error as { code?: string };
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account already exists with this email.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/user-disabled': 'This account has been disabled.',
    };

    const code = firebaseError.code ?? '';
    const message = errorMessages[code] ?? 'An unexpected error occurred.';
    const err = new Error(message);
    err.name = code;
    return err;
  }
}

export const authService = AuthService.getInstance();
