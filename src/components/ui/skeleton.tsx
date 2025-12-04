import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-white/10', className)}
      {...props}
    />
  )
}

// Tool Card Skeleton
function ToolCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-12 w-full" />
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="ml-auto h-4 w-24" />
      </div>
    </div>
  )
}

// Grid of Tool Card Skeletons
function ToolGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  )
}

// News Card Skeleton
function NewsCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

// News Grid Skeleton
function NewsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Category Skeleton
function CategorySkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

// Category Grid Skeleton
function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  )
}

// Tool Detail Skeleton
function ToolDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <Skeleton className="h-24 w-24 rounded-2xl" />
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex gap-4 border-b border-white/10 pb-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}

// Pricing Card Skeleton
function PricingCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="mt-4 h-10 w-32" />
      <Skeleton className="mt-2 h-4 w-20" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-8 h-12 w-full rounded-lg" />
    </div>
  )
}

// Search Input Skeleton
function SearchSkeleton() {
  return (
    <div className="w-full max-w-2xl">
      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  )
}

// Table Skeleton
function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="bg-white/5 p-4">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-t border-white/10 p-4">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export {
  Skeleton,
  ToolCardSkeleton,
  ToolGridSkeleton,
  NewsCardSkeleton,
  NewsGridSkeleton,
  CategorySkeleton,
  CategoryGridSkeleton,
  ToolDetailSkeleton,
  PricingCardSkeleton,
  SearchSkeleton,
  TableSkeleton,
}
