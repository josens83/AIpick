import { NextRequest, NextResponse } from 'next/server'

// In-memory store for development (use Upstash Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  uniqueTokenPerInterval?: number
  interval?: number // in milliseconds
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// Clean up expired entries periodically
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every 60 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 60000)
}

export function rateLimit(config: RateLimitConfig = {}) {
  const { uniqueTokenPerInterval = 100, interval = 60000 } = config

  return async function check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const key = identifier

    const entry = rateLimitStore.get(key)

    if (!entry || entry.resetTime < now) {
      // Create new entry
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + interval,
      })

      return {
        success: true,
        limit: uniqueTokenPerInterval,
        remaining: uniqueTokenPerInterval - 1,
        reset: now + interval,
      }
    }

    if (entry.count >= uniqueTokenPerInterval) {
      return {
        success: false,
        limit: uniqueTokenPerInterval,
        remaining: 0,
        reset: entry.resetTime,
      }
    }

    // Increment count
    entry.count++
    rateLimitStore.set(key, entry)

    return {
      success: true,
      limit: uniqueTokenPerInterval,
      remaining: uniqueTokenPerInterval - entry.count,
      reset: entry.resetTime,
    }
  }
}

// Predefined rate limiters
export const rateLimiters = {
  // Strict rate limit for sensitive actions (auth, payment)
  strict: rateLimit({
    uniqueTokenPerInterval: 5,
    interval: 60000, // 5 requests per minute
  }),

  // Standard rate limit for API endpoints
  standard: rateLimit({
    uniqueTokenPerInterval: 60,
    interval: 60000, // 60 requests per minute
  }),

  // Relaxed rate limit for read operations
  relaxed: rateLimit({
    uniqueTokenPerInterval: 200,
    interval: 60000, // 200 requests per minute
  }),

  // Very strict for newsletter/contact submissions
  submission: rateLimit({
    uniqueTokenPerInterval: 3,
    interval: 300000, // 3 requests per 5 minutes
  }),
}

// Get client IP from request
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (real) {
    return real
  }

  return 'unknown'
}

// Rate limit response helper
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
      },
    }
  )
}

// Middleware helper to apply rate limiting
export async function withRateLimit(
  request: NextRequest,
  limiter: ReturnType<typeof rateLimit>,
  identifier?: string
): Promise<NextResponse | null> {
  const ip = identifier || getClientIp(request)
  const result = await limiter(ip)

  if (!result.success) {
    return rateLimitResponse(result)
  }

  return null // Continue with request
}

// Add rate limit headers to response
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())
  return response
}
