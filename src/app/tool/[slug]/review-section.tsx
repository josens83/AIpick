'use client'

import { useState } from 'react'
import { ReviewForm } from '@/components/ReviewForm'
import { ReviewList } from '@/components/ReviewList'

interface ReviewSectionProps {
  toolId: string
}

export function ReviewSection({ toolId }: ReviewSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleReviewSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <ReviewForm toolId={toolId} onSuccess={handleReviewSuccess} />
      <ReviewList toolId={toolId} refreshTrigger={refreshTrigger} />
    </div>
  )
}
