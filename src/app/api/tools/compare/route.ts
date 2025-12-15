import { NextRequest } from 'next/server'
import { getToolBySlug } from '@/lib/data'
import { toolCompareBodySchema } from '@/lib/validations'
import { apiSuccess, handleApiError, apiError, ERROR_CODES } from '@/lib/api-utils'
import type { Tool } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolSlugs } = toolCompareBodySchema.parse(body)

    const tools = await Promise.all(toolSlugs.map((slug: string) => getToolBySlug(slug)))

    // Filter out null results and type correctly
    const validTools = tools.filter((t): t is Tool => t !== null)

    if (validTools.length === 0) {
      return apiError(ERROR_CODES.NOT_FOUND, 'No valid tools found')
    }

    // Generate comparison data with proper null checks
    const comparison = {
      tools: validTools,
      features: {
        freePlan: validTools.map((t) => t.pricing?.free ?? false),
        rating: validTools.map((t) => t.rating ?? 0),
        reviewCount: validTools.map((t) => t.reviewCount ?? 0),
        userCount: validTools.map((t) => t.userCount),
        category: validTools.map((t) => t.category),
      },
    }

    return apiSuccess(comparison)
  } catch (error) {
    return handleApiError(error)
  }
}
