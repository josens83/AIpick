'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  X,
  SlidersHorizontal,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToolCard } from '@/components/ToolCard'
import { getAllTools, categories } from '@/lib/data'
import type { Tool } from '@/types'

interface ExploreContentProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const pricingOptions = [
  { value: 'all', label: '전체' },
  { value: 'free', label: '무료' },
  { value: 'paid', label: '유료' },
]

const sortOptions = [
  { value: 'rating', label: '평점순' },
  { value: 'reviews', label: '리뷰 많은순' },
  { value: 'name', label: '이름순' },
  { value: 'newest', label: '최신순' },
]

export function ExploreContent({ searchParams }: ExploreContentProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState((searchParams.q as string) || '')
  const [category, setCategory] = useState((searchParams.category as string) || '')
  const [pricing, setPricing] = useState((searchParams.pricing as string) || 'all')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const fetchTools = useCallback(async () => {
    setLoading(true)
    const { tools: results } = await getAllTools({
      query,
      category,
      pricing: pricing === 'all' ? undefined : pricing,
      sortBy: sortBy === 'reviews' ? 'reviewCount' : sortBy,
    })

    setTools(results)
    setLoading(false)
  }, [query, category, pricing, sortBy])

  useEffect(() => {
    fetchTools()
  }, [fetchTools])

  const updateURL = useCallback((params: Record<string, string>) => {
    const current = new URLSearchParams(urlSearchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })
    router.push(`/explore?${current.toString()}`, { scroll: false })
  }, [router, urlSearchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL({ q: query })
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateURL({ category: value })
  }

  const handlePricingChange = (value: string) => {
    setPricing(value)
    updateURL({ pricing: value === 'all' ? '' : value })
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('')
    setPricing('all')
    router.push('/explore')
  }

  const hasActiveFilters = query || category || pricing !== 'all'

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">AI 도구 탐색</h1>
          <p className="text-gray-400">500개 이상의 AI 도구를 탐색하고 비교해보세요</p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="도구 이름, 기능, 카테고리로 검색..."
                className="pl-12 h-12"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6">
              검색
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </motion.form>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block w-64 shrink-0"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    필터
                  </h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      초기화
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="text-sm text-gray-400 mb-2 block">카테고리</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !category
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      전체
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          category === cat.slug
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {cat.name}
                        <span className="float-right text-gray-500">{cat.toolCount}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Filter */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">가격</label>
                  <div className="space-y-2">
                    {pricingOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handlePricingChange(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          pricing === option.value
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.aside>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl p-4 overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white text-lg">필터</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {/* Same filter content as desktop */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">카테고리</label>
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">가격</label>
                  <Select value={pricing} onValueChange={handlePricingChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="가격 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  초기화
                </Button>
                <Button className="flex-1" onClick={() => setShowFilters(false)}>
                  적용
                </Button>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <>
                    {query && (
                      <Badge variant="secondary" className="gap-1">
                        검색: {query}
                        <button onClick={() => { setQuery(''); updateURL({ q: '' }) }}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {category && (
                      <Badge variant="secondary" className="gap-1">
                        {categories.find(c => c.slug === category)?.name}
                        <button onClick={() => handleCategoryChange('')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {pricing !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {pricingOptions.find(p => p.value === pricing)?.label}
                        <button onClick={() => handlePricingChange('all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </>
                )}
                <span className="text-sm text-gray-400">
                  {tools.length}개의 도구
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center border border-white/10 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-l-none"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tools Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : tools.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-400 mb-4">검색 결과가 없습니다</p>
                <Button variant="outline" onClick={clearFilters}>
                  필터 초기화
                </Button>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                  : 'space-y-4'
              }>
                {tools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
