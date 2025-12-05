'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDebounce, useSearchHistory } from '@/hooks'

interface SearchSuggestion {
  type: 'history' | 'trending' | 'suggestion'
  text: string
  category?: string
}

// Popular/trending search terms
const trendingSearches = [
  'ChatGPT',
  '이미지 생성',
  '코드 작성 도우미',
  '영상 편집',
  '음성 인식',
  '번역 도구',
]

// Category-based suggestions
const categorySuggestions: Record<string, string[]> = {
  글쓰기: ['블로그 작성', '카피라이팅', '이메일 작성', '스토리 생성'],
  이미지: ['이미지 생성', '이미지 편집', '배경 제거', '업스케일링'],
  영상: ['영상 편집', '자막 생성', '영상 요약', '썸네일 생성'],
  코딩: ['코드 작성', '코드 리뷰', '버그 수정', 'API 생성'],
  음악: ['음악 생성', '음성 합성', '오디오 편집', '음성 변환'],
}

interface EnhancedSearchInputProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  autoFocus?: boolean
  showTrending?: boolean
  showHistory?: boolean
}

export const EnhancedSearchInput = memo(function EnhancedSearchInput({
  placeholder = '어떤 작업을 하고 싶으신가요?',
  onSearch,
  className,
  autoFocus = false,
  showTrending = true,
  showHistory = true,
}: EnhancedSearchInputProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const debouncedQuery = useDebounce(query, 300)
  const { history, addToHistory, removeFromHistory } = useSearchHistory(5)

  // Generate suggestions based on query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      // Show history and trending when no query
      const newSuggestions: SearchSuggestion[] = []

      if (showHistory && history.length > 0) {
        history.slice(0, 3).forEach((text) => {
          newSuggestions.push({ type: 'history', text })
        })
      }

      if (showTrending) {
        trendingSearches.slice(0, 4).forEach((text) => {
          newSuggestions.push({ type: 'trending', text })
        })
      }

      setSuggestions(newSuggestions)
      return
    }

    // Generate suggestions based on query
    const lowerQuery = debouncedQuery.toLowerCase()
    const newSuggestions: SearchSuggestion[] = []

    // Check category keywords
    Object.entries(categorySuggestions).forEach(([category, terms]) => {
      if (lowerQuery.includes(category.toLowerCase())) {
        terms.slice(0, 2).forEach((term) => {
          newSuggestions.push({
            type: 'suggestion',
            text: term,
            category,
          })
        })
      }
    })

    // Add matching trending searches
    trendingSearches.forEach((text) => {
      if (text.toLowerCase().includes(lowerQuery)) {
        newSuggestions.push({ type: 'trending', text })
      }
    })

    // Add matching history
    if (showHistory) {
      history.forEach((text) => {
        if (text.toLowerCase().includes(lowerQuery)) {
          newSuggestions.push({ type: 'history', text })
        }
      })
    }

    setSuggestions(newSuggestions.slice(0, 6))
  }, [debouncedQuery, history, showHistory, showTrending])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = useCallback(
    async (searchQuery?: string) => {
      const finalQuery = searchQuery || query
      if (!finalQuery.trim()) return

      setIsLoading(true)
      setIsOpen(false)
      addToHistory(finalQuery)

      if (onSearch) {
        onSearch(finalQuery)
      } else {
        router.push(`/explore?q=${encodeURIComponent(finalQuery)}`)
      }

      setIsLoading(false)
    },
    [query, onSearch, router, addToHistory]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSubmit(suggestions[selectedIndex].text)
        } else {
          handleSubmit()
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    },
    [suggestions, selectedIndex, handleSubmit]
  )

  const handleRemoveHistory = useCallback(
    (e: React.MouseEvent, text: string) => {
      e.stopPropagation()
      removeFromHistory(text)
    },
    [removeFromHistory]
  )

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-purple-500/30 text-purple-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Search Input */}
      <div
        className={cn(
          'relative rounded-2xl transition-all duration-300',
          isOpen
            ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20'
            : 'ring-1 ring-white/20 hover:ring-white/30'
        )}
      >
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(-1)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent text-white placeholder:text-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <Button
            onClick={() => handleSubmit()}
            disabled={isLoading || !query.trim()}
            size="sm"
            className="rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                검색
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-xl overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.text}`}
                  onClick={() => handleSubmit(suggestion.text)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                    selectedIndex === index
                      ? 'bg-purple-500/20'
                      : 'hover:bg-white/5'
                  )}
                >
                  {suggestion.type === 'history' && (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                  {suggestion.type === 'trending' && (
                    <TrendingUp className="w-4 h-4 text-pink-400" />
                  )}
                  {suggestion.type === 'suggestion' && (
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-white">
                      {highlightMatch(suggestion.text, query)}
                    </span>
                    {suggestion.category && (
                      <span className="ml-2 text-xs text-gray-400">
                        {suggestion.category}
                      </span>
                    )}
                  </div>

                  {suggestion.type === 'history' && (
                    <button
                      onClick={(e) => handleRemoveHistory(e, suggestion.text)}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  )}

                  <ArrowRight className="w-4 h-4 text-gray-500" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

EnhancedSearchInput.displayName = 'EnhancedSearchInput'
