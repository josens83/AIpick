import { NextRequest, NextResponse } from 'next/server'
import { getToolBySlug } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolSlugs } = body

    if (!toolSlugs || !Array.isArray(toolSlugs) || toolSlugs.length === 0) {
      return NextResponse.json(
        { error: 'Tool slugs are required' },
        { status: 400 }
      )
    }

    if (toolSlugs.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 tools can be compared' },
        { status: 400 }
      )
    }

    const tools = await Promise.all(
      toolSlugs.map((slug: string) => getToolBySlug(slug))
    )

    const validTools = tools.filter(Boolean)

    if (validTools.length === 0) {
      return NextResponse.json(
        { error: 'No valid tools found' },
        { status: 404 }
      )
    }

    // Generate comparison data
    const comparison = {
      tools: validTools,
      features: {
        freePlan: validTools.map(t => t?.pricing.free),
        rating: validTools.map(t => t?.rating),
        reviewCount: validTools.map(t => t?.reviewCount),
        userCount: validTools.map(t => t?.userCount),
        category: validTools.map(t => t?.category),
      },
    }

    return NextResponse.json(comparison)
  } catch (error) {
    console.error('Error comparing tools:', error)
    return NextResponse.json(
      { error: 'Failed to compare tools' },
      { status: 500 }
    )
  }
}
