'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getNavigationKey, type NavigationKey } from '@/lib/accessibility'

interface UseKeyboardNavigationOptions<T> {
  items: T[]
  onSelect?: (item: T, index: number) => void
  onEscape?: () => void
  loop?: boolean
  orientation?: 'vertical' | 'horizontal' | 'both'
  initialIndex?: number
}

interface UseKeyboardNavigationReturn {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  containerProps: {
    role: string
    tabIndex: number
    onKeyDown: (e: React.KeyboardEvent) => void
  }
  getItemProps: (index: number) => {
    role: string
    tabIndex: number
    'aria-selected': boolean
    onKeyDown: (e: React.KeyboardEvent) => void
    onClick: () => void
  }
}

export function useKeyboardNavigation<T>({
  items,
  onSelect,
  onEscape,
  loop = true,
  orientation = 'vertical',
  initialIndex = -1,
}: UseKeyboardNavigationOptions<T>): UseKeyboardNavigationReturn {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)

  const moveSelection = useCallback(
    (direction: 'next' | 'prev') => {
      setSelectedIndex((current) => {
        if (items.length === 0) return -1

        if (direction === 'next') {
          if (current >= items.length - 1) {
            return loop ? 0 : current
          }
          return current + 1
        } else {
          if (current <= 0) {
            return loop ? items.length - 1 : 0
          }
          return current - 1
        }
      })
    },
    [items.length, loop]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const key = getNavigationKey(e.nativeEvent)
      if (!key) return

      const isVertical = orientation === 'vertical' || orientation === 'both'
      const isHorizontal = orientation === 'horizontal' || orientation === 'both'

      switch (key) {
        case 'down':
          if (isVertical) {
            e.preventDefault()
            moveSelection('next')
          }
          break
        case 'up':
          if (isVertical) {
            e.preventDefault()
            moveSelection('prev')
          }
          break
        case 'right':
          if (isHorizontal) {
            e.preventDefault()
            moveSelection('next')
          }
          break
        case 'left':
          if (isHorizontal) {
            e.preventDefault()
            moveSelection('prev')
          }
          break
        case 'enter':
        case 'space':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < items.length) {
            onSelect?.(items[selectedIndex], selectedIndex)
          }
          break
        case 'escape':
          e.preventDefault()
          setSelectedIndex(-1)
          onEscape?.()
          break
        case 'tab':
          // Allow default tab behavior
          break
      }
    },
    [items, selectedIndex, moveSelection, onSelect, onEscape, orientation]
  )

  const containerProps = {
    role: 'listbox',
    tabIndex: 0,
    onKeyDown: handleKeyDown,
  }

  const getItemProps = (index: number) => ({
    role: 'option',
    tabIndex: index === selectedIndex ? 0 : -1,
    'aria-selected': index === selectedIndex,
    onKeyDown: handleKeyDown,
    onClick: () => {
      setSelectedIndex(index)
      onSelect?.(items[index], index)
    },
  })

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    containerProps,
    getItemProps,
  }
}

/**
 * Hook for roving tabindex pattern
 */
export function useRovingTabIndex(itemCount: number, initialIndex = 0) {
  const [focusIndex, setFocusIndex] = useState(initialIndex)
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, itemCount)
  }, [itemCount])

  const setItemRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      itemRefs.current[index] = el
    },
    []
  )

  const focusItem = useCallback((index: number) => {
    const item = itemRefs.current[index]
    if (item) {
      item.focus()
      setFocusIndex(index)
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const key = getNavigationKey(e.nativeEvent)

      switch (key) {
        case 'right':
        case 'down':
          e.preventDefault()
          focusItem((focusIndex + 1) % itemCount)
          break
        case 'left':
        case 'up':
          e.preventDefault()
          focusItem((focusIndex - 1 + itemCount) % itemCount)
          break
        case 'tab':
          // Allow tab to move focus out of the group
          break
      }
    },
    [focusIndex, focusItem, itemCount]
  )

  return {
    focusIndex,
    setFocusIndex,
    setItemRef,
    focusItem,
    handleKeyDown,
    getTabIndex: (index: number) => (index === focusIndex ? 0 : -1),
  }
}

/**
 * Hook for focus trap (modals, dialogs)
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    // Store currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Find all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    // Focus first element
    firstFocusable?.focus()

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

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      // Restore focus
      previousFocusRef.current?.focus()
    }
  }, [isActive])

  return containerRef
}
