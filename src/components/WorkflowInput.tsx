'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Sparkles,
  Wand2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Code,
  MessageSquare,
  Presentation,
  Mail,
  ArrowRight,
  Loader2,
  Star,
  ExternalLink,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Tool } from '@/types'

interface RecommendationResult {
  tool: Tool
  score: number
  matchedKeywords: string[]
}

interface RecommendationResponse {
  query: string
  recommendations: RecommendationResult[]
  total: number
  meta: {
    detectedCategories: string[]
    keywords: string[]
  }
}

const quickWorkflows = [
  { icon: FileText, label: '블로그 글 작성', query: '블로그 글을 작성하고 싶어요' },
  { icon: ImageIcon, label: '이미지 생성', query: 'AI로 이미지를 생성하고 싶어요' },
  { icon: Video, label: '영상 편집', query: 'AI로 영상을 편집하고 싶어요' },
  { icon: Music, label: '음악 제작', query: 'AI로 음악을 만들고 싶어요' },
  { icon: Code, label: '코드 작성', query: 'AI로 코드를 작성하고 싶어요' },
  { icon: MessageSquare, label: '챗봇 구축', query: 'AI 챗봇을 만들고 싶어요' },
  { icon: Presentation, label: '프레젠테이션', query: 'AI로 PPT를 만들고 싶어요' },
  { icon: Mail, label: '이메일 작성', query: 'AI로 이메일을 작성하고 싶어요' },
]

export function WorkflowInput() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null)
  const [showResults, setShowResults] = useState(false)

  const fetchRecommendations = async (searchQuery: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/tools/recommend?q=${encodeURIComponent(searchQuery)}&limit=6`)

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data.recommendations.length > 0) {
        setRecommendations(data.data)
        setShowResults(true)
      } else {
        // Fallback to search if no recommendations
        router.push(`/explore?q=${encodeURIComponent(searchQuery)}`)
      }
    } catch {
      // Fallback to search on error
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    await fetchRecommendations(query)
  }

  const handleQuickWorkflow = async (workflowQuery: string) => {
    setQuery(workflowQuery)
    await fetchRecommendations(workflowQuery)
  }

  const handleCloseResults = () => {
    setShowResults(false)
    setRecommendations(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Input */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <div
          className={cn(
            'relative rounded-2xl transition-all duration-300',
            isFocused
              ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20'
              : 'ring-1 ring-white/20'
          )}
        >
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="어떤 작업을 하고 싶으신가요? (예: 블로그 글 작성, 이미지 생성...)"
              className="flex-1 bg-transparent text-white text-lg placeholder:text-gray-400 focus:outline-none"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !query.trim()}
              className="h-12 px-6 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  추천받기
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.form>

      {/* Recommendation Results */}
      <AnimatePresence>
        {showResults && recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI 추천 결과
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    &ldquo;{recommendations.query}&rdquo;에 대한 {recommendations.total}개의 추천
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCloseResults}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Keywords detected */}
              {recommendations.meta.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {recommendations.meta.keywords.slice(0, 5).map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.tool.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/tool/${rec.tool.slug}`}>
                      <div className="group p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all">
                        <div className="flex items-start gap-3">
                          {/* Logo */}
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
                            {rec.tool.logo ? (
                              <Image
                                src={rec.tool.logo}
                                alt={rec.tool.name}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-purple-400">
                                {rec.tool.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                                {rec.tool.name}
                              </h4>
                              {rec.score >= 10 && (
                                <Badge variant="hot" className="text-[10px] px-1.5 py-0">
                                  TOP
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-400">{rec.tool.rating.toFixed(1)}</span>
                              </div>
                              <Badge variant={rec.tool.pricing.free ? 'free' : 'pro'} className="text-[10px]">
                                {rec.tool.pricing.free ? '무료' : '유료'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {rec.tool.description}
                            </p>
                          </div>
                        </div>

                        {/* Matched Keywords */}
                        {rec.matchedKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {rec.matchedKeywords.slice(0, 3).map((kw) => (
                              <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/explore?q=${encodeURIComponent(recommendations.query)}`)}
                >
                  모든 도구 탐색
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Workflow Buttons */}
      {!showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">인기 워크플로우</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickWorkflows.map((workflow, index) => (
              <motion.button
                key={workflow.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                onClick={() => handleQuickWorkflow(workflow.query)}
                disabled={isLoading}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 hover:border-purple-500/50 transition-all duration-200 disabled:opacity-50"
              >
                <workflow.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                <span className="text-sm text-gray-300 group-hover:text-white">{workflow.label}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
