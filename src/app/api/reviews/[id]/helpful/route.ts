import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  apiSuccess,
  handleApiError,
  apiError,
  ERROR_CODES,
} from '@/lib/api-utils'

interface RouteParams {
  params: { id: string }
}

// Mark a review as helpful
export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return apiError(ERROR_CODES.UNAUTHORIZED, 'Authentication required')
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    })

    if (!review) {
      return apiError(ERROR_CODES.NOT_FOUND, 'Review not found')
    }

    // Increment helpful count
    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        helpful: { increment: 1 },
      },
    })

    return apiSuccess({ helpful: updatedReview.helpful })
  } catch (error) {
    return handleApiError(error)
  }
}
