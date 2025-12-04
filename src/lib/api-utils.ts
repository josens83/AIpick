import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

// Standard API Response Types
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

// Error to status code mapping
const errorStatusMap: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

// Success response helper
export function apiSuccess<T>(data: T, meta?: ApiSuccessResponse['meta']): NextResponse {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(meta && { meta }),
  }
  return NextResponse.json(response)
}

// Paginated success response helper
export function apiPaginatedSuccess<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse {
  return apiSuccess(data, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  })
}

// Error response helper
export function apiError(
  code: ErrorCode,
  message: string,
  details?: unknown
): NextResponse {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  }
  return NextResponse.json(response, { status: errorStatusMap[code] })
}

// Handle caught errors
export function handleApiError(error: unknown): NextResponse {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    return apiError(
      ERROR_CODES.VALIDATION_ERROR,
      'Validation failed',
      formattedErrors
    )
  }

  // Handle known error types
  if (error instanceof ApiException) {
    return apiError(error.code, error.message, error.details)
  }

  // Handle unknown errors
  console.error('Unhandled API error:', error)
  return apiError(
    ERROR_CODES.INTERNAL_ERROR,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error instanceof Error
        ? error.message
        : 'Unknown error'
  )
}

// Custom API Exception class
export class ApiException extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiException'
  }
}

// Common exceptions
export const Exceptions = {
  unauthorized: (message = 'Authentication required') =>
    new ApiException(ERROR_CODES.UNAUTHORIZED, message),

  forbidden: (message = 'Access denied') =>
    new ApiException(ERROR_CODES.FORBIDDEN, message),

  notFound: (resource = 'Resource') =>
    new ApiException(ERROR_CODES.NOT_FOUND, `${resource} not found`),

  conflict: (message: string) =>
    new ApiException(ERROR_CODES.CONFLICT, message),

  rateLimited: (message = 'Too many requests') =>
    new ApiException(ERROR_CODES.RATE_LIMITED, message),

  badRequest: (message: string, details?: unknown) =>
    new ApiException(ERROR_CODES.BAD_REQUEST, message, details),
}

// Type guard for checking API response
export function isApiError(response: ApiResponse): response is ApiErrorResponse {
  return !response.success
}

// Helper to wrap async route handlers with error handling
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
