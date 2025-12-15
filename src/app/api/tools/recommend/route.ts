import { NextRequest } from 'next/server'
import { getAllTools } from '@/lib/data'
import { toolRecommendSchema, parseSearchParams } from '@/lib/validations'
import { apiSuccess, handleApiError, apiError, ERROR_CODES } from '@/lib/api-utils'
import { getRecommendations } from '@/lib/recommendation-engine'

export async function GET(request: NextRequest) {
  try {
    const params = parseSearchParams(toolRecommendSchema, request.nextUrl.searchParams)

    if (!params.q) {
      return apiError(ERROR_CODES.BAD_REQUEST, 'Query is required')
    }

    // Get all tools
    const { tools: allTools } = await getAllTools({})

    // Get recommendations using the enhanced engine
    const result = getRecommendations(allTools, params.q, {
      limit: params.limit,
      minScore: 3,
    })

    return apiSuccess({
      query: params.q,
      recommendations: result.recommendations,
      total: result.recommendations.length,
      meta: {
        detectedCategories: result.detectedCategories,
        keywords: result.keywords,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
