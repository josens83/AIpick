'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Newspaper, Clock, ExternalLink, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatRelativeTime } from '@/lib/utils'
import { getLatestNews } from '@/lib/data'
import type { NewsItem } from '@/types'

const categories = ['전체', '출시', '업데이트', '튜토리얼', '산업뉴스']

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLatestNews().then((data) => {
      setNews(data)
      setFilteredNews(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (selectedCategory === '전체') {
      setFilteredNews(news)
    } else {
      setFilteredNews(news.filter((item) => item.category === selectedCategory))
    }
  }, [selectedCategory, news])

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
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
              <Newspaper className="w-5 h-5 text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">AI 뉴스</h1>
          </div>
          <p className="text-gray-400">최신 AI 소식과 업데이트를 확인하세요</p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <Card className="p-12 text-center">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">해당 카테고리의 뉴스가 없습니다</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <Card className="group cursor-pointer card-hover h-full overflow-hidden">
                    {/* Image */}
                    {item.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        {item.isHot && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="hot">HOT</Badge>
                          </div>
                        )}
                      </div>
                    )}

                    <CardContent className={item.image ? 'p-5 -mt-8 relative' : 'p-5'}>
                      {!item.image && (
                        <div className="flex items-center gap-2 mb-3">
                          {item.isHot && <Badge variant="hot">HOT</Badge>}
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                      )}

                      {item.image && (
                        <Badge variant="secondary" className="mb-3">
                          {item.category}
                        </Badge>
                      )}

                      <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:text-purple-300 transition-colors mb-2">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatRelativeTime(item.publishedAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          {item.source}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16"
        >
          <Card className="overflow-hidden">
            <div className="relative p-8 sm:p-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
              <div className="absolute inset-0 bg-grid-white/5" />
              <div className="relative max-w-2xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  AI 뉴스레터 구독하기
                </h2>
                <p className="text-gray-300 mb-6">
                  매주 최신 AI 소식, 도구 업데이트, 그리고 유용한 팁을 받아보세요
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="이메일 주소"
                    className="flex-1 h-12 px-4 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <Button size="lg" className="h-12">
                    구독하기
                  </Button>
                </form>
                <p className="mt-3 text-xs text-gray-400">
                  구독은 언제든 취소할 수 있습니다
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
