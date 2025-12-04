import { Suspense } from 'react'
import { ExploreContent } from './explore-content'
import { Skeleton } from '@/components/ui/skeleton'

interface ExplorePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function ExploreSkeleton() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-12 w-full max-w-xl" />
        </div>
        <div className="flex gap-8">
          <Skeleton className="hidden lg:block w-64 h-[600px] rounded-xl" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams

  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <ExploreContent searchParams={params} />
    </Suspense>
  )
}
