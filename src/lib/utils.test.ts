import { describe, it, expect } from 'vitest'
import {
  cn,
  formatNumber,
  formatDate,
  formatRelativeTime,
  slugify,
  truncate,
  getInitials,
  absoluteUrl,
} from './utils'

describe('cn (class names merger)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })
})

describe('formatNumber', () => {
  it('should format millions', () => {
    expect(formatNumber(1500000)).toBe('1.5M')
  })

  it('should format thousands', () => {
    expect(formatNumber(1500)).toBe('1.5K')
  })

  it('should return number as string for small numbers', () => {
    expect(formatNumber(500)).toBe('500')
  })

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatDate', () => {
  it('should format date in Korean locale', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date)
    expect(result).toContain('2024')
    expect(result).toContain('1')
    expect(result).toContain('15')
  })

  it('should accept string dates', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('2024')
  })
})

describe('formatRelativeTime', () => {
  it('should return "방금 전" for very recent times', () => {
    const now = new Date()
    expect(formatRelativeTime(now)).toBe('방금 전')
  })

  it('should return minutes for recent times', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5분 전')
  })

  it('should return hours for times within a day', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    expect(formatRelativeTime(twoHoursAgo)).toBe('2시간 전')
  })

  it('should return days for times within a week', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(threeDaysAgo)).toBe('3일 전')
  })
})

describe('slugify', () => {
  it('should convert to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz')
  })

  it('should remove special characters', () => {
    expect(slugify('hello@world!')).toBe('helloworld')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('foo   bar')).toBe('foo-bar')
  })

  it('should trim leading and trailing hyphens', () => {
    expect(slugify(' hello world ')).toBe('hello-world')
  })
})

describe('truncate', () => {
  it('should not truncate short text', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('should truncate long text with ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hello...')
  })

  it('should handle exact length', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
})

describe('getInitials', () => {
  it('should get initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should handle single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('should limit to 2 characters', () => {
    expect(getInitials('John Michael Doe')).toBe('JM')
  })

  it('should uppercase initials', () => {
    expect(getInitials('john doe')).toBe('JD')
  })
})

describe('absoluteUrl', () => {
  it('should create absolute URL with path', () => {
    const url = absoluteUrl('/test')
    expect(url).toContain('/test')
  })

  it('should handle root path', () => {
    const url = absoluteUrl('/')
    expect(url.endsWith('/')).toBe(true)
  })
})
