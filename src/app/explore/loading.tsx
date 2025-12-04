import { ToolGridSkeleton } from '@/components/ui/skeleton'

export default function ExploreLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-white/10" />
        <div className="h-6 w-96 animate-pulse rounded-lg bg-white/10" />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-white/10" />
        <div className="h-10 w-40 animate-pulse rounded-lg bg-white/10" />
        <div className="h-10 w-40 animate-pulse rounded-lg bg-white/10" />
      </div>

      {/* Results count */}
      <div className="mb-6 h-6 w-32 animate-pulse rounded bg-white/10" />

      {/* Grid */}
      <ToolGridSkeleton count={9} />
    </div>
  )
}
