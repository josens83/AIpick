/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Generate a unique ID for ARIA attributes
 */
let idCounter = 0
export function generateId(prefix = 'aria'): string {
  return `${prefix}-${++idCounter}`
}

/**
 * Announce message to screen readers
 */
export function announce(
  message: string,
  options: { priority?: 'polite' | 'assertive' } = {}
): void {
  const { priority = 'polite' } = options

  // Find or create the announcer element
  let announcer = document.getElementById('sr-announcer')

  if (!announcer) {
    announcer = document.createElement('div')
    announcer.id = 'sr-announcer'
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    document.body.appendChild(announcer)
  } else {
    announcer.setAttribute('aria-live', priority)
  }

  // Clear and set message
  announcer.textContent = ''
  requestAnimationFrame(() => {
    announcer!.textContent = message
  })
}

/**
 * Trap focus within an element (for modals)
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable?.focus()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable?.focus()
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)
  firstFocusable?.focus()

  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check color contrast ratio (WCAG AA requires 4.5:1 for normal text)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = getRelativeLuminance(color1)
  const luminance2 = getRelativeLuminance(color2)
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Get keyboard navigation key
 */
export type NavigationKey = 'up' | 'down' | 'left' | 'right' | 'enter' | 'escape' | 'tab' | 'space'

export function getNavigationKey(event: KeyboardEvent): NavigationKey | null {
  switch (event.key) {
    case 'ArrowUp':
      return 'up'
    case 'ArrowDown':
      return 'down'
    case 'ArrowLeft':
      return 'left'
    case 'ArrowRight':
      return 'right'
    case 'Enter':
      return 'enter'
    case 'Escape':
      return 'escape'
    case 'Tab':
      return 'tab'
    case ' ':
      return 'space'
    default:
      return null
  }
}

/**
 * Focus visible class utility
 * Returns classes for focus-visible styling
 */
export const focusRingClasses =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'

/**
 * Screen reader only utility
 */
export const srOnlyClasses = 'sr-only'

/**
 * Visually hidden but focusable
 */
export const visuallyHiddenFocusableClasses =
  'absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)] focus:static focus:h-auto focus:w-auto focus:overflow-visible focus:whitespace-normal focus:[clip:auto]'

/**
 * ARIA live region priorities
 */
export const ariaLivePriorities = {
  polite: 'polite' as const,
  assertive: 'assertive' as const,
  off: 'off' as const,
}

/**
 * Common ARIA roles for reference
 */
export const ariaRoles = {
  alert: 'alert',
  alertdialog: 'alertdialog',
  button: 'button',
  checkbox: 'checkbox',
  dialog: 'dialog',
  grid: 'grid',
  gridcell: 'gridcell',
  link: 'link',
  listbox: 'listbox',
  menu: 'menu',
  menuitem: 'menuitem',
  option: 'option',
  progressbar: 'progressbar',
  radio: 'radio',
  radiogroup: 'radiogroup',
  searchbox: 'searchbox',
  slider: 'slider',
  spinbutton: 'spinbutton',
  switch: 'switch',
  tab: 'tab',
  tablist: 'tablist',
  tabpanel: 'tabpanel',
  textbox: 'textbox',
  tooltip: 'tooltip',
  tree: 'tree',
  treeitem: 'treeitem',
} as const
