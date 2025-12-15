'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, Share2, Check, Copy, Twitter, Facebook, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface ActionButtonsProps {
  toolId: string
  toolSlug: string
  toolName: string
  initialFavorited?: boolean
}

export function ActionButtons({ toolId, toolSlug, toolName, initialFavorited = false }: ActionButtonsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFavorite = async () => {
    if (!session) {
      toast({
        title: '로그인이 필요합니다',
        description: '즐겨찾기를 사용하려면 로그인해주세요.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, action: isFavorited ? 'remove' : 'add' }),
      })

      const data = await response.json()

      if (data.success) {
        setIsFavorited(!isFavorited)
        toast({
          title: isFavorited ? '즐겨찾기에서 제거됨' : '즐겨찾기에 추가됨',
          description: isFavorited
            ? `${toolName}이(가) 즐겨찾기에서 제거되었습니다.`
            : `${toolName}이(가) 즐겨찾기에 추가되었습니다.`,
        })
      } else {
        throw new Error(data.error?.message)
      }
    } catch (error) {
      toast({
        title: '오류가 발생했습니다',
        description: '다시 시도해 주세요.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/tool/${toolSlug}`
    : `/tool/${toolSlug}`

  const shareText = `${toolName} - AI 도구 리뷰 | AIpick`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: '링크가 복사되었습니다',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: '복사에 실패했습니다',
        variant: 'destructive',
      })
    }
  }

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: toolName,
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled or share failed
      }
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={handleFavorite}
        disabled={isLoading}
        className={cn(
          'transition-colors',
          isFavorited && 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20'
        )}
      >
        <Heart className={cn('mr-2 h-4 w-4', isFavorited && 'fill-current')} />
        {isFavorited ? '즐겨찾기됨' : '즐겨찾기'}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg">
            <Share2 className="mr-2 h-4 w-4" />
            공유
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopyLink}>
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-400" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            링크 복사
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToTwitter}>
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToFacebook}>
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToLinkedIn}>
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </DropdownMenuItem>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="mr-2 h-4 w-4" />
              더 보기...
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
