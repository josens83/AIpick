import { NewsGridSkeleton } from '@/components/ui/skeleton'

export default function NewsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-white/10" />
        <div className="h-6 w-80 animate-pulse rounded-lg bg-white/10" />
      </div>

      {/* Featured */}
      <div className="mb-12">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-white/10" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-white/10" />
          <div className="space-y-4">
            <div className="h-36 animate-pulse rounded-xl bg-white/10" />
            <div className="h-36 animate-pulse rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      {/* All News */}
      <div className="mb-4 h-6 w-32 animate-pulse rounded bg-white/10" />
      <NewsGridSkeleton count={8} />
    </div>
  )
}
