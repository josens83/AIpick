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

// Update a review
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    if (review.userId !== session.user.id) {
      return apiError(ERROR_CODES.FORBIDDEN, '본인의 리뷰만 수정할 수 있습니다')
    }

    const body = await request.json()
    const { rating, title, content } = body

    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...(rating !== undefined && { rating }),
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update tool rating
    if (rating !== undefined) {
      const allReviews = await prisma.review.findMany({
        where: { toolId: review.toolId },
        select: { rating: true },
      })

      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      await prisma.tool.update({
        where: { id: review.toolId },
        data: { rating: avgRating },
      })
    }

    return apiSuccess(updatedReview)
  } catch (error) {
    return handleApiError(error)
  }
}

// Delete a review
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

    if (review.userId !== session.user.id) {
      return apiError(ERROR_CODES.FORBIDDEN, '본인의 리뷰만 삭제할 수 있습니다')
    }

    await prisma.review.delete({
      where: { id: params.id },
    })

    // Update tool rating and review count
    const allReviews = await prisma.review.findMany({
      where: { toolId: review.toolId },
      select: { rating: true },
    })

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0

    await prisma.tool.update({
      where: { id: review.toolId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    })

    return apiSuccess({ message: 'Review deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
