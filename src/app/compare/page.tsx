'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GitCompare,
  Plus,
  X,
  Star,
  Check,
  Minus,
  ExternalLink,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getAllTools, getToolBySlug } from '@/lib/data'
import type { Tool } from '@/types'

function CompareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTools, setSelectedTools] = useState<Tool[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Tool[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Load tools from URL
  useEffect(() => {
    const toolsParam = searchParams.get('tools')
    if (toolsParam) {
      const slugs = toolsParam.split(',')
      Promise.all(slugs.map(slug => getToolBySlug(slug)))
        .then(tools => {
          setSelectedTools(tools.filter(Boolean) as Tool[])
        })
    }
  }, [searchParams])

  // Search tools
  useEffect(() => {
    if (searchQuery) {
      getAllTools({ query: searchQuery }).then(setSearchResults)
    } else {
      getAllTools().then(setSearchResults)
    }
  }, [searchQuery])

  const addTool = (tool: Tool) => {
    if (selectedTools.length < 3 && !selectedTools.find(t => t.id === tool.id)) {
      const newTools = [...selectedTools, tool]
      setSelectedTools(newTools)
      updateURL(newTools)
      setIsDialogOpen(false)
      setSearchQuery('')
    }
  }

  const removeTool = (toolId: string) => {
    const newTools = selectedTools.filter(t => t.id !== toolId)
    setSelectedTools(newTools)
    updateURL(newTools)
  }

  const updateURL = (tools: Tool[]) => {
    if (tools.length > 0) {
      router.push(`/compare?tools=${tools.map(t => t.slug).join(',')}`, { scroll: false })
    } else {
      router.push('/compare', { scroll: false })
    }
  }

  const features = [
    '무료 플랜',
    '평점',
    '리뷰 수',
    '사용자 수',
    '가격',
  ]

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
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <GitCompare className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">AI 도구 비교</h1>
          </div>
          <p className="text-gray-400">최대 3개의 AI 도구를 나란히 비교해보세요</p>
        </motion.div>

        {/* Tool Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((index) => {
            const tool = selectedTools[index]
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {tool ? (
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10 p-1">
                            {tool.logo ? (
                              <Image
                                src={tool.logo}
                                alt={tool.name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-purple-400">
                                {tool.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{tool.name}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-400">{tool.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-400"
                          onClick={() => removeTool(tool.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Dialog open={isDialogOpen && selectedTools.length === index} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Card className="h-full cursor-pointer hover:border-purple-500/50 transition-colors">
                        <CardContent className="p-4 flex items-center justify-center h-full min-h-[88px]">
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                              <Plus className="h-5 w-5 text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-400">도구 추가</span>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>도구 선택</DialogTitle>
                      </DialogHeader>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="도구 검색..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="max-h-[400px] overflow-auto space-y-2">
                        {searchResults
                          .filter(t => !selectedTools.find(st => st.id === t.id))
                          .map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => addTool(tool)}
                              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                            >
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10">
                                {tool.logo ? (
                                  <Image
                                    src={tool.logo}
                                    alt={tool.name}
                                    fill
                                    className="object-contain p-1"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-purple-400">
                                    {tool.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white truncate">{tool.name}</h4>
                                <p className="text-xs text-gray-400 truncate">{tool.description}</p>
                              </div>
                            </button>
                          ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Comparison Table */}
        {selectedTools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>비교표</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">기능</th>
                        {selectedTools.map((tool) => (
                          <th key={tool.id} className="text-center py-3 px-4 text-white font-medium">
                            {tool.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Free Plan */}
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4 text-gray-400">무료 플랜</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="text-center py-3 px-4">
                            {tool.pricing.free ? (
                              <Check className="h-5 w-5 text-green-400 mx-auto" />
                            ) : (
                              <Minus className="h-5 w-5 text-gray-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Rating */}
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4 text-gray-400">평점</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="text-center py-3 px-4">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-white">{tool.rating.toFixed(1)}</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Reviews */}
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4 text-gray-400">리뷰 수</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="text-center py-3 px-4 text-white">
                            {tool.reviewCount.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      {/* Users */}
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4 text-gray-400">사용자 수</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="text-center py-3 px-4 text-white">
                            {tool.userCount || '-'}
                          </td>
                        ))}
                      </tr>

                      {/* Category */}
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4 text-gray-400">카테고리</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="text-center py-3 px-4">
                            <Badge variant="secondary">{tool.category}</Badge>
                          </td>
                        ))}
                      </tr>

                      {/* Price */}
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4 text-gray-400">시작 가격</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="text-center py-3 px-4 text-white">
                            {tool.pricing.free
                              ? '무료'
                              : tool.pricing.plans[0]?.price || '-'}
                          </td>
                        ))}
                      </tr>

                      {/* Visit */}
                      <tr>
                        <td className="py-3 px-4 text-gray-400">방문</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="text-center py-3 px-4">
                            <Button variant="outline" size="sm" asChild>
                              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                방문
                              </a>
                            </Button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {selectedTools.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <GitCompare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">도구를 선택해주세요</h3>
            <p className="text-gray-400 mb-4">
              위의 카드를 클릭하여 비교할 AI 도구를 추가하세요
            </p>
            <Button variant="outline" asChild>
              <Link href="/explore">도구 탐색하기</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    }>
      <CompareContent />
    </Suspense>
  )
}
