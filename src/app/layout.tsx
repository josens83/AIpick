import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIpick - AI 도구 추천 플랫폼',
  description:
    '워크플로우에 맞는 최적의 AI 도구를 찾아보세요. 500개 이상의 AI 도구 비교, 리뷰, 추천을 제공합니다.',
  keywords: ['AI', '인공지능', 'AI 도구', 'ChatGPT', 'Midjourney', 'AI 추천', 'AI 비교'],
  authors: [{ name: 'AIpick' }],
  creator: 'AIpick',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AIpick',
  },
  formatDetection: {
    telephone: false,
  },
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
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
    { media: '(prefers-color-scheme: light)', color: '#8B5CF6' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900`}
      >
        <Providers>
          <ServiceWorkerProvider>
            <div className="relative flex min-h-screen flex-col">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-white"
              >
                본문으로 건너뛰기
              </a>
              <Header />
              <main id="main-content" className="flex-1" role="main">
                {children}
              </main>
              <Footer />
            </div>
          </ServiceWorkerProvider>
        </Providers>
      </body>
    </html>
  )
}
