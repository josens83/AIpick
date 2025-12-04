import type { Tool, NewsItem, Category } from '@/types'

// Mock data for featured tools
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
  {
    id: '2',
    name: 'Midjourney',
    slug: 'midjourney',
    description: '텍스트 프롬프트로 놀라운 이미지를 생성하는 AI 아트 생성기입니다.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
    url: 'https://midjourney.com',
    category: 'image',
    tags: ['이미지 생성', 'AI 아트', '디자인'],
    pricing: { free: false, plans: [{ name: 'Basic', price: '$10/월', features: ['200분/월', '개인 갤러리'] }] },
    features: ['고품질 이미지 생성', '스타일 커스터마이징', '업스케일링', '변형 생성'],
    pros: ['뛰어난 품질', '다양한 스타일', '활발한 커뮤니티'],
    cons: ['Discord 필수', '학습 곡선'],
    rating: 4.9,
    reviewCount: 8930,
    userCount: '15M+',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Claude',
    slug: 'claude',
    description: 'Anthropic의 안전하고 도움이 되는 AI 어시스턴트입니다.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Claude_AI.png',
    url: 'https://claude.ai',
    category: 'chatbot',
    tags: ['AI 챗봇', '글쓰기', '분석', '코딩'],
    pricing: { free: true, plans: [{ name: 'Pro', price: '$20/월', features: ['Claude 3 Opus', '더 긴 대화', '우선 접근'] }] },
    features: ['긴 컨텍스트 처리', '문서 분석', '코드 작성', '안전한 AI'],
    pros: ['긴 문맥 이해', '정확한 응답', '안전성'],
    cons: ['이미지 생성 불가', '제한된 플러그인'],
    rating: 4.7,
    reviewCount: 6240,
    userCount: '10M+',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'DALL-E 3',
    slug: 'dall-e-3',
    description: 'OpenAI의 최신 이미지 생성 AI. 텍스트 설명으로 정확한 이미지를 만듭니다.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
    url: 'https://openai.com/dall-e-3',
    category: 'image',
    tags: ['이미지 생성', 'AI 아트', '디자인'],
    pricing: { free: false, plans: [{ name: 'ChatGPT Plus', price: '$20/월', features: ['DALL-E 3 접근', 'GPT-4 포함'] }] },
    features: ['정확한 텍스트 렌더링', '프롬프트 이해력', 'ChatGPT 통합'],
    pros: ['텍스트 정확도', '쉬운 사용', 'ChatGPT 연동'],
    cons: ['별도 구독 필요', '스타일 제한'],
    rating: 4.6,
    reviewCount: 4520,
    userCount: '50M+',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'AI 기반 코드 자동완성 도구. 주석이나 코드 컨텍스트에서 코드를 제안합니다.',
    logo: 'https://github.githubassets.com/images/modules/site/copilot/copilot.png',
    url: 'https://github.com/features/copilot',
    category: 'coding',
    tags: ['코딩', '개발', '생산성', '자동완성'],
    pricing: { free: false, plans: [{ name: 'Individual', price: '$10/월', features: ['코드 자동완성', 'IDE 통합'] }] },
    features: ['코드 자동완성', '주석 기반 생성', '다중 언어 지원', 'IDE 통합'],
    pros: ['높은 생산성', '다양한 언어', 'IDE 통합'],
    cons: ['구독 필요', '때때로 부정확'],
    rating: 4.7,
    reviewCount: 12340,
    userCount: '1M+',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Notion AI',
    slug: 'notion-ai',
    description: 'Notion에 통합된 AI 어시스턴트. 글쓰기, 요약, 브레인스토밍을 도와줍니다.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    url: 'https://notion.so/product/ai',
    category: 'productivity',
    tags: ['생산성', '글쓰기', '노트', '협업'],
    pricing: { free: false, plans: [{ name: 'AI 추가', price: '$10/월', features: ['무제한 AI 사용', '모든 작업 공간'] }] },
    features: ['글쓰기 보조', '요약', '번역', '브레인스토밍'],
    pros: ['Notion 통합', '다양한 기능', '쉬운 사용'],
    cons: ['추가 비용', 'Notion 필수'],
    rating: 4.5,
    reviewCount: 3210,
    userCount: '35M+',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Mock news data
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
  {
    id: '2',
    title: 'Anthropic, Claude 3.5 Sonnet 공개',
    description: '더 빠르고 정확한 응답을 제공하는 Claude 3.5 Sonnet이 출시되었습니다.',
    url: 'https://example.com/news/claude-3-5',
    image: 'https://images.unsplash.com/photo-1676573410330-9c41e6e62aee?w=800',
    source: 'Tech News',
    category: '출시',
    isHot: true,
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'AI 이미지 생성 도구 비교: Midjourney vs DALL-E 3',
    description: '두 대표적인 AI 이미지 생성 도구의 장단점을 비교해보았습니다.',
    url: 'https://example.com/news/image-ai-compare',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4ce3d?w=800',
    source: 'AI Review',
    category: '튜토리얼',
    isHot: false,
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
]

// Mock categories
export const categories: Category[] = [
  { id: '1', name: '글쓰기', slug: 'writing', description: 'AI 글쓰기 도구', icon: 'FileText', toolCount: 120, order: 1 },
  { id: '2', name: '이미지', slug: 'image', description: 'AI 이미지 생성', icon: 'Image', toolCount: 85, order: 2 },
  { id: '3', name: '영상', slug: 'video', description: 'AI 영상 편집', icon: 'Video', toolCount: 45, order: 3 },
  { id: '4', name: '오디오', slug: 'audio', description: 'AI 오디오 처리', icon: 'Music', toolCount: 30, order: 4 },
  { id: '5', name: '코딩', slug: 'coding', description: 'AI 코딩 어시스턴트', icon: 'Code', toolCount: 95, order: 5 },
  { id: '6', name: '챗봇', slug: 'chatbot', description: 'AI 챗봇', icon: 'MessageSquare', toolCount: 60, order: 6 },
  { id: '7', name: '생산성', slug: 'productivity', description: 'AI 생산성 도구', icon: 'Brain', toolCount: 110, order: 7 },
  { id: '8', name: '마케팅', slug: 'marketing', description: 'AI 마케팅 도구', icon: 'Mail', toolCount: 55, order: 8 },
]

// Data fetching functions
export async function getFeaturedTools(): Promise<Tool[]> {
  // In production, this would fetch from database
  return mockTools.filter(tool => tool.featured)
}

export async function getLatestNews(): Promise<NewsItem[]> {
  // In production, this would fetch from database/API
  return mockNews
}

export async function getAllTools(filters?: {
  query?: string
  category?: string
  pricing?: string
}): Promise<Tool[]> {
  let tools = [...mockTools]

  if (filters?.query) {
    const query = filters.query.toLowerCase()
    tools = tools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (filters?.category) {
    tools = tools.filter(tool => tool.category === filters.category)
  }

  if (filters?.pricing === 'free') {
    tools = tools.filter(tool => tool.pricing.free)
  } else if (filters?.pricing === 'paid') {
    tools = tools.filter(tool => !tool.pricing.free)
  }

  return tools
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  return mockTools.find(tool => tool.slug === slug) || null
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  return mockTools.filter(tool => tool.category === category)
}

export async function searchTools(query: string): Promise<Tool[]> {
  const lowerQuery = query.toLowerCase()
  return mockTools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export async function getRelatedTools(tool: Tool, limit: number = 3): Promise<Tool[]> {
  return mockTools
    .filter(t => t.id !== tool.id && t.category === tool.category)
    .slice(0, limit)
}

export async function getCategories(): Promise<Category[]> {
  return categories
}
