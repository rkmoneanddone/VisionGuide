import auth from '@react-native-firebase/auth';
import {AuthService, AuthUser, PhoneChallenge} from './AuthService';

function mapUser(user: {uid: string; displayName: string | null; phoneNumber: string | null; email: string | null}): AuthUser {
  return {uid: user.uid, displayName: user.displayName, phoneNumber: user.phoneNumber, email: user.email};
}

/**
 * Firebase-backed identity service. Google credential acquisition is kept
 * outside this class because it belongs to the native Google Sign-In adapter.
 */
export class FirebaseAuthService implements Omit<AuthService, 'signInWithGoogle'> {
  private confirmations = new Map<string, Awaited<ReturnType<typeof auth.prototype.signInWithPhoneNumber>>>();

  getCurrentUser(): AuthUser | null {
    const user = auth().currentUser;
    return user ? mapUser(user) : null;
  }

  async requestPhoneOtp(phoneNumber: string): Promise<PhoneChallenge> {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    const verificationId = confirmation.verificationId;
    this.confirmations.set(verificationId, confirmation);
    return {verificationId};
  }

  async confirmPhoneOtp(challenge: PhoneChallenge, code: string): Promise<AuthUser> {
    const confirmation = this.confirmations.get(challenge.verificationId);
    if (!confirmation) throw new Error('OTP session expired. Request a new code.');
    const credential = await confirmation.confirm(code);
    this.confirmations.delete(challenge.verificationId);
    if (!credential?.user) throw new Error('Unable to complete phone sign-in.');
    return mapUser(credential.user);
  }

  async signOut(): Promise<void> {
    await auth().signOut();
  }
}
