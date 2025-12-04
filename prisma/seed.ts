import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: '글쓰기', slug: 'writing', description: 'AI 글쓰기 도구', icon: 'FileText', order: 1 },
  { name: '이미지', slug: 'image', description: 'AI 이미지 생성', icon: 'Image', order: 2 },
  { name: '영상', slug: 'video', description: 'AI 영상 편집', icon: 'Video', order: 3 },
  { name: '오디오', slug: 'audio', description: 'AI 오디오 처리', icon: 'Music', order: 4 },
  { name: '코딩', slug: 'coding', description: 'AI 코딩 어시스턴트', icon: 'Code', order: 5 },
  { name: '챗봇', slug: 'chatbot', description: 'AI 챗봇', icon: 'MessageSquare', order: 6 },
  { name: '생산성', slug: 'productivity', description: 'AI 생산성 도구', icon: 'Brain', order: 7 },
  { name: '마케팅', slug: 'marketing', description: 'AI 마케팅 도구', icon: 'Mail', order: 8 },
  { name: '프레젠테이션', slug: 'presentation', description: 'AI 프레젠테이션', icon: 'Presentation', order: 9 },
  { name: '디자인', slug: 'design', description: 'AI 디자인 도구', icon: 'PenTool', order: 10 },
  { name: '데이터', slug: 'data', description: 'AI 데이터 분석', icon: 'BarChart', order: 11 },
  { name: '음성', slug: 'voice', description: 'AI 음성 처리', icon: 'Mic', order: 12 },
]

const tools = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    name: 'Jasper',
    slug: 'jasper',
    description: '마케팅 콘텐츠 작성에 특화된 AI 글쓰기 도구입니다.',
    logo: 'https://www.jasper.ai/images/jasper-logo.svg',
    url: 'https://jasper.ai',
    category: 'writing',
    tags: ['글쓰기', '마케팅', '콘텐츠', '블로그'],
    pricing: { free: false, plans: [{ name: 'Creator', price: '$49/월', features: ['무제한 단어', '50+ 템플릿'] }] },
    features: ['마케팅 카피', '블로그 글', 'SEO 최적화', '다국어 지원'],
    pros: ['마케팅 특화', '다양한 템플릿', '팀 협업'],
    cons: ['높은 가격', '학습 필요'],
    rating: 4.4,
    reviewCount: 2890,
    userCount: '500K+',
    featured: false,
  },
  {
    name: 'Runway',
    slug: 'runway',
    description: '영상 제작을 위한 AI 도구 모음. 텍스트-비디오 생성, 편집 등을 지원합니다.',
    logo: 'https://runway.ml/images/runway-logo.svg',
    url: 'https://runway.ml',
    category: 'video',
    tags: ['영상 편집', 'AI 비디오', '모션 그래픽'],
    pricing: { free: true, freeTier: '125 크레딧/월', plans: [{ name: 'Standard', price: '$15/월', features: ['625 크레딧/월', 'Gen-2 접근'] }] },
    features: ['텍스트-비디오', '이미지-비디오', '배경 제거', '모션 추적'],
    pros: ['다양한 AI 도구', '직관적 UI', '빠른 처리'],
    cons: ['크레딧 제한', '고품질 출력 비용'],
    rating: 4.6,
    reviewCount: 1560,
    userCount: '1M+',
    featured: false,
  },
  {
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    description: '가장 자연스러운 AI 음성 합성 플랫폼입니다.',
    logo: 'https://elevenlabs.io/images/logo.svg',
    url: 'https://elevenlabs.io',
    category: 'audio',
    tags: ['음성 합성', 'TTS', '더빙', '오디오북'],
    pricing: { free: true, freeTier: '10,000자/월', plans: [{ name: 'Starter', price: '$5/월', features: ['30,000자/월', '음성 복제'] }] },
    features: ['자연스러운 TTS', '음성 복제', '다국어 지원', 'API 제공'],
    pros: ['최고 품질', '감정 표현', '빠른 생성'],
    cons: ['한국어 제한', '고급 기능 유료'],
    rating: 4.8,
    reviewCount: 4320,
    userCount: '2M+',
    featured: false,
  },
  {
    name: 'Stable Diffusion',
    slug: 'stable-diffusion',
    description: '오픈소스 이미지 생성 AI. 로컬에서 무료로 실행할 수 있습니다.',
    logo: 'https://stability.ai/images/logo.svg',
    url: 'https://stability.ai',
    category: 'image',
    tags: ['이미지 생성', 'AI 아트', '오픈소스'],
    pricing: { free: true, plans: [{ name: 'DreamStudio', price: '$10/1000 크레딧', features: ['웹 인터페이스', '고해상도'] }] },
    features: ['텍스트-이미지', '이미지 편집', '인페인팅', '아웃페인팅'],
    pros: ['무료 오픈소스', '커스터마이징', '활발한 커뮤니티'],
    cons: ['설치 복잡', 'GPU 필요'],
    rating: 4.5,
    reviewCount: 7890,
    userCount: '10M+',
    featured: false,
  },
]

const news = [
  {
    title: 'OpenAI, GPT-5 개발 중... 2024년 출시 예정',
    description: 'OpenAI가 차세대 언어 모델 GPT-5를 개발 중이며, 더욱 향상된 추론 능력을 갖출 것으로 예상됩니다.',
    url: 'https://example.com/news/gpt-5',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    source: 'AI Times',
    category: '업데이트',
    isHot: true,
  },
  {
    title: 'Anthropic, Claude 3.5 Sonnet 공개',
    description: '더 빠르고 정확한 응답을 제공하는 Claude 3.5 Sonnet이 출시되었습니다.',
    url: 'https://example.com/news/claude-3-5',
    image: 'https://images.unsplash.com/photo-1676573410330-9c41e6e62aee?w=800',
    source: 'Tech News',
    category: '출시',
    isHot: true,
  },
  {
    title: 'AI 이미지 생성 도구 비교: Midjourney vs DALL-E 3',
    description: '두 대표적인 AI 이미지 생성 도구의 장단점을 비교해보았습니다.',
    url: 'https://example.com/news/image-ai-compare',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4ce3d?w=800',
    source: 'AI Review',
    category: '튜토리얼',
    isHot: false,
  },
  {
    title: 'Google Gemini Ultra, GPT-4 능가하나?',
    description: 'Google의 최신 AI 모델 Gemini Ultra가 여러 벤치마크에서 GPT-4를 능가했다는 발표가 있었습니다.',
    url: 'https://example.com/news/gemini-ultra',
    image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800',
    source: 'AI Daily',
    category: '산업뉴스',
    isHot: true,
  },
]

async function main() {
  console.log('Start seeding...')

  // Create categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }
  console.log('Categories seeded')

  // Create tools
  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: tool,
      create: tool,
    })
  }
  console.log('Tools seeded')

  // Update category tool counts
  for (const category of categories) {
    const count = await prisma.tool.count({
      where: { category: category.slug },
    })
    await prisma.category.update({
      where: { slug: category.slug },
      data: { toolCount: count },
    })
  }
  console.log('Category tool counts updated')

  // Create news
  for (const item of news) {
    await prisma.newsItem.create({
      data: item,
    })
  }
  console.log('News seeded')

  console.log('Seeding finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
