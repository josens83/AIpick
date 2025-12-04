'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToolCard } from '@/components/ToolCard'
import { getAllTools } from '@/lib/data'
import type { Tool } from '@/types'

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    async function loadFavorites() {
      if (session?.user?.favorites && session.user.favorites.length > 0) {
        const allTools = await getAllTools()
        const favTools = allTools.filter(tool =>
          session.user.favorites.includes(tool.id)
        )
        setFavorites(favTools)
      }
      setLoading(false)
    }

    if (session) {
      loadFavorites()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

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
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-red-500/20">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">즐겨찾기</h1>
          </div>
          <p className="text-gray-400">저장한 AI 도구들을 확인하세요</p>
        </motion.div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} isFavorited />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              즐겨찾기가 비어있습니다
            </h3>
            <p className="text-gray-400 mb-4">
              마음에 드는 AI 도구를 찾아서 저장해보세요
            </p>
            <Button onClick={() => router.push('/explore')}>
              도구 탐색하기
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
