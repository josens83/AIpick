import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { newsletterSubscribeSchema } from '@/lib/validations'
import { apiSuccess, handleApiError } from '@/lib/api-utils'
import { rateLimiters, getClientIp, withRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (3 requests per 5 minutes)
    const rateLimitResult = await withRateLimit(
      request,
      rateLimiters.submission,
      getClientIp(request)
    )
    if (rateLimitResult) {
      return rateLimitResult
    }

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

    // Send confirmation email using Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'AIpick <noreply@aipick.io>',
          to: email,
          subject: 'AIpick 뉴스레터 구독을 환영합니다!',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>AIpick 뉴스레터</title>
              </head>
              <body style="font-family: system-ui, -apple-system, sans-serif; padding: 40px 20px; background: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h1 style="color: #8b5cf6; margin-top: 0;">AIpick 뉴스레터</h1>
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    안녕하세요! AIpick 뉴스레터 구독을 환영합니다.
                  </p>
                  <p style="color: #666; font-size: 14px; line-height: 1.6;">
                    매주 최신 AI 소식, 도구 업데이트, 그리고 유용한 팁을 받아보실 수 있습니다.
                  </p>
                  <div style="margin-top: 30px; padding: 20px; background: #f8f5ff; border-radius: 8px;">
                    <p style="color: #8b5cf6; margin: 0; font-size: 14px;">
                      구독해 주셔서 감사합니다!<br>
                      AIpick 팀 드림
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })
      } catch (emailError) {
        // Log email error but don't fail the subscription
        console.error('Failed to send welcome email:', emailError)
      }
    }

    return apiSuccess({
      message: '뉴스레터 구독이 완료되었습니다',
      alreadySubscribed: false,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
