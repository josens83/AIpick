'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Star, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface ReviewFormProps {
  toolId: string
  onSuccess?: () => void
}

export function ReviewForm({ toolId, onSuccess }: ReviewFormProps) {
  const { data: session } = useSession()
  const { toast } = useToast()

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: '로그인이 필요합니다',
        description: '리뷰를 작성하려면 먼저 로그인해주세요.',
        variant: 'destructive',
      })
      return
    }

    if (rating === 0) {
      toast({
        title: '별점을 선택해주세요',
        variant: 'destructive',
      })
      return
    }

    if (content.trim().length < 10) {
      toast({
        title: '리뷰 내용을 10자 이상 작성해주세요',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          rating,
          title: title.trim() || undefined,
          content: content.trim(),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to submit review')
      }

      toast({
        title: '리뷰가 등록되었습니다',
        description: '소중한 의견 감사합니다!',
      })

      // Reset form
      setRating(0)
      setTitle('')
      setContent('')

      onSuccess?.()
    } catch (error) {
      toast({
        title: '리뷰 등록 실패',
        description: error instanceof Error ? error.message : '다시 시도해주세요',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-gray-400">리뷰를 작성하려면 로그인이 필요합니다</p>
        <Button className="mt-4" asChild>
          <a href="/auth/signin">로그인하기</a>
        </Button>
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-white/5 p-6"
    >
      <h3 className="mb-4 text-lg font-semibold text-white">리뷰 작성</h3>

      {/* Rating Stars */}
      <div className="mb-4">
        <label className="mb-2 block text-sm text-gray-400">별점</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-500'
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 self-center text-sm text-gray-400">
              {rating === 5
                ? '최고예요!'
                : rating === 4
                  ? '좋아요'
                  : rating === 3
                    ? '보통이에요'
                    : rating === 2
                      ? '별로예요'
                      : '나빠요'}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="review-title" className="mb-2 block text-sm text-gray-400">
          제목 (선택)
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="리뷰 제목을 입력하세요"
          maxLength={100}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <label htmlFor="review-content" className="mb-2 block text-sm text-gray-400">
          리뷰 내용
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 도구에 대한 솔직한 의견을 작성해주세요 (최소 10자)"
          rows={4}
          maxLength={2000}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
        />
        <div className="mt-1 text-right text-xs text-gray-500">
          {content.length}/2000
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        리뷰 등록
      </Button>
    </motion.form>
  )
}
