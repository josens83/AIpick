'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  '무제한 AI 도구 추천',
  '상세한 도구 비교',
  '맞춤형 워크플로우 제안',
  '실시간 AI 뉴스',
]

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-slate-900 to-slate-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pro로 더 많은 기능을
            <br />
            <span className="gradient-text">경험해보세요</span>
          </h2>

          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            AIpick Pro는 더 정확한 추천, 상세한 분석, 그리고 독점 기능을 제공합니다.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
              >
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" asChild>
              <Link href="/pricing" className="flex items-center gap-2">
                Pro 시작하기
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/explore">무료로 둘러보기</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            7일 무료 체험 • 언제든 취소 가능
          </p>
        </motion.div>
      </div>
    </section>
  )
}
