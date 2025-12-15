/**
 * Error tracking and monitoring utilities
 * Configure with Sentry or other error tracking services
 */

interface ErrorContext {
  userId?: string
  email?: string
  tags?: Record<string, string>
  extra?: Record<string, unknown>
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
}

interface BreadcrumbData {
  category: string
  message: string
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
  data?: Record<string, unknown>
}

// Initialize error tracking (call once in app)
export function initErrorTracking() {
  if (typeof window === 'undefined') return

  // Global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    captureException(error || new Error(String(message)), {
      extra: { source, lineno, colno },
    })
  }

  // Unhandled promise rejection handler
  window.onunhandledrejection = (event) => {
    captureException(event.reason, {
      tags: { type: 'unhandledrejection' },
    })
  }

  console.log('[Monitoring] Error tracking initialized')
}

// Capture exception
export function captureException(error: Error | unknown, context?: ErrorContext) {
  const errorObj = error instanceof Error ? error : new Error(String(error))

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Captured]', errorObj, context)
  }

  // In production, send to Sentry or other service
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(errorObj, {
  //     user: context?.userId ? { id: context.userId, email: context.email } : undefined,
  //     tags: context?.tags,
  //     extra: context?.extra,
  //     level: context?.level || 'error',
  //   })
  // }

  // Send to custom error logging endpoint
  if (process.env.NODE_ENV === 'production') {
    sendErrorToServer(errorObj, context)
  }
}

// Capture message (non-error logs)
export function captureMessage(
  message: string,
  level: ErrorContext['level'] = 'info',
  context?: Omit<ErrorContext, 'level'>
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level?.toUpperCase()}]`, message, context)
  }

  // Send to monitoring service
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureMessage(message, { level, ...context })
  // }
}

// Add breadcrumb for debugging
export function addBreadcrumb(data: BreadcrumbData) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Breadcrumb]', data.category, data.message, data.data)
  }

  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.addBreadcrumb({
  //     category: data.category,
  //     message: data.message,
  //     level: data.level || 'info',
  //     data: data.data,
  //   })
  // }
}

// Set user context for error tracking
export function setUser(user: { id: string; email?: string; name?: string } | null) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[User Context]', user)
  }

  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.setUser(user)
  // }
}

// Set tags for filtering errors
export function setTags(tags: Record<string, string>) {
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   Object.entries(tags).forEach(([key, value]) => {
  //     window.Sentry.setTag(key, value)
  //   })
  // }
}

// Send error to custom server endpoint
async function sendErrorToServer(error: Error, context?: ErrorContext) {
  try {
    const payload = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      ...context,
    }

    // Send to your error logging API
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // })
  } catch (e) {
    // Silently fail to avoid infinite loops
    console.error('Failed to send error to server:', e)
  }
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now()

  const result = fn()

  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start
      logPerformance(name, duration)
    })
  }

  const duration = performance.now() - start
  logPerformance(name, duration)
}

function logPerformance(name: string, duration: number) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  }

  // Send to analytics
  // trackEvent('performance', { name, duration })
}

// Transaction for tracing
export function startTransaction(name: string, op: string) {
  const startTime = performance.now()

  return {
    name,
    op,
    startTime,
    finish: () => {
      const duration = performance.now() - startTime
      logPerformance(`${op}:${name}`, duration)
    },
  }
}
