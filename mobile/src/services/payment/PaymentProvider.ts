export interface CheckoutRequest {
  userId: string;
  planId: string;
  currency?: string;
  country?: string;
}

export interface CheckoutSession {
  provider: string;
  checkoutUrl: string;
  sessionId: string;
}

export interface PaymentProvider {
  readonly id: string;
  createCheckout(request: CheckoutRequest): Promise<CheckoutSession>;
}

export interface PaymentProviderRuntimeConfig {
  id: string;
  enabled: boolean;
  priority: number;
  supportedCountries?: readonly string[];
  supportedCurrencies?: readonly string[];
}

/**
 * Provider selection is configuration-driven, but checkout creation and all
 * privileged credentials remain server-side. The client receives only a
 * trusted checkout session from VisionGuide's backend gateway.
 */
export interface PaymentGatewayService {
  createCheckout(request: CheckoutRequest): Promise<CheckoutSession>;
}
