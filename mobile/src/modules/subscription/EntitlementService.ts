export type FeatureKey =
  | 'scan_read'
  | 'document_history'
  | 'translation'
  | 'ai_explain'
  | 'ai_summarize';

export type EntitlementSnapshot = {
  plan: 'free' | 'premium';
  status: 'active' | 'inactive' | 'expired';
  validUntil?: string;
};

/**
 * Provider-neutral entitlement boundary.
 * Payment providers must never be called directly from feature modules.
 */
export interface EntitlementService {
  getSnapshot(): Promise<EntitlementSnapshot>;
  has(feature: FeatureKey): Promise<boolean>;
}
