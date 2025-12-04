'use client'

import { motion } from 'framer-motion'
import { Database, Users, Star, Sparkles } from 'lucide-react'

const stats = [
  { icon: Database, label: 'AI 도구', value: '500+', color: 'text-purple-400' },
  { icon: Users, label: '월간 사용자', value: '50K+', color: 'text-pink-400' },
  { icon: Star, label: '리뷰', value: '10K+', color: 'text-yellow-400' },
  { icon: Sparkles, label: '추천 정확도', value: '95%', color: 'text-cyan-400' },
]

export function StatsSection() {
  return (
    <section className="py-12 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-3 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
