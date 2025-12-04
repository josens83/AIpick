import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIpick - AI 도구 추천 플랫폼',
  description: '워크플로우에 맞는 최적의 AI 도구를 찾아보세요. 500개 이상의 AI 도구 비교, 리뷰, 추천을 제공합니다.',
  keywords: ['AI', '인공지능', 'AI 도구', 'ChatGPT', 'Midjourney', 'AI 추천', 'AI 비교'],
  authors: [{ name: 'AIpick' }],
  creator: 'AIpick',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://aipick.io',
    siteName: 'AIpick',
    title: 'AIpick - AI 도구 추천 플랫폼',
    description: '워크플로우에 맞는 최적의 AI 도구를 찾아보세요.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AIpick',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIpick - AI 도구 추천 플랫폼',
    description: '워크플로우에 맞는 최적의 AI 도구를 찾아보세요.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
