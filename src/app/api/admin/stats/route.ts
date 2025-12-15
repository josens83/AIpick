import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/admin'
import { apiSuccess, handleApiError, apiError, ERROR_CODES } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return apiError(ERROR_CODES.UNAUTHORIZED, 'Authentication required')
    }

    const isUserAdmin = await isAdmin(session.user.id)
    if (!isUserAdmin) {
      return apiError(ERROR_CODES.FORBIDDEN, 'Admin access required')
    }

    // Get date range from query params with bounds validation
    const searchParams = request.nextUrl.searchParams
    const rawDays = parseInt(searchParams.get('days') || '30', 10)
    const days = Math.min(Math.max(isNaN(rawDays) ? 30 : rawDays, 1), 365)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch statistics in parallel
    const [
      totalUsers,
      newUsers,
      totalTools,
      totalReviews,
      newReviews,
      totalNewsletterSubscribers,
      recentActivity,
      topTools,
      reviewStats,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // New users in period
      prisma.user.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Total tools
      prisma.tool.count(),

      // Total reviews
      prisma.review.count(),

      // New reviews in period
      prisma.review.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Newsletter subscribers
      prisma.newsletter.count(),

      // Recent activity (last 10 actions)
      prisma.review.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          tool: { select: { name: true } },
        },
      }),

      // Top rated tools
      prisma.tool.findMany({
        take: 5,
        orderBy: { rating: 'desc' },
        select: {
          id: true,
          name: true,
          rating: true,
          reviewCount: true,
          category: true,
        },
      }),

      // Review statistics
      prisma.review.aggregate({
        _avg: { rating: true },
        _count: true,
      }),
    ])

    // Calculate growth percentages
    const previousPeriodStart = new Date(startDate)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days)

    const previousNewUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    })

    const userGrowth =
      previousNewUsers > 0
        ? ((newUsers - previousNewUsers) / previousNewUsers) * 100
        : newUsers > 0
          ? 100
          : 0

    return apiSuccess({
      overview: {
        totalUsers,
        newUsers,
        userGrowth: Math.round(userGrowth * 10) / 10,
        totalTools,
        totalReviews,
        newReviews,
        totalNewsletterSubscribers,
        averageRating: reviewStats._avg.rating || 0,
      },
      topTools,
      recentActivity: recentActivity.map((review) => ({
        type: 'review',
        user: review.user.name || review.user.email,
        action: `reviewed ${review.tool.name}`,
        rating: review.rating,
        date: review.createdAt,
      })),
      period: {
        days,
        startDate,
        endDate: new Date(),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
