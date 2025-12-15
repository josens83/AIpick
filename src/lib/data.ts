import type { Tool, NewsItem, Category, PricingInfo } from '@/types'
import prisma from './db'
import { logger } from './logger'

// Helper to transform Prisma Tool to our Tool type
function transformTool(dbTool: {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  url: string
  category: string
  tags: string[]
  pricing: unknown
  features: string[]
  pros: string[]
  cons: string[]
  rating: number
  reviewCount: number
  userCount: string | null
  featured: boolean
  createdAt: Date
  updatedAt: Date
}): Tool {
  return {
    ...dbTool,
    pricing: dbTool.pricing as PricingInfo,
  }
}

// Fallback mock data for development when DB is not available
const mockTools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: 'OpenAI의 대화형 AI 어시스턴트. 글쓰기, 코딩, 분석 등 다양한 작업을 도와줍니다.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
    url: 'https://chat.openai.com',
    category: 'chatbot',
    tags: ['AI 챗봇', '글쓰기', '코딩', '생산성'],
    pricing: { free: true, plans: [{ name: 'Plus', price: '$20/월', features: ['GPT-4 접근', '더 빠른 응답', '플러그인'] }] },
    features: ['자연어 대화', '코드 생성', '문서 분석', '이미지 생성 (GPT-4)'],
    pros: ['다양한 기능', '직관적인 인터페이스', '지속적인 업데이트'],
    cons: ['무료 버전 제한', '때때로 부정확한 정보'],
    rating: 4.8,
    reviewCount: 15420,
    userCount: '100M+',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'OpenAI, GPT-5 개발 중... 2024년 출시 예정',
    description: 'OpenAI가 차세대 언어 모델 GPT-5를 개발 중이며, 더욱 향상된 추론 능력을 갖출 것으로 예상됩니다.',
    url: 'https://example.com/news/gpt-5',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    source: 'AI Times',
    category: '업데이트',
    isHot: true,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
]

const mockCategories: Category[] = [
  { id: '1', name: '글쓰기', slug: 'writing', description: 'AI 글쓰기 도구', icon: 'FileText', toolCount: 120, order: 1 },
  { id: '2', name: '이미지', slug: 'image', description: 'AI 이미지 생성', icon: 'Image', toolCount: 85, order: 2 },
  { id: '3', name: '영상', slug: 'video', description: 'AI 영상 편집', icon: 'Video', toolCount: 45, order: 3 },
  { id: '4', name: '오디오', slug: 'audio', description: 'AI 오디오 처리', icon: 'Music', toolCount: 30, order: 4 },
  { id: '5', name: '코딩', slug: 'coding', description: 'AI 코딩 어시스턴트', icon: 'Code', toolCount: 95, order: 5 },
  { id: '6', name: '챗봇', slug: 'chatbot', description: 'AI 챗봇', icon: 'MessageSquare', toolCount: 60, order: 6 },
  { id: '7', name: '생산성', slug: 'productivity', description: 'AI 생산성 도구', icon: 'Brain', toolCount: 110, order: 7 },
  { id: '8', name: '마케팅', slug: 'marketing', description: 'AI 마케팅 도구', icon: 'Mail', toolCount: 55, order: 8 },
]

// Export categories for backward compatibility
export const categories = mockCategories

// Get featured tools
export async function getFeaturedTools(): Promise<Tool[]> {
  try {
    const tools = await prisma.tool.findMany({
      where: { featured: true },
      orderBy: { rating: 'desc' },
      take: 6,
    })

    if (tools.length === 0) {
      logger.warn('No featured tools in database, using mock data')
      return mockTools.filter(tool => tool.featured)
    }

    return tools.map(transformTool)
  } catch (error) {
    logger.error('Database error in getFeaturedTools:', error)
    return mockTools.filter(tool => tool.featured)
  }
}

// Get latest news
export async function getLatestNews(limit: number = 10): Promise<NewsItem[]> {
  try {
    const news = await prisma.newsItem.findMany({
      orderBy: { publishedAt: 'desc' },
      take: limit,
    })

    if (news.length === 0) {
      logger.warn('No news in database, using mock data')
      return mockNews
    }

    return news
  } catch (error) {
    logger.error('Database error in getLatestNews:', error)
    return mockNews
  }
}

// Get all tools with filters
export async function getAllTools(filters?: {
  query?: string
  category?: string
  pricing?: string
  sortBy?: string
  page?: number
  limit?: number
}): Promise<{ tools: Tool[]; total: number }> {
  try {
    const page = filters?.page || 1
    const limit = filters?.limit || 12
    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      AND?: Array<{
        OR?: Array<{
          name?: { contains: string; mode: 'insensitive' }
          description?: { contains: string; mode: 'insensitive' }
          tags?: { has: string }
        }>
        category?: string
      }>
      category?: string
    } = {}

    if (filters?.query) {
      where.AND = [
        {
          OR: [
            { name: { contains: filters.query, mode: 'insensitive' } },
            { description: { contains: filters.query, mode: 'insensitive' } },
            { tags: { has: filters.query } },
          ],
        },
      ]
    }

    if (filters?.category && filters.category !== 'all') {
      where.category = filters.category
    }

    // Build orderBy
    type OrderByType = { rating?: 'desc' | 'asc'; reviewCount?: 'desc' | 'asc'; name?: 'desc' | 'asc'; createdAt?: 'desc' | 'asc' }
    let orderBy: OrderByType = { rating: 'desc' }

    switch (filters?.sortBy) {
      case 'reviewCount':
        orderBy = { reviewCount: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { rating: 'desc' }
    }

    const [tools, total] = await Promise.all([
      prisma.tool.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.tool.count({ where }),
    ])

    // Filter by pricing (needs post-query filtering due to JSON field)
    let filteredTools = tools.map(transformTool)

    if (filters?.pricing === 'free') {
      filteredTools = filteredTools.filter(tool => tool.pricing.free)
    } else if (filters?.pricing === 'paid') {
      filteredTools = filteredTools.filter(tool => !tool.pricing.free)
    }

    if (filteredTools.length === 0 && !filters?.query && !filters?.category) {
      logger.warn('No tools in database, using mock data')
      return { tools: mockTools, total: mockTools.length }
    }

    return { tools: filteredTools, total }
  } catch (error) {
    logger.error('Database error in getAllTools:', error)
    return { tools: mockTools, total: mockTools.length }
  }
}

// Get tool by slug
export async function getToolBySlug(slug: string): Promise<Tool | null> {
  try {
    const tool = await prisma.tool.findUnique({
      where: { slug },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!tool) {
      // Fallback to mock data
      const mockTool = mockTools.find(t => t.slug === slug)
      return mockTool || null
    }

    return {
      ...transformTool(tool),
      reviews: tool.reviews.map(review => ({
        ...review,
        user: review.user,
      })),
    }
  } catch (error) {
    logger.error('Database error in getToolBySlug:', error)
    const mockTool = mockTools.find(t => t.slug === slug)
    return mockTool || null
  }
}

// Get tools by category
export async function getToolsByCategory(category: string, limit: number = 10): Promise<Tool[]> {
  try {
    const tools = await prisma.tool.findMany({
      where: { category },
      orderBy: { rating: 'desc' },
      take: limit,
    })

    if (tools.length === 0) {
      return mockTools.filter(t => t.category === category)
    }

    return tools.map(transformTool)
  } catch (error) {
    logger.error('Database error in getToolsByCategory:', error)
    return mockTools.filter(t => t.category === category)
  }
}

// Search tools
export async function searchTools(query: string, limit: number = 20): Promise<Tool[]> {
  try {
    const tools = await prisma.tool.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
        ],
      },
      orderBy: { rating: 'desc' },
      take: limit,
    })

    if (tools.length === 0) {
      const lowerQuery = query.toLowerCase()
      return mockTools.filter(
        tool =>
          tool.name.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery) ||
          tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }

    return tools.map(transformTool)
  } catch (error) {
    logger.error('Database error in searchTools:', error)
    const lowerQuery = query.toLowerCase()
    return mockTools.filter(
      tool =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
}

// Get related tools
export async function getRelatedTools(tool: Tool, limit: number = 3): Promise<Tool[]> {
  try {
    const tools = await prisma.tool.findMany({
      where: {
        AND: [
          { id: { not: tool.id } },
          {
            OR: [
              { category: tool.category },
              { tags: { hasSome: tool.tags } },
            ],
          },
        ],
      },
      orderBy: { rating: 'desc' },
      take: limit,
    })

    if (tools.length === 0) {
      return mockTools
        .filter(t => t.id !== tool.id && t.category === tool.category)
        .slice(0, limit)
    }

    return tools.map(transformTool)
  } catch (error) {
    logger.error('Database error in getRelatedTools:', error)
    return mockTools
      .filter(t => t.id !== tool.id && t.category === tool.category)
      .slice(0, limit)
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const dbCategories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    })

    if (dbCategories.length === 0) {
      logger.warn('No categories in database, using mock data')
      return mockCategories
    }

    return dbCategories
  } catch (error) {
    logger.error('Database error in getCategories:', error)
    return mockCategories
  }
}

// Get tools by IDs (for comparison, favorites, etc.)
export async function getToolsByIds(ids: string[]): Promise<Tool[]> {
  try {
    const tools = await prisma.tool.findMany({
      where: {
        id: { in: ids },
      },
    })

    return tools.map(transformTool)
  } catch (error) {
    logger.error('Database error in getToolsByIds:', error)
    return mockTools.filter(t => ids.includes(t.id))
  }
}

// Get trending tools (high review count + high rating)
export async function getTrendingTools(limit: number = 6): Promise<Tool[]> {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: [
        { reviewCount: 'desc' },
        { rating: 'desc' },
      ],
      take: limit,
    })

    if (tools.length === 0) {
      return mockTools.slice(0, limit)
    }

    return tools.map(transformTool)
  } catch (error) {
    logger.error('Database error in getTrendingTools:', error)
    return mockTools.slice(0, limit)
  }
}

// Get new tools (recently added)
export async function getNewTools(limit: number = 6): Promise<Tool[]> {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    if (tools.length === 0) {
      return mockTools.slice(0, limit)
    }

    return tools.map(transformTool)
  } catch (error) {
    logger.error('Database error in getNewTools:', error)
    return mockTools.slice(0, limit)
  }
}

// Get tool count
export async function getToolCount(): Promise<number> {
  try {
    return await prisma.tool.count()
  } catch (error) {
    logger.error('Database error in getToolCount:', error)
    return mockTools.length
  }
}

// Get hot news
export async function getHotNews(limit: number = 3): Promise<NewsItem[]> {
  try {
    const news = await prisma.newsItem.findMany({
      where: { isHot: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    })

    if (news.length === 0) {
      return mockNews.filter(n => n.isHot).slice(0, limit)
    }

    return news
  } catch (error) {
    logger.error('Database error in getHotNews:', error)
    return mockNews.filter(n => n.isHot).slice(0, limit)
  }
}
