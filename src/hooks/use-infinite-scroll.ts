'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions<T> {
  initialData?: T[]
  fetchMore: (page: number) => Promise<{ data: T[]; hasMore: boolean }>
  threshold?: number
  initialPage?: number
}

interface UseInfiniteScrollReturn<T> {
  data: T[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: Error | null
  loadMore: () => void
  reset: () => void
  sentinelRef: (node: HTMLElement | null) => void
}

export function useInfiniteScroll<T>({
  initialData = [],
  fetchMore,
  threshold = 100,
  initialPage = 1,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>(initialData)
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLElement | null>(null)

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    setError(null)

    try {
      const result = await fetchMore(page)
      setData((prev) => [...prev, ...result.data])
      setHasMore(result.hasMore)
      setPage((prev) => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more'))
    } finally {
      setIsLoadingMore(false)
    }
  }, [fetchMore, page, isLoadingMore, hasMore])

  const reset = useCallback(() => {
    setData(initialData)
    setPage(initialPage)
    setHasMore(true)
    setError(null)
    setIsLoading(false)
    setIsLoadingMore(false)
  }, [initialData, initialPage])

  // Setup Intersection Observer
  const setSentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (node) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            const [entry] = entries
            if (entry.isIntersecting && hasMore && !isLoadingMore) {
              loadMore()
            }
          },
          {
            rootMargin: `${threshold}px`,
          }
        )
        observerRef.current.observe(node)
      }

      sentinelRef.current = node
    },
    [hasMore, isLoadingMore, loadMore, threshold]
  )

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return {
    data,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    reset,
    sentinelRef: setSentinelRef,
  }
}

/**
 * Simpler scroll-based infinite scroll (without Intersection Observer)
 */
export function useScrollInfiniteLoad(
  onLoadMore: () => void,
  options: {
    threshold?: number
    enabled?: boolean
  } = {}
) {
  const { threshold = 200, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        onLoadMore()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onLoadMore, threshold, enabled])
}
