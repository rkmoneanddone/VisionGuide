export interface AiProviderConfig {
  id: string;
  enabled: boolean;
  priority: number;
  model?: string;
}

export interface PaymentProviderConfig {
  id: string;
  enabled: boolean;
  priority: number;
}

export interface VisionGuideRuntimeConfig {
  version: number;
  ai: {
    enabled: boolean;
    providers: readonly AiProviderConfig[];
  };
  payments: {
    enabled: boolean;
    providers: readonly PaymentProviderConfig[];
  };
  features: {
    translation: boolean;
    explanation: boolean;
    summarization: boolean;
  };
  freeUsage: {
    introductoryDays: number;
    introductoryDailyScans: number;
    standardDailyScans: number;
  };
}

/** Safe defaults used if remote configuration is missing or invalid. */
export const SAFE_RUNTIME_DEFAULTS: VisionGuideRuntimeConfig = {
  version: 1,
  ai: {enabled: false, providers: []},
  payments: {enabled: false, providers: []},
  features: {translation: false, explanation: false, summarization: false},
  freeUsage: {introductoryDays: 7, introductoryDailyScans: 2, standardDailyScans: 1},
};
