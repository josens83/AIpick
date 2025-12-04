'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ExternalLink, Heart, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Tool } from '@/types'

interface ToolCardProps {
  tool: Tool
  index?: number
  onFavorite?: (toolId: string) => void
  isFavorited?: boolean
}

export function ToolCard({ tool, index = 0, onFavorite, isFavorited = false }: ToolCardProps) {
  const { data: session } = useSession()

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onFavorite) {
      onFavorite(tool.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/tool/${tool.slug}`}>
        <Card className="group relative overflow-hidden card-hover cursor-pointer h-full">
          {/* Featured Badge */}
          {tool.featured && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="hot">추천</Badge>
            </div>
          )}

          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/10 p-2">
                {tool.logo ? (
                  <Image
                    src={tool.logo}
                    alt={tool.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-purple-400">
                    {tool.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                    {tool.name}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">
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
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-white">
                    {tool.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({tool.reviewCount})
                  </span>
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
}
