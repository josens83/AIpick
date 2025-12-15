import { NextRequest } from 'next/server'
import { getToolBySlug, getRelatedTools } from '@/lib/data'
import { apiSuccess, apiError, handleApiError, ERROR_CODES } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const tool = await getToolBySlug(slug)

    if (!tool) {
      return apiError(ERROR_CODES.NOT_FOUND, 'Tool not found')
    }

    const relatedTools = await getRelatedTools(tool, 3)

    return apiSuccess({ tool, relatedTools })
  } catch (error) {
    return handleApiError(error)
  }
}
