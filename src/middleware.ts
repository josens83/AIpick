import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
}

// Content Security Policy
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'blob:', 'https:', '*.googleusercontent.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://api.stripe.com', 'https://vitals.vercel-insights.com'],
  'frame-src': ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
}

function buildCsp(): string {
  return Object.entries(cspDirectives)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ')
}

// Simple in-memory rate limiter for middleware
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  // Clean up old entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.delete(key)
      }
    }
  }

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return true
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  record.count++
  return true
}

function getClientIp(request: NextRequest): string {
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

export default auth((req) => {
  const ip = getClientIp(req)
  const pathname = req.nextUrl.pathname

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api')) {
    if (!checkRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests. Please try again later.',
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      )
    }
  }

  const isLoggedIn = !!req.auth
  const isAuthPage = pathname.startsWith('/auth')
  const isProtectedPage = pathname.startsWith('/favorites') || pathname.startsWith('/account')

  // Redirect logged in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    const response = NextResponse.redirect(new URL('/', req.nextUrl))
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // Redirect non-logged in users to sign in page for protected routes
  if (isProtectedPage && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname)
    const response = NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.nextUrl)
    )
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  const response = NextResponse.next()

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add CSP header (less strict in development)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', buildCsp())
  } else {
    response.headers.set('Content-Security-Policy-Report-Only', buildCsp())
  }

  return response
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
