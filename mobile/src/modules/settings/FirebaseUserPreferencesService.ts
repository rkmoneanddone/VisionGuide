import firestore from '@react-native-firebase/firestore';
import type {ScanModeId} from '../scan/scanModes';

export interface StoredUserPreferences {
  defaultListeningLanguage: string;
  defaultScanMode: ScanModeId;
  setupCompleted: boolean;
}

const users = firestore().collection('users');

export class FirebaseUserPreferencesService {
  async get(uid: string): Promise<StoredUserPreferences | null> {
    const snapshot = await users.doc(uid).get();
    const data = snapshot.data();
    if (!snapshot.exists || !data?.setupCompleted) return null;

    return {
      defaultListeningLanguage: data.defaultListeningLanguage ?? 'en-IN',
      defaultScanMode: (data.defaultScanMode ?? 'anything') as ScanModeId,
      setupCompleted: true,
    };
  }

  async save(uid: string, value: Omit<StoredUserPreferences, 'setupCompleted'>): Promise<void> {
    await users.doc(uid).set(
      {
        ...value,
        setupCompleted: true,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
  }
}
