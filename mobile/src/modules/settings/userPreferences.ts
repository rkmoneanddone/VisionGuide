import type {ScanModeId} from '../scan/scanModes';

export interface ListeningLanguage {
  /** BCP-47 language tag, for example en-IN or hi-IN. */
  tag: string;
  label: string;
}

export interface UserPreferences {
  defaultScanMode: ScanModeId;
  defaultListeningLanguage: string;
  speechRate: number;
}

export interface ScanSessionPreferences {
  scanMode: ScanModeId;
  listeningLanguageOverride?: string;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  defaultScanMode: 'anything',
  defaultListeningLanguage: 'en-IN',
  speechRate: 1,
};

export function resolveListeningLanguage(
  user: UserPreferences,
  session: ScanSessionPreferences,
  fallback = 'en-IN',
): string {
  return session.listeningLanguageOverride ?? user.defaultListeningLanguage ?? fallback;
}
