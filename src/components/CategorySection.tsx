'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText,
  Image,
  Video,
  Music,
  Code,
  MessageSquare,
  Presentation,
  Mail,
  Brain,
  Mic,
  PenTool,
  BarChart,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  { icon: FileText, name: '글쓰기', slug: 'writing', color: 'from-blue-500 to-cyan-500', count: 120 },
  { icon: Image, name: '이미지', slug: 'image', color: 'from-purple-500 to-pink-500', count: 85 },
  { icon: Video, name: '영상', slug: 'video', color: 'from-red-500 to-orange-500', count: 45 },
  { icon: Music, name: '오디오', slug: 'audio', color: 'from-green-500 to-emerald-500', count: 30 },
  { icon: Code, name: '코딩', slug: 'coding', color: 'from-yellow-500 to-orange-500', count: 95 },
  { icon: MessageSquare, name: '챗봇', slug: 'chatbot', color: 'from-indigo-500 to-purple-500', count: 60 },
  { icon: Presentation, name: '프레젠테이션', slug: 'presentation', color: 'from-pink-500 to-rose-500', count: 25 },
  { icon: Mail, name: '마케팅', slug: 'marketing', color: 'from-cyan-500 to-blue-500', count: 55 },
  { icon: Brain, name: '생산성', slug: 'productivity', color: 'from-violet-500 to-purple-500', count: 110 },
  { icon: Mic, name: '음성', slug: 'voice', color: 'from-teal-500 to-green-500', count: 35 },
  { icon: PenTool, name: '디자인', slug: 'design', color: 'from-rose-500 to-pink-500', count: 70 },
  { icon: BarChart, name: '데이터', slug: 'data', color: 'from-amber-500 to-yellow-500', count: 40 },
]

export function CategorySection() {
  return (
    <section
      aria-labelledby="category-section-title"
      className="py-16 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 id="category-section-title" className="text-2xl font-bold text-white mb-2">카테고리별 탐색</h2>
          <p className="text-gray-400">필요한 분야의 AI 도구를 찾아보세요</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                  href={`/explore?category=${category.slug}`}
                  aria-label={`${category.name} 카테고리 - ${category.count}개 도구 보기`}
                >
                <Card className="group cursor-pointer card-hover h-full">
                  <CardContent className="p-4 text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} mb-3 group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-white text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-400">{category.count}개 도구</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
