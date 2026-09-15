import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AuthService, AuthUser, PhoneChallenge} from './AuthService';

function mapUser(user: FirebaseAuthTypes.User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    email: user.email,
  };
}

GoogleSignin.configure({
  webClientId: '468630156309-3jrd2i7858ckj34kv5a7e2gjtbf1p00d.apps.googleusercontent.com',
});

/** Firebase-backed identity service. */
export class FirebaseAuthService implements AuthService {
  private confirmations = new Map<string, FirebaseAuthTypes.ConfirmationResult>();

  getCurrentUser(): AuthUser | null {
    const user = auth().currentUser;
    return user ? mapUser(user) : null;
  }

  async signInWithGoogle(): Promise<AuthUser> {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const result = await GoogleSignin.signIn();
    const idToken = result.data?.idToken;

    if (!idToken) {
      throw new Error('Google did not return an ID token. Check the Firebase Google sign-in configuration.');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const credential = await auth().signInWithCredential(googleCredential);
    return mapUser(credential.user);
  }

  async requestPhoneOtp(phoneNumber: string): Promise<PhoneChallenge> {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    const verificationId = confirmation.verificationId;

    if (!verificationId) {
      throw new Error('Unable to start phone verification. Please try again.');
    }

    this.confirmations.set(verificationId, confirmation);
    return {verificationId};
  }

  async confirmPhoneOtp(challenge: PhoneChallenge, code: string): Promise<AuthUser> {
    const confirmation = this.confirmations.get(challenge.verificationId);
    if (!confirmation) {
      throw new Error('OTP session expired. Request a new code.');
    }

    const credential = await confirmation.confirm(code);
    this.confirmations.delete(challenge.verificationId);

    if (!credential?.user) {
      throw new Error('Unable to complete phone verification.');
    }

    return mapUser(credential.user);
  }

  async signOut(): Promise<void> {
    await auth().signOut();
    await GoogleSignin.signOut();
  }
}
