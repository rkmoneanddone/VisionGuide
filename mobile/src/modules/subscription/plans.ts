export type PlanId = 'free' | 'paid_monthly' | 'paid_annual';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  billingPeriod: 'free' | 'monthly' | 'annual';
  priceLabel: string;
  enabled: boolean;
}

/** Placeholder catalog. Final pricing and purchase integration are deliberately deferred. */
export const PLAN_CATALOG: readonly PlanDefinition[] = [
  {id: 'free', name: 'Free', billingPeriod: 'free', priceLabel: 'Free', enabled: true},
  {id: 'paid_monthly', name: 'VisionGuide Plus', billingPeriod: 'monthly', priceLabel: 'Coming soon', enabled: false},
  {id: 'paid_annual', name: 'VisionGuide Plus', billingPeriod: 'annual', priceLabel: 'Coming soon', enabled: false},
] as const;

export const FREE_SCAN_POLICY = {
  introductoryDays: 7,
  introductoryDailyScans: 2,
  standardDailyScans: 1,
} as const;

export interface ScanAllowanceInput {
  isPaid: boolean;
  accountAgeDays: number;
  scansUsedToday: number;
}

export function getDailyScanAllowance(input: ScanAllowanceInput): number {
  if (input.isPaid) return Number.POSITIVE_INFINITY;
  return input.accountAgeDays < FREE_SCAN_POLICY.introductoryDays
    ? FREE_SCAN_POLICY.introductoryDailyScans
    : FREE_SCAN_POLICY.standardDailyScans;
}

export function canStartScan(input: ScanAllowanceInput): boolean {
  return input.scansUsedToday < getDailyScanAllowance(input);
}
