'use client';

/**
 * Unified analytics — fires every event to BOTH Meta Pixel (fbq) and
 * Google tag (gtag) through one call, so there is a single source of truth
 * and no duplicate tracking logic scattered across the app.
 *
 * No-ops safely when a provider isn't loaded (env vars unset) or on the
 * server. IDs are injected by <AnalyticsScripts/> from:
 *   NEXT_PUBLIC_META_PIXEL_ID  · NEXT_PUBLIC_GA_ID
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type Params = Record<string, unknown>;

// Meta Pixel recognises these as standard events (use fbq('track', …));
// anything else is sent as a custom event (fbq('trackCustom', …)).
const META_STANDARD = new Set([
  'PageView', 'Lead', 'CompleteRegistration', 'InitiateCheckout',
  'Purchase', 'Contact', 'ViewContent', 'Search', 'Subscribe', 'Contact',
]);

/** Fire one event to both providers. */
export function track(event: string, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  try {
    if (window.fbq) {
      if (META_STANDARD.has(event)) window.fbq('track', event, params);
      else window.fbq('trackCustom', event, params);
    }
  } catch { /* provider not ready */ }
  try {
    if (window.gtag) window.gtag('event', event, params);
  } catch { /* provider not ready */ }
}

/** Page view on route change — Meta PageView + GA page_view. */
export function trackPageView(path: string): void {
  if (typeof window === 'undefined') return;
  try { window.fbq?.('track', 'PageView'); } catch { /* noop */ }
  try { window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href }); } catch { /* noop */ }
}

// ── Semantic conversion helpers used at call sites ────────────────
export const trackRegistration = (method = 'web') =>
  track('CompleteRegistration', { method, content_name: 'membership' });

export const trackCheckout = (plan: string, value: number) =>
  track('InitiateCheckout', { plan, value, currency: 'USD' });

export const trackAIAction = (agent: string) =>
  track('ai_agent_message', { agent });

export const trackGrowthTool = (tool: string) =>
  track('growth_tool_use', { tool });

export const trackReferralShare = (channel: string) =>
  track('referral_share', { channel });
