'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  CreditCard,
  LogOut,
  Loader2,
  Crown,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, formatDate } from '@/lib/utils'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [managingSubscription, setManagingSubscription] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleManageSubscription = async () => {
    setManagingSubscription(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setManagingSubscription(false)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isPro = session.user?.plan === 'pro' || session.user?.plan === 'enterprise'

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">계정 설정</h1>
          </div>
          <p className="text-gray-400">계정 정보 및 구독 관리</p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>프로필</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={session.user?.image || ''} />
                    <AvatarFallback className="text-lg">
                      {getInitials(session.user?.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {session.user?.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="h-4 w-4" />
                      {session.user?.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>구독</CardTitle>
                  <Badge variant={isPro ? 'pro' : 'secondary'}>
                    {session.user?.plan === 'enterprise'
                      ? 'Enterprise'
                      : session.user?.plan === 'pro'
                      ? 'Pro'
                      : 'Free'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPro ? (
                  <>
                    <div className="flex items-center gap-2 text-green-400">
                      <Crown className="h-5 w-5" />
                      <span className="font-medium">프리미엄 구독 중</span>
                    </div>

                    {session.user?.stripeCurrentPeriodEnd && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>
                          다음 결제일:{' '}
                          {formatDate(session.user.stripeCurrentPeriodEnd)}
                        </span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        onClick={handleManageSubscription}
                        disabled={managingSubscription}
                      >
                        {managingSubscription ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CreditCard className="h-4 w-4 mr-2" />
                        )}
                        구독 관리
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400">
                      현재 무료 플랜을 사용 중입니다. Pro로 업그레이드하여 모든
                      기능을 이용해보세요.
                    </p>
                    <Button onClick={() => router.push('/pricing')}>
                      <Crown className="h-4 w-4 mr-2" />
                      Pro 업그레이드
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>사용량</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">즐겨찾기</span>
                  <span className="text-white">
                    {session.user?.favorites?.length || 0}개
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">오늘 추천 횟수</span>
                  <span className="text-white">
                    {isPro ? '무제한' : '3 / 10'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400">위험 구역</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
