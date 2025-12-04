'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for managing localStorage with SSR support
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage after mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
    setIsInitialized(true)
  }, [key])

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [isInitialized ? storedValue : initialValue, setValue, removeValue]
}

/**
 * Hook for storing recent search queries
 */
export function useSearchHistory(maxItems = 10) {
  const [history, setHistory, clearHistory] = useLocalStorage<string[]>(
    'search-history',
    []
  )

  const addToHistory = useCallback(
    (query: string) => {
      if (!query.trim()) return

      setHistory((prev) => {
        const filtered = prev.filter((q) => q !== query)
        return [query, ...filtered].slice(0, maxItems)
      })
    },
    [setHistory, maxItems]
  )

  const removeFromHistory = useCallback(
    (query: string) => {
      setHistory((prev) => prev.filter((q) => q !== query))
    },
    [setHistory]
  )

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
