import { Skeleton } from '@/components/ui/skeleton'

export default function CompareLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Tool Selection */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>

      {/* Comparison Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-white/5 p-4">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-t border-white/10 p-4">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
