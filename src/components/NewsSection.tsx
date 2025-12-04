'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Newspaper, ArrowRight, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils'
import type { NewsItem } from '@/types'

interface NewsSectionProps {
  news: NewsItem[]
}

export function NewsSection({ news }: NewsSectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
              <Newspaper className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI 뉴스</h2>
              <p className="text-sm text-gray-400">최신 AI 소식을 확인하세요</p>
            </div>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/news" className="flex items-center gap-2">
              전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <Card className="group cursor-pointer card-hover h-full overflow-hidden">
                  {/* Image */}
                  {item.image && (
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                  )}

                  <CardContent className={item.image ? 'p-4 -mt-8 relative' : 'p-4'}>
                    <div className="flex items-center gap-2 mb-2">
                      {item.isHot && <Badge variant="hot">HOT</Badge>}
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>

                    <h3 className="font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors mb-2">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(item.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        {item.source}
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
