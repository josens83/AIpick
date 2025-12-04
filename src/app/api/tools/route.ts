import { NextRequest } from 'next/server'
import { getAllTools } from '@/lib/data'
import { toolQuerySchema, parseSearchParams } from '@/lib/validations'
import { apiSuccess, handleApiError } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const params = parseSearchParams(toolQuerySchema, request.nextUrl.searchParams)

    const tools = await getAllTools({
      query: params.q,
      category: params.category,
      pricing: params.pricing || undefined,
    })

    return apiSuccess({
      tools,
      total: tools.length,
      page: params.page,
      limit: params.limit,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
