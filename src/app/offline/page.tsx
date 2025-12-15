import { WifiOff, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: '오프라인 - AIpick',
}

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-gray-800 p-6">
        <WifiOff className="h-16 w-16 text-gray-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white">오프라인 상태입니다</h1>
      <p className="mb-8 max-w-md text-gray-400">
        인터넷 연결을 확인해주세요. 연결이 복구되면 자동으로 새로고침됩니다.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          새로고침
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            홈으로
          </Link>
        </Button>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        일부 캐시된 페이지는 오프라인에서도 볼 수 있습니다
      </p>
    </div>
  )
}
