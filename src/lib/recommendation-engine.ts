/**
 * AI Tool Recommendation Engine
 * Provides intelligent tool recommendations based on user queries
 */

import { extractKeywords, categoryKeywordMap, fuzzyMatchScore } from './search-utils'
import type { Tool } from '@/types'

// Extended keyword mapping with weights
const keywordWeights: Record<string, { categories: string[]; weight: number }> = {
  // Korean keywords
  '글쓰기': { categories: ['writing', 'chatbot'], weight: 1.0 },
  '블로그': { categories: ['writing', 'productivity'], weight: 0.9 },
  '포스트': { categories: ['writing'], weight: 0.8 },
  '글': { categories: ['writing'], weight: 0.7 },
  '작성': { categories: ['writing', 'productivity'], weight: 0.8 },
  '이미지': { categories: ['image', 'design'], weight: 1.0 },
  '그림': { categories: ['image', 'design'], weight: 0.9 },
  '사진': { categories: ['image'], weight: 0.8 },
  '디자인': { categories: ['design', 'image'], weight: 0.9 },
  '일러스트': { categories: ['image', 'design'], weight: 0.8 },
  '영상': { categories: ['video'], weight: 1.0 },
  '동영상': { categories: ['video'], weight: 1.0 },
  '비디오': { categories: ['video'], weight: 0.9 },
  '편집': { categories: ['video', 'image'], weight: 0.7 },
  '코드': { categories: ['coding'], weight: 1.0 },
  '코딩': { categories: ['coding'], weight: 1.0 },
  '프로그래밍': { categories: ['coding'], weight: 0.9 },
  '개발': { categories: ['coding'], weight: 0.8 },
  '음악': { categories: ['audio'], weight: 1.0 },
  '오디오': { categories: ['audio', 'voice'], weight: 0.9 },
  '음성': { categories: ['voice', 'audio'], weight: 0.9 },
  '소리': { categories: ['audio'], weight: 0.7 },
  '챗봇': { categories: ['chatbot'], weight: 1.0 },
  '대화': { categories: ['chatbot'], weight: 0.8 },
  '채팅': { categories: ['chatbot'], weight: 0.8 },
  'PPT': { categories: ['presentation', 'productivity'], weight: 1.0 },
  '프레젠테이션': { categories: ['presentation'], weight: 1.0 },
  '발표': { categories: ['presentation'], weight: 0.8 },
  '이메일': { categories: ['writing', 'marketing'], weight: 0.9 },
  '메일': { categories: ['writing'], weight: 0.8 },
  '마케팅': { categories: ['marketing', 'writing'], weight: 1.0 },
  '광고': { categories: ['marketing'], weight: 0.9 },
  '홍보': { categories: ['marketing'], weight: 0.8 },
  '번역': { categories: ['writing', 'productivity'], weight: 1.0 },
  '요약': { categories: ['writing', 'productivity'], weight: 0.9 },
  '분석': { categories: ['productivity', 'data'], weight: 0.8 },
  // English keywords
  'write': { categories: ['writing'], weight: 0.9 },
  'blog': { categories: ['writing'], weight: 0.9 },
  'image': { categories: ['image'], weight: 1.0 },
  'photo': { categories: ['image'], weight: 0.9 },
  'video': { categories: ['video'], weight: 1.0 },
  'code': { categories: ['coding'], weight: 1.0 },
  'music': { categories: ['audio'], weight: 1.0 },
  'chat': { categories: ['chatbot'], weight: 0.9 },
  'email': { categories: ['writing', 'marketing'], weight: 0.9 },
}

// Use case patterns for intent detection
const useCasePatterns = [
  { pattern: /블로그.*글.*작성|글.*쓰고.*싶/i, categories: ['writing', 'chatbot'], boost: 1.2 },
  { pattern: /이미지.*생성|그림.*만들/i, categories: ['image'], boost: 1.2 },
  { pattern: /영상.*편집|동영상.*만들/i, categories: ['video'], boost: 1.2 },
  { pattern: /코드.*작성|프로그래밍.*도움/i, categories: ['coding'], boost: 1.2 },
  { pattern: /음악.*만들|작곡/i, categories: ['audio'], boost: 1.2 },
  { pattern: /챗봇.*구축|대화.*AI/i, categories: ['chatbot'], boost: 1.2 },
  { pattern: /PPT.*만들|프레젠테이션/i, categories: ['presentation'], boost: 1.2 },
  { pattern: /마케팅.*콘텐츠|광고.*문구/i, categories: ['marketing', 'writing'], boost: 1.1 },
]

interface RecommendationScore {
  tool: Tool
  score: number
  matchedCategories: string[]
  matchedKeywords: string[]
}

/**
 * Calculate relevance score for a tool based on query
 */
function calculateToolScore(
  tool: Tool,
  query: string,
  keywords: string[],
  relevantCategories: Map<string, number>
): RecommendationScore {
  let score = 0
  const matchedCategories: string[] = []
  const matchedKeywords: string[] = []

  // Base score from category match
  const categoryWeight = relevantCategories.get(tool.category) || 0
  if (categoryWeight > 0) {
    score += categoryWeight * 30
    matchedCategories.push(tool.category)
  }

  // Score from name match
  const nameScore = fuzzyMatchScore(tool.name.toLowerCase(), query.toLowerCase())
  score += nameScore * 25

  // Score from description match
  const descScore = fuzzyMatchScore(tool.description.toLowerCase(), query.toLowerCase())
  score += descScore * 15

  // Score from tag matches
  for (const tag of tool.tags) {
    const tagLower = tag.toLowerCase()
    for (const keyword of keywords) {
      if (tagLower.includes(keyword) || keyword.includes(tagLower)) {
        score += 10
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword)
        }
      }
    }
  }

  // Rating bonus
  score += tool.rating * 3

  // Featured bonus
  if (tool.featured) {
    score += 10
  }

  // Free tier bonus (slight preference for accessible tools)
  if (tool.pricing.free) {
    score += 5
  }

  // User count bonus (popularity)
  if (tool.userCount) {
    const userCountNum = parseInt(tool.userCount.replace(/[^0-9]/g, '')) || 0
    if (userCountNum > 1000000) score += 8
    else if (userCountNum > 100000) score += 5
    else if (userCountNum > 10000) score += 3
  }

  return {
    tool,
    score,
    matchedCategories,
    matchedKeywords,
  }
}

/**
 * Get relevant categories with weights from query
 */
function extractRelevantCategories(query: string): Map<string, number> {
  const categories = new Map<string, number>()
  const lowerQuery = query.toLowerCase()

  // Check keyword weights
  Object.entries(keywordWeights).forEach(([keyword, config]) => {
    if (lowerQuery.includes(keyword.toLowerCase())) {
      config.categories.forEach((cat) => {
        const currentWeight = categories.get(cat) || 0
        categories.set(cat, Math.max(currentWeight, config.weight))
      })
    }
  })

  // Check use case patterns for additional boost
  useCasePatterns.forEach(({ pattern, categories: cats, boost }) => {
    if (pattern.test(query)) {
      cats.forEach((cat) => {
        const currentWeight = categories.get(cat) || 0
        categories.set(cat, currentWeight * boost)
      })
    }
  })

  return categories
}

/**
 * Main recommendation function
 */
export function getRecommendations(
  tools: Tool[],
  query: string,
  options: {
    limit?: number
    minScore?: number
    excludeIds?: string[]
  } = {}
): {
  recommendations: Tool[]
  scores: RecommendationScore[]
  detectedCategories: string[]
  keywords: string[]
} {
  const { limit = 10, minScore = 5, excludeIds = [] } = options

  // Extract keywords and categories
  const keywords = extractKeywords(query)
  const relevantCategories = extractRelevantCategories(query)
  const detectedCategories = Array.from(relevantCategories.keys())

  // Filter excluded tools
  const eligibleTools = tools.filter((tool) => !excludeIds.includes(tool.id))

  // Calculate scores for all tools
  const scores = eligibleTools.map((tool) =>
    calculateToolScore(tool, query, keywords, relevantCategories)
  )

  // Filter and sort by score
  const filteredScores = scores
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return {
    recommendations: filteredScores.map((s) => s.tool),
    scores: filteredScores,
    detectedCategories,
    keywords,
  }
}

/**
 * Get similar tools based on a reference tool
 */
export function getSimilarTools(
  tools: Tool[],
  referenceTool: Tool,
  limit = 5
): Tool[] {
  const scores = tools
    .filter((tool) => tool.id !== referenceTool.id)
    .map((tool) => {
      let score = 0

      // Same category is most important
      if (tool.category === referenceTool.category) {
        score += 50
      }

      // Overlapping tags
      const overlappingTags = tool.tags.filter((tag) =>
        referenceTool.tags.includes(tag)
      )
      score += overlappingTags.length * 10

      // Similar pricing model
      if (tool.pricing.free === referenceTool.pricing.free) {
        score += 5
      }

      // Similar rating range
      const ratingDiff = Math.abs(tool.rating - referenceTool.rating)
      score += Math.max(0, 10 - ratingDiff * 5)

      return { tool, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scores.map((s) => s.tool)
}

/**
 * Get personalized recommendations based on user history
 */
export function getPersonalizedRecommendations(
  tools: Tool[],
  viewedToolIds: string[],
  favoritedToolIds: string[],
  limit = 10
): Tool[] {
  // Analyze user preferences from history
  const viewedTools = tools.filter((t) => viewedToolIds.includes(t.id))
  const favoritedTools = tools.filter((t) => favoritedToolIds.includes(t.id))

  // Count category preferences
  const categoryScores = new Map<string, number>()

  favoritedTools.forEach((tool) => {
    const current = categoryScores.get(tool.category) || 0
    categoryScores.set(tool.category, current + 3) // Higher weight for favorites
  })

  viewedTools.forEach((tool) => {
    const current = categoryScores.get(tool.category) || 0
    categoryScores.set(tool.category, current + 1)
  })

  // Score tools based on preferences
  const excludeIds = new Set([...viewedToolIds, ...favoritedToolIds])

  const scores = tools
    .filter((tool) => !excludeIds.has(tool.id))
    .map((tool) => {
      let score = categoryScores.get(tool.category) || 0
      score += tool.rating * 2
      if (tool.featured) score += 5
      return { tool, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scores.map((s) => s.tool)
}
