import { NextRequest } from 'next/server'
import { getLatestNews } from '@/lib/data'
import { apiSuccess, handleApiError } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10), 1), 50)

    let news = await getLatestNews()

    // Filter by category if provided
    if (category && category !== '전체') {
      news = news.filter(item => item.category === category)
    }

    // Limit results
    news = news.slice(0, limit)

    return apiSuccess({ news, total: news.length })
  } catch (error) {
    return handleApiError(error)
  }
}
