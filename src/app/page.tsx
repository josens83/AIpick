import { Suspense } from 'react'
import { WorkflowInput } from '@/components/WorkflowInput'
import { FeaturedTools } from '@/components/FeaturedTools'
import { CategorySection } from '@/components/CategorySection'
import { NewsSection } from '@/components/NewsSection'
import { CTASection } from '@/components/CTASection'
import { StatsSection } from '@/components/StatsSection'
import { Skeleton } from '@/components/ui/skeleton'
import { getFeaturedTools, getLatestNews } from '@/lib/data'

// Loading components
function FeaturedToolsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-xl" />
      ))}
    </div>
  )
}

function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-xl" />
      ))}
    </div>
  )
}

export default async function HomePage() {
  // Fetch data independently to avoid cascade failures
  const [featuredToolsResult, latestNewsResult] = await Promise.allSettled([
    getFeaturedTools(),
    getLatestNews(),
  ])

  const featuredTools = featuredToolsResult.status === 'fulfilled' ? featuredToolsResult.value : []
  const latestNews = latestNewsResult.status === 'fulfilled' ? latestNewsResult.value : []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              당신의 워크플로우에 맞는
              <br />
              <span className="gradient-text">완벽한 AI 도구</span>를 찾아보세요
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              500개 이상의 AI 도구 중에서 당신의 작업에 가장 적합한 도구를
              AI가 추천해드립니다
            </p>
          </div>

          <WorkflowInput />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Tools Section */}
      <Suspense fallback={<FeaturedToolsSkeleton />}>
        <FeaturedTools tools={featuredTools} />
      </Suspense>

      {/* Category Section */}
      <CategorySection />

      {/* News Section */}
      <Suspense fallback={<NewsSkeleton />}>
        <NewsSection news={latestNews} />
      </Suspense>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
