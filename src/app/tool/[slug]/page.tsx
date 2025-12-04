import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  Star,
  ExternalLink,
  Heart,
  Share2,
  Users,
  Check,
  X,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToolCard } from '@/components/ToolCard'
import { getToolBySlug, getRelatedTools } from '@/lib/data'

interface ToolPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) {
    return { title: 'Tool Not Found' }
  }

  return {
    title: `${tool.name} - AI 도구 리뷰 | AIpick`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - AIpick`,
      description: tool.description,
      images: [tool.logo],
    },
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  const relatedTools = await getRelatedTools(tool, 3)

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white">홈</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/explore" className="hover:text-white">탐색</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">{tool.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Logo */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/10 p-2">
                    {tool.logo ? (
                      <Image
                        src={tool.logo}
                        alt={tool.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-purple-400">
                        {tool.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
                      {tool.featured && <Badge variant="hot">추천</Badge>}
                    </div>

                    <p className="text-gray-400 mb-4">{tool.description}</p>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-white">{tool.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-400">({tool.reviewCount} 리뷰)</span>
                      </div>

                      {/* Users */}
                      {tool.userCount && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{tool.userCount} 사용자</span>
                        </div>
                      )}

                      {/* Pricing */}
                      <Badge variant={tool.pricing.free ? 'free' : 'pro'}>
                        {tool.pricing.free ? '무료 플랜 있음' : '유료'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/10">
                  <Button size="lg" asChild>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      사이트 방문
                    </a>
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="mr-2 h-4 w-4" />
                    즐겨찾기
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="mr-2 h-4 w-4" />
                    공유
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href={`/compare?tools=${tool.slug}`}>
                      비교에 추가
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">개요</TabsTrigger>
                <TabsTrigger value="pricing">가격</TabsTrigger>
                <TabsTrigger value="reviews">리뷰</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>주요 기능</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-400">장점</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tool.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-400">단점</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tool.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>태그</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <Link key={tag} href={`/explore?q=${encodeURIComponent(tag)}`}>
                          <Badge variant="secondary" className="cursor-pointer hover:bg-white/20">
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>가격 플랜</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tool.pricing.free && (
                      <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
                          <Check className="h-5 w-5" />
                          무료 플랜 제공
                        </div>
                        {tool.pricing.freeTier && (
                          <p className="text-gray-400 text-sm">{tool.pricing.freeTier}</p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tool.pricing.plans.map((plan, index) => (
                        <Card key={index} className="border-white/10">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-white mb-1">{plan.name}</h4>
                            <p className="text-2xl font-bold text-purple-400 mb-4">{plan.price}</p>
                            {plan.period && (
                              <p className="text-sm text-gray-400 -mt-3 mb-4">{plan.period}</p>
                            )}
                            <ul className="space-y-2">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                  <Check className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>사용자 리뷰</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-400">
                      <p className="mb-4">아직 리뷰가 없습니다.</p>
                      <Button variant="outline">첫 번째 리뷰 작성하기</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">카테고리</span>
                  <Link href={`/explore?category=${tool.category}`}>
                    <Badge variant="outline">{tool.category}</Badge>
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">평점</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white">{tool.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">리뷰 수</span>
                  <span className="text-white">{tool.reviewCount.toLocaleString()}</span>
                </div>
                {tool.userCount && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">사용자</span>
                    <span className="text-white">{tool.userCount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">가격</span>
                  <Badge variant={tool.pricing.free ? 'free' : 'pro'}>
                    {tool.pricing.free ? '무료' : '유료'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>비슷한 도구</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedTools.map((relatedTool) => (
                    <Link
                      key={relatedTool.id}
                      href={`/tool/${relatedTool.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10">
                        {relatedTool.logo ? (
                          <Image
                            src={relatedTool.logo}
                            alt={relatedTool.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-purple-400">
                            {relatedTool.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{relatedTool.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-400">{relatedTool.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
