import { NextRequest, NextResponse } from 'next/server'
import { getAllTools } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || undefined
    const category = searchParams.get('category') || undefined
    const pricing = searchParams.get('pricing') || undefined

    const tools = await getAllTools({
      query,
      category,
      pricing,
    })

    return NextResponse.json({ tools, total: tools.length })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
}
