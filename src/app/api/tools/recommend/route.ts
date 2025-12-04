import { NextRequest } from 'next/server'
import { searchTools } from '@/lib/data'
import { toolRecommendSchema, parseSearchParams } from '@/lib/validations'
import { apiSuccess, handleApiError, apiError, ERROR_CODES } from '@/lib/api-utils'

// Keyword mapping for better recommendations
const keywordMap: Record<string, string[]> = {
  '글쓰기': ['writing', 'chatbot', 'productivity'],
  '블로그': ['writing', 'chatbot', 'productivity'],
  '이미지': ['image', 'design'],
  '그림': ['image', 'design'],
  '영상': ['video'],
  '동영상': ['video'],
  '코드': ['coding'],
  '코딩': ['coding'],
  '프로그래밍': ['coding'],
  '음악': ['audio'],
  '오디오': ['audio', 'voice'],
  '챗봇': ['chatbot'],
  '대화': ['chatbot'],
  'PPT': ['presentation', 'productivity'],
  '프레젠테이션': ['presentation', 'productivity'],
  '이메일': ['writing', 'marketing'],
  '마케팅': ['marketing', 'writing'],
  writing: ['writing', 'chatbot'],
  image: ['image', 'design'],
  video: ['video'],
  code: ['coding'],
  coding: ['coding'],
  music: ['audio'],
  chat: ['chatbot'],
  presentation: ['presentation', 'productivity'],
  email: ['writing', 'marketing'],
  marketing: ['marketing', 'writing'],
}

export async function GET(request: NextRequest) {
  try {
    const params = parseSearchParams(toolRecommendSchema, request.nextUrl.searchParams)

    if (!params.q) {
      return apiError(ERROR_CODES.BAD_REQUEST, 'Query is required')
    }

    // Extract relevant categories from query
    const lowerQuery = params.q.toLowerCase()
    const relevantCategories = new Set<string>()

    Object.entries(keywordMap).forEach(([keyword, categories]) => {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        categories.forEach((cat) => relevantCategories.add(cat))
      }
    })

    // Search for tools
    let recommendations = await searchTools(params.q)

    // Sort by relevance and rating
    recommendations = recommendations
      .sort((a, b) => {
        // Prioritize tools in relevant categories
        const aRelevant = relevantCategories.has(a.category) ? 1 : 0
        const bRelevant = relevantCategories.has(b.category) ? 1 : 0

        if (aRelevant !== bRelevant) {
          return bRelevant - aRelevant
        }

        // Then sort by rating
        return b.rating - a.rating
      })
      .slice(0, params.limit)

    return apiSuccess({
      query: params.q,
      recommendations,
      total: recommendations.length,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
