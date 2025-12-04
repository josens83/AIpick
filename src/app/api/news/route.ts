import { NextRequest, NextResponse } from 'next/server'
import { getLatestNews } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    let news = await getLatestNews()

    // Filter by category if provided
    if (category && category !== '전체') {
      news = news.filter(item => item.category === category)
    }

    // Limit results
    news = news.slice(0, limit)

    return NextResponse.json({ news, total: news.length })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
