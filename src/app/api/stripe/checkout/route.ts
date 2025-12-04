import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { createCheckoutSession, PLANS } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'
import { stripeCheckoutSchema } from '@/lib/validations'
import { apiSuccess, handleApiError, apiError, ERROR_CODES } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.email) {
      return apiError(ERROR_CODES.UNAUTHORIZED, 'Authentication required')
    }

    const body = await request.json()
    const { plan } = stripeCheckoutSchema.parse(body)

    const selectedPlan = PLANS[plan as keyof typeof PLANS]

    if (!selectedPlan.stripePriceId) {
      return apiError(ERROR_CODES.INTERNAL_ERROR, 'Price ID not configured')
    }

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      priceId: selectedPlan.stripePriceId,
      successUrl: absoluteUrl('/pricing?success=true'),
      cancelUrl: absoluteUrl('/pricing?canceled=true'),
    })

    return apiSuccess({ url: checkoutSession.url })
  } catch (error) {
    return handleApiError(error)
  }
}
