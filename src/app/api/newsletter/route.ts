import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { newsletterSubscribeSchema } from '@/lib/validations'
import { apiSuccess, handleApiError } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = newsletterSubscribeSchema.parse(body)

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      return apiSuccess({
        message: '이미 구독 중입니다',
        alreadySubscribed: true,
      })
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email },
    })

    // In production, send confirmation email using Resend
    // const { Resend } = require('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'AIpick <noreply@aipick.io>',
    //   to: email,
    //   subject: 'AIpick 뉴스레터 구독을 확인해주세요',
    //   html: '...',
    // })

    return apiSuccess({
      message: '뉴스레터 구독이 완료되었습니다',
      alreadySubscribed: false,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
