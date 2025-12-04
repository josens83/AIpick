import { PricingCardSkeleton } from '@/components/ui/skeleton'

export default function PricingLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded-lg bg-white/10" />
        <div className="mx-auto h-6 w-96 animate-pulse rounded-lg bg-white/10" />
      </div>

      {/* Toggle */}
      <div className="mx-auto mb-8 h-12 w-64 animate-pulse rounded-full bg-white/10" />

      {/* Pricing Cards */}
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        <PricingCardSkeleton />
        <PricingCardSkeleton />
        <PricingCardSkeleton />
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-16 max-w-3xl">
        <div className="mx-auto mb-8 h-8 w-32 animate-pulse rounded bg-white/10" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
