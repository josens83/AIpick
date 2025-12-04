'use client'

import Link from 'next/link'
import Image from 'next/image'
import { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, ExternalLink, Heart, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import type { Tool } from '@/types'

interface ToolCardProps {
  tool: Tool
  index?: number
  onFavorite?: (toolId: string) => void
  isFavorited?: boolean
}

// Memoized component for performance
export const ToolCard = memo(function ToolCard({
  tool,
  index = 0,
  onFavorite,
  isFavorited = false,
}: ToolCardProps) {
  const { data: session } = useSession()

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onFavorite?.(tool.id)
    },
    [onFavorite, tool.id]
  )

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      className="transform-gpu will-change-transform"
    >
      <Link href={`/tool/${tool.slug}`} prefetch={false}>
        <Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
          {/* Featured Badge */}
          {tool.featured && (
            <div className="absolute right-3 top-3 z-10">
              <Badge variant="hot">추천</Badge>
            </div>
          )}

          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Logo with lazy loading */}
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/10 p-2">
                {tool.logo ? (
                  <Image
                    src={tool.logo}
                    alt={tool.name}
                    fill
                    sizes="56px"
                    className="object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-purple-400">
                    {tool.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-white transition-colors group-hover:text-purple-300">
                    {tool.name}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tool.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex items-center gap-4">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-white">
                    {tool.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">({tool.reviewCount})</span>
                </div>

                {/* Users */}
                {tool.userCount && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span className="text-xs">{tool.userCount}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Pricing */}
                <Badge variant={tool.pricing.free ? 'free' : 'pro'}>
                  {tool.pricing.free ? '무료' : '유료'}
                </Badge>

                {/* Favorite Button */}
                {session && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleFavorite}
                  >
                    <Heart
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isFavorited
                          ? 'fill-pink-500 text-pink-500'
                          : 'text-gray-400 hover:text-pink-400'
                      )}
                    />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
})

ToolCard.displayName = 'ToolCard'
