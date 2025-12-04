import { NextRequest, NextResponse } from 'next/server'
import { getToolBySlug, getRelatedTools } from '@/lib/data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const tool = await getToolBySlug(slug)

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    const relatedTools = await getRelatedTools(tool, 3)

    return NextResponse.json({ tool, relatedTools })
  } catch (error) {
    console.error('Error fetching tool:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    )
  }
}
