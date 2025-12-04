'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 rounded-full bg-red-500/10 p-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white">문제가 발생했습니다</h1>
      <p className="mb-2 text-gray-400">페이지를 로드하는 중 오류가 발생했습니다.</p>
      {error.digest && (
        <p className="mb-6 text-sm text-gray-500">오류 코드: {error.digest}</p>
      )}
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          다시 시도
        </Button>
        <Button onClick={() => (window.location.href = '/')}>
          <Home className="mr-2 h-4 w-4" />
          홈으로
        </Button>
      </div>
    </div>
  )
}
