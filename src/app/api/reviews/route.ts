import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { reviewSchema } from '@/lib/validations'
import {
  apiSuccess,
  handleApiError,
  apiError,
  ERROR_CODES,
  apiPaginatedSuccess,
} from '@/lib/api-utils'
import { rateLimiters, getClientIp, withRateLimit } from '@/lib/rate-limit'

// Get reviews for a tool
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const toolId = searchParams.get('toolId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const sort = searchParams.get('sort') || 'newest' // newest, helpful, rating

    if (!toolId) {
      return apiError(ERROR_CODES.BAD_REQUEST, 'Tool ID is required')
    }

    // Build order by
    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'helpful') {
      orderBy = { helpful: 'desc' }
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' }
    }

    // Get total count
    const total = await prisma.review.count({
      where: { toolId },
    })

    // Get reviews with user info
    const reviews = await prisma.review.findMany({
      where: { toolId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    return apiPaginatedSuccess(reviews, page, limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

// Create a new review
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (5 requests per minute for review submissions)
    const rateLimitResult = await withRateLimit(
      request,
      rateLimiters.strict,
      getClientIp(request)
    )
    if (rateLimitResult) {
      return rateLimitResult
    }

    const session = await auth()

    if (!session?.user?.id) {
      return apiError(ERROR_CODES.UNAUTHORIZED, 'Authentication required')
    }

    const body = await request.json()
    const data = reviewSchema.parse(body)

    // Check if user already reviewed this tool
    const existingReview = await prisma.review.findFirst({
      where: {
        toolId: data.toolId,
        userId: session.user.id,
      },
    })

    if (existingReview) {
      return apiError(ERROR_CODES.CONFLICT, '이미 이 도구에 대한 리뷰를 작성하셨습니다')
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        toolId: data.toolId,
        userId: session.user.id,
        rating: data.rating,
        title: data.title,
        content: data.content,
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

    // Update tool rating and review count
    const allReviews = await prisma.review.findMany({
      where: { toolId: data.toolId },
      select: { rating: true },
    })

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.tool.update({
      where: { id: data.toolId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    })

    return apiSuccess(review)
  } catch (error) {
    return handleApiError(error)
  }
}
