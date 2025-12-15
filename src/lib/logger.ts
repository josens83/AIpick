/**
 * Simple logger utility that respects NODE_ENV
 * In production, only errors are logged
 * In development, all logs are shown
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  /**
   * Log informational messages (development only)
   */
  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`[INFO] ${message}`, ...args)
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  },

  /**
   * Log error messages (always logged for debugging)
   */
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error)
  },
}
