'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, MoreVertical, Trash2, Edit2, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { cn, formatDate, getInitials } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface Review {
  id: string
  rating: number
  title: string | null
  content: string
  helpful: number
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

interface ReviewListProps {
  toolId: string
  refreshTrigger?: number
}

export function ReviewList({ toolId, refreshTrigger }: ReviewListProps) {
  const { data: session } = useSession()
  const { toast } = useToast()

  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sort, setSort] = useState<'newest' | 'helpful' | 'rating'>('newest')
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchReviews(true)
  }, [toolId, sort, refreshTrigger])

  const fetchReviews = async (reset = false) => {
    try {
      setIsLoading(true)
      const currentPage = reset ? 1 : page

      const response = await fetch(
        `/api/reviews?toolId=${toolId}&page=${currentPage}&limit=10&sort=${sort}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        if (reset) {
          setReviews(data.data)
          setPage(1)
        } else {
          setReviews((prev) => [...prev, ...data.data])
        }
        setHasMore(data.data.length === 10)
      }
    } catch (error) {
      logger.error('Failed to fetch reviews', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHelpful = async (reviewId: string) => {
    if (helpfulClicked.has(reviewId)) return

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      })

      if (response.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
          )
        )
        setHelpfulClicked((prev) => new Set([...prev, reviewId]))
      }
    } catch (error) {
      logger.error('Failed to mark as helpful', error)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('정말 이 리뷰를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId))
        toast({
          title: '리뷰가 삭제되었습니다',
        })
      }
    } catch (error) {
      toast({
        title: '삭제 실패',
        description: '다시 시도해주세요',
        variant: 'destructive',
      })
    }
  }

  const loadMore = () => {
    setPage((prev) => prev + 1)
    fetchReviews(false)
  }

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          리뷰 {reviews.length > 0 && `(${reviews.length})`}
        </h3>
        <div className="flex gap-2">
          {(['newest', 'helpful', 'rating'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSort(option)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm transition-colors',
                sort === option
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {option === 'newest' && '최신순'}
              {option === 'helpful' && '유용한순'}
              {option === 'rating' && '평점순'}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {isLoading && reviews.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-gray-400">아직 작성된 리뷰가 없습니다</p>
          <p className="mt-1 text-sm text-gray-500">첫 번째 리뷰를 작성해보세요!</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.user.image || undefined} />
                    <AvatarFallback>
                      {getInitials(review.user.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">
                      {review.user.name || 'Anonymous'}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'h-4 w-4',
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {session?.user?.id === review.user.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDelete(review.id)}
                        className="text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Title */}
              {review.title && (
                <h4 className="mb-2 font-medium text-white">{review.title}</h4>
              )}

              {/* Content */}
              <p className="mb-4 whitespace-pre-wrap text-gray-300">{review.content}</p>

              {/* Footer */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(review.id)}
                  disabled={helpfulClicked.has(review.id)}
                  className={cn(
                    'flex items-center gap-1.5 text-sm transition-colors',
                    helpfulClicked.has(review.id)
                      ? 'text-purple-400'
                      : 'text-gray-400 hover:text-purple-400'
                  )}
                >
                  <ThumbsUp className="h-4 w-4" />
                  유용해요 {review.helpful > 0 && `(${review.helpful})`}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Load More */}
      {hasMore && reviews.length > 0 && (
        <div className="text-center">
          <Button variant="outline" onClick={loadMore} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            더 보기
          </Button>
        </div>
      )}
    </div>
  )
}
