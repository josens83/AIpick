/**
 * Analytics and event tracking utilities
 * Integrates with Vercel Analytics and custom event tracking
 */

// Event types
export type AnalyticsEvent =
  | { name: 'page_view'; properties: { path: string; title?: string } }
  | { name: 'search'; properties: { query: string; results_count: number } }
  | { name: 'tool_view'; properties: { tool_id: string; tool_name: string; category: string } }
  | { name: 'tool_click'; properties: { tool_id: string; tool_name: string; destination: 'website' | 'compare' | 'favorite' } }
  | { name: 'compare_tools'; properties: { tool_ids: string[]; tool_count: number } }
  | { name: 'review_submit'; properties: { tool_id: string; rating: number } }
  | { name: 'newsletter_signup'; properties: { source: string } }
  | { name: 'pricing_view'; properties: { plan?: string } }
  | { name: 'checkout_start'; properties: { plan: string; price: number } }
  | { name: 'checkout_complete'; properties: { plan: string; price: number } }
  | { name: 'auth_login'; properties: { provider: string } }
  | { name: 'auth_signup'; properties: { provider: string } }
  | { name: 'error'; properties: { error_type: string; message: string } }

// Track custom event
export function trackEvent<T extends AnalyticsEvent['name']>(
  name: T,
  properties: Extract<AnalyticsEvent, { name: T }>['properties']
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics Event]', name, properties)
  }

  // Vercel Analytics
  if (typeof window !== 'undefined' && 'va' in window) {
    (window as { va: (event: string, props: Record<string, unknown>) => void }).va('event', {
      name,
      ...properties,
    })
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as { gtag: (...args: unknown[]) => void }).gtag('event', name, properties)
  }

  // Custom analytics endpoint
  sendToAnalytics(name, properties)
}

// Track page view
export function trackPageView(path: string, title?: string) {
  trackEvent('page_view', { path, title })
}

// Identify user
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics Identify]', userId, traits)
  }

  // Store user ID for subsequent events
  if (typeof window !== 'undefined') {
    (window as { analyticsUserId?: string }).analyticsUserId = userId
  }
}

// Reset user (on logout)
export function resetUser() {
  if (typeof window !== 'undefined') {
    delete (window as { analyticsUserId?: string }).analyticsUserId
  }
}

// Send to custom analytics endpoint
async function sendToAnalytics(event: string, properties: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') return

  try {
    const userId = typeof window !== 'undefined'
      ? (window as { analyticsUserId?: string }).analyticsUserId
      : undefined

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        properties,
        userId,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    })
  } catch {
    // Silently fail
  }
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  // Core Web Vitals
  const reportWebVital = (metric: { name: string; value: number; id: string }) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vital]', metric.name, metric.value)
    }

    // Send to analytics
    trackEvent('error', {
      error_type: 'web_vital',
      message: `${metric.name}: ${metric.value}`,
    })
  }

  // Use web-vitals library if available
  // import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'
  // onCLS(reportWebVital)
  // onFID(reportWebVital)
  // onLCP(reportWebVital)
  // onFCP(reportWebVital)
  // onTTFB(reportWebVital)
}

// A/B Testing helper
export function getExperimentVariant(experimentId: string): 'control' | 'variant' {
  if (typeof window === 'undefined') return 'control'

  // Check if user already has a variant
  const storageKey = `exp_${experimentId}`
  const stored = localStorage.getItem(storageKey)

  if (stored === 'control' || stored === 'variant') {
    return stored
  }

  // Assign random variant
  const variant = Math.random() < 0.5 ? 'control' : 'variant'
  localStorage.setItem(storageKey, variant)

  // Track assignment
  trackEvent('error', {
    error_type: 'experiment_assignment',
    message: `${experimentId}: ${variant}`,
  })

  return variant
}

// Feature flag helper
export function isFeatureEnabled(featureName: string): boolean {
  // Check environment variable
  const envKey = `NEXT_PUBLIC_FEATURE_${featureName.toUpperCase()}`
  if (process.env[envKey] === 'true') return true
  if (process.env[envKey] === 'false') return false

  // Default features (can be overridden by env)
  const defaultFeatures: Record<string, boolean> = {
    dark_mode: true,
    pwa: true,
    reviews: true,
    compare: true,
  }

  return defaultFeatures[featureName] ?? false
}
