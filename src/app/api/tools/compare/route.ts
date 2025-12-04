import { NextRequest } from 'next/server'
import { getToolBySlug } from '@/lib/data'
import { toolCompareBodySchema } from '@/lib/validations'
import { apiSuccess, handleApiError, apiError, ERROR_CODES } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolSlugs } = toolCompareBodySchema.parse(body)

    const tools = await Promise.all(toolSlugs.map((slug: string) => getToolBySlug(slug)))

    const validTools = tools.filter(Boolean)

    if (validTools.length === 0) {
      return apiError(ERROR_CODES.NOT_FOUND, 'No valid tools found')
    }

    // Generate comparison data
    const comparison = {
      tools: validTools,
      features: {
        freePlan: validTools.map((t) => t?.pricing.free),
        rating: validTools.map((t) => t?.rating),
        reviewCount: validTools.map((t) => t?.reviewCount),
        userCount: validTools.map((t) => t?.userCount),
        category: validTools.map((t) => t?.category),
      },
    }

    return apiSuccess(comparison)
  } catch (error) {
    return handleApiError(error)
  }
}
