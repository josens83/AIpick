'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Building2, HelpCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: '기본 기능으로 시작하세요',
    price: { monthly: 0, yearly: 0 },
    icon: Sparkles,
    features: [
      '하루 10회 AI 추천',
      '기본 도구 비교 (2개)',
      'AI 뉴스 피드',
      '커뮤니티 접근',
    ],
    limitations: [
      '제한된 검색 필터',
      '기본 분석만 제공',
    ],
    cta: '무료로 시작',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: '개인 사용자와 프리랜서에게 적합',
    price: { monthly: 9900, yearly: 99000 },
    icon: Zap,
    features: [
      '무제한 AI 추천',
      '고급 도구 비교 (5개)',
      '상세 분석 리포트',
      '맞춤형 워크플로우 제안',
      '우선 고객 지원',
      '광고 없음',
      '즐겨찾기 무제한',
      '검색 히스토리 저장',
    ],
    limitations: [],
    cta: 'Pro 시작하기',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: '팀과 기업을 위한 솔루션',
    price: { monthly: 49900, yearly: 499000 },
    icon: Building2,
    features: [
      'Pro의 모든 기능',
      '팀 협업 기능',
      'API 접근',
      '맞춤형 통합',
      '전담 계정 관리자',
      'SSO 인증',
      '우선 기술 지원',
      '맞춤형 교육',
    ],
    limitations: [],
    cta: '문의하기',
    popular: false,
  },
]

const faqs = [
  {
    question: '언제든 취소할 수 있나요?',
    answer: '네, 언제든지 구독을 취소할 수 있습니다. 취소 후에도 결제 기간이 끝날 때까지 Pro 기능을 사용할 수 있습니다.',
  },
  {
    question: '어떤 결제 수단을 지원하나요?',
    answer: '신용카드, 체크카드, 그리고 PayPal을 지원합니다. 한국에서는 카카오페이, 네이버페이도 사용 가능합니다.',
  },
  {
    question: '무료 체험 기간이 있나요?',
    answer: 'Pro 플랜은 7일 무료 체험을 제공합니다. 체험 기간 동안 모든 Pro 기능을 사용해볼 수 있습니다.',
  },
  {
    question: '환불이 가능한가요?',
    answer: '결제 후 14일 이내에는 전액 환불이 가능합니다. 고객 지원팀에 문의해 주세요.',
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function PricingPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isYearly, setIsYearly] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  // Handle success/cancel from Stripe redirect
  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')

    if (success === 'true') {
      toast({
        title: '결제가 완료되었습니다!',
        description: 'Pro 플랜이 활성화되었습니다. 새로운 기능을 즐겨보세요!',
      })
    }

    if (canceled === 'true') {
      toast({
        title: '결제가 취소되었습니다',
        description: '언제든 다시 시도해 주세요.',
        variant: 'destructive',
      })
    }
  }, [searchParams, toast])

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      signIn()
      return
    }

    // Free plan doesn't need payment
    if (planId === 'free') {
      toast({
        title: '무료 플랜을 이용 중입니다',
        description: '더 많은 기능이 필요하시면 Pro 플랜을 확인해보세요!',
      })
      return
    }

    // Enterprise plan - contact sales
    if (planId === 'enterprise') {
      window.location.href = 'mailto:enterprise@aipick.kr?subject=Enterprise 플랜 문의'
      return
    }

    setLoadingPlan(planId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          interval: isYearly ? 'year' : 'month',
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || '결제 페이지 생성에 실패했습니다')
      }

      // Redirect to Stripe Checkout
      if (data.data?.url) {
        window.location.href = data.data.url
      }
    } catch (error) {
      toast({
        title: '오류가 발생했습니다',
        description: error instanceof Error ? error.message : '다시 시도해 주세요',
        variant: 'destructive',
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">가격</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            당신에게 맞는 플랜을 선택하세요
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            모든 플랜에 7일 무료 체험이 포함되어 있습니다
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn('text-sm', !isYearly ? 'text-white' : 'text-gray-400')}>
              월간
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={cn('text-sm', isYearly ? 'text-white' : 'text-gray-400')}>
              연간
              <Badge variant="success" className="ml-2">20% 할인</Badge>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn(
                'relative h-full flex flex-col',
                plan.popular && 'border-purple-500 shadow-lg shadow-purple-500/20'
              )}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      가장 인기
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-0">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4',
                    plan.id === 'free' && 'bg-gray-500/20',
                    plan.id === 'pro' && 'bg-gradient-to-br from-purple-500 to-pink-500',
                    plan.id === 'enterprise' && 'bg-blue-500/20'
                  )}>
                    <plan.icon className={cn(
                      'w-7 h-7',
                      plan.id === 'free' && 'text-gray-400',
                      plan.id === 'pro' && 'text-white',
                      plan.id === 'enterprise' && 'text-blue-400'
                    )} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </CardHeader>

                <CardContent className="flex-1 pt-6">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-white">
                      {formatPrice(isYearly ? plan.price.yearly / 12 : plan.price.monthly)}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-400">/월</span>
                    )}
                    {isYearly && plan.price.yearly > 0 && (
                      <p className="text-sm text-gray-400 mt-1">
                        연 {formatPrice(plan.price.yearly)} 청구
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-5 w-5 text-green-400 shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="w-5 text-center">-</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loadingPlan !== null}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        처리 중...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">자주 묻는 질문</h2>
            <p className="text-gray-400">궁금한 점이 있으신가요?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-white mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-400">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="inline-block p-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
            <h3 className="text-xl font-bold text-white mb-2">
              더 궁금한 점이 있으신가요?
            </h3>
            <p className="text-gray-400 mb-4">
              언제든 문의해 주세요. 빠르게 답변드리겠습니다.
            </p>
            <Button variant="outline">문의하기</Button>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
