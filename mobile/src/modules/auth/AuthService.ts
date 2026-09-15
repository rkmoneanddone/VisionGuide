export interface AuthUser {
  uid: string;
  displayName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface PhoneChallenge {
  verificationId: string;
}

export interface AuthService {
  getCurrentUser(): AuthUser | null;
  signInWithGoogle(): Promise<AuthUser>;
  requestPhoneOtp(phoneNumber: string): Promise<PhoneChallenge>;
  confirmPhoneOtp(challenge: PhoneChallenge, code: string): Promise<AuthUser>;
  signOut(): Promise<void>;
}

/**
 * Authentication implementations must use Firebase Auth as the identity source.
 * User profile/preferences are persisted separately so auth providers can be
 * linked without coupling product data to a specific sign-in method.
 */
