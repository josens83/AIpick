import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Free',
    description: '기본 기능으로 시작하세요',
    price: 0,
    stripePriceId: null,
    features: [
      '하루 10회 AI 추천',
      '기본 도구 비교 (2개)',
      'AI 뉴스 피드',
      '커뮤니티 접근',
    ],
  },
  pro: {
    name: 'Pro',
    description: '개인 사용자와 프리랜서에게 적합',
    price: 9900,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      '무제한 AI 추천',
      '고급 도구 비교 (5개)',
      '상세 분석 리포트',
      '맞춤형 워크플로우 제안',
      '우선 고객 지원',
      '광고 없음',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: '팀과 기업을 위한 솔루션',
    price: 49900,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Pro의 모든 기능',
      '팀 협업 기능',
      'API 접근',
      '맞춤형 통합',
      '전담 계정 관리자',
      'SSO 인증',
    ],
  },
}

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        userId,
      },
    },
    metadata: {
      userId,
    },
  })

  return session
}

export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}
