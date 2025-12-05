/**
 * Utility functions for search functionality
 */

/**
 * Highlight matching text in a string
 * @param text - The text to search in
 * @param query - The query to highlight
 * @returns Array of text segments with match info
 */
export function getHighlightedSegments(
  text: string,
  query: string
): { text: string; isMatch: boolean }[] {
  if (!query.trim()) {
    return [{ text, isMatch: false }]
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  const parts = text.split(regex)

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      isMatch: regex.test(part),
    }))
}

/**
 * Escape special regex characters in a string
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Simple fuzzy match score calculation
 * @param text - The text to search in
 * @param query - The query to match
 * @returns Score from 0 to 1 (1 = exact match)
 */
export function fuzzyMatchScore(text: string, query: string): number {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  // Exact match
  if (lowerText === lowerQuery) return 1

  // Contains match
  if (lowerText.includes(lowerQuery)) {
    // Higher score for matches at the beginning
    if (lowerText.startsWith(lowerQuery)) return 0.9
    return 0.7
  }

  // Word boundary match
  const words = lowerText.split(/\s+/)
  for (const word of words) {
    if (word.startsWith(lowerQuery)) return 0.6
  }

  // Character sequence match (fuzzy)
  let queryIndex = 0
  let consecutiveMatches = 0
  let maxConsecutive = 0

  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      queryIndex++
      consecutiveMatches++
      maxConsecutive = Math.max(maxConsecutive, consecutiveMatches)
    } else {
      consecutiveMatches = 0
    }
  }

  if (queryIndex === lowerQuery.length) {
    return 0.3 + (maxConsecutive / lowerQuery.length) * 0.2
  }

  return 0
}

/**
 * Sort items by fuzzy match score
 * @param items - Array of items to sort
 * @param query - The search query
 * @param getSearchText - Function to extract searchable text from item
 * @returns Sorted array with items matching the query first
 */
export function sortByFuzzyMatch<T>(
  items: T[],
  query: string,
  getSearchText: (item: T) => string
): T[] {
  if (!query.trim()) return items

  return [...items].sort((a, b) => {
    const scoreA = fuzzyMatchScore(getSearchText(a), query)
    const scoreB = fuzzyMatchScore(getSearchText(b), query)
    return scoreB - scoreA
  })
}

/**
 * Filter items by search query with fuzzy matching
 * @param items - Array of items to filter
 * @param query - The search query
 * @param getSearchText - Function to extract searchable text from item
 * @param threshold - Minimum score to include (default: 0.1)
 * @returns Filtered and sorted array
 */
export function filterByFuzzyMatch<T>(
  items: T[],
  query: string,
  getSearchText: (item: T) => string,
  threshold = 0.1
): T[] {
  if (!query.trim()) return items

  return items
    .map((item) => ({
      item,
      score: fuzzyMatchScore(getSearchText(item), query),
    }))
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}

/**
 * Extract keywords from a search query
 * @param query - The search query
 * @returns Array of keywords
 */
export function extractKeywords(query: string): string[] {
  // Remove common stop words (Korean and English)
  const stopWords = new Set([
    // Korean
    '의',
    '를',
    '을',
    '이',
    '가',
    '에',
    '에서',
    '로',
    '으로',
    '와',
    '과',
    '도',
    '만',
    '은',
    '는',
    '하고',
    '싶어요',
    '싶습니다',
    '해주세요',
    '필요해요',
    // English
    'the',
    'a',
    'an',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'for',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'from',
    'with',
    'by',
    'of',
    'that',
    'this',
    'it',
    'i',
    'you',
    'we',
    'they',
    'want',
    'need',
    'like',
    'help',
    'please',
  ])

  return query
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((word) => word.length > 1 && !stopWords.has(word))
}

/**
 * Category keyword mapping for search enhancement
 */
export const categoryKeywordMap: Record<string, string[]> = {
  writing: ['글쓰기', '작성', '블로그', '이메일', '카피', '콘텐츠', 'writing', 'blog', 'content'],
  image: ['이미지', '그림', '사진', '디자인', '일러스트', 'image', 'photo', 'design', 'art'],
  video: ['영상', '동영상', '비디오', '편집', 'video', 'movie', 'edit'],
  audio: ['음악', '오디오', '음성', '사운드', 'music', 'audio', 'sound', 'voice'],
  coding: ['코드', '코딩', '프로그래밍', '개발', 'code', 'coding', 'programming', 'dev'],
  chatbot: ['챗봇', '대화', '채팅', 'chatbot', 'chat', 'conversation', 'ai assistant'],
  productivity: ['생산성', '업무', '프로젝트', '관리', 'productivity', 'work', 'project'],
  marketing: ['마케팅', '광고', '홍보', 'marketing', 'ads', 'promotion'],
}

/**
 * Get relevant categories for a search query
 */
export function getRelevantCategories(query: string): string[] {
  const lowerQuery = query.toLowerCase()
  const categories: string[] = []

  Object.entries(categoryKeywordMap).forEach(([category, keywords]) => {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      categories.push(category)
    }
  })

  return categories
}
