import { NextRequest, NextResponse } from 'next/server'
import { searchTools } from '@/lib/data'

// Simple keyword-based recommendation algorithm
// In production, this could use AI/ML models for better recommendations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '6', 10)

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

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
    }

    // Extract relevant categories from query
    const lowerQuery = query.toLowerCase()
    const relevantCategories = new Set<string>()

    Object.entries(keywordMap).forEach(([keyword, categories]) => {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        categories.forEach(cat => relevantCategories.add(cat))
      }
    })

    // Search for tools
    let recommendations = await searchTools(query)

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
      .slice(0, limit)

    return NextResponse.json({
      query,
      recommendations,
      total: recommendations.length,
    })
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}
