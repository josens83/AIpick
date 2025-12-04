'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="ko">
      <body className="bg-[#0A0A0F]">
        <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 rounded-full bg-red-500/10 p-4">
            <svg
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            심각한 오류가 발생했습니다
          </h1>
          <p className="mb-6 text-gray-400">
            애플리케이션에 문제가 발생했습니다. 다시 시도해주세요.
          </p>
          {error.digest && (
            <p className="mb-6 text-sm text-gray-500">오류 코드: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-700"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  )
}
