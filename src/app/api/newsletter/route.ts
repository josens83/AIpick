import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = subscribeSchema.parse(body)

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { message: '이미 구독 중입니다' },
        { status: 200 }
      )
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

    return NextResponse.json({
      message: '뉴스레터 구독이 완료되었습니다',
      success: true,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: '구독 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
