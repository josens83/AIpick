'use client'

import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Sparkles, Chrome, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">AIpick에 로그인</CardTitle>
            <CardDescription>
              AI 도구 추천을 받고, 즐겨찾기를 저장하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => signIn('google', { callbackUrl: '/' })}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Google로 계속하기
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => signIn('github', { callbackUrl: '/' })}
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub로 계속하기
            </Button>

            <p className="text-center text-xs text-gray-400">
              계속 진행하면{' '}
              <a href="/terms" className="text-purple-400 hover:underline">
                이용약관
              </a>
              과{' '}
              <a href="/privacy" className="text-purple-400 hover:underline">
                개인정보처리방침
              </a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
