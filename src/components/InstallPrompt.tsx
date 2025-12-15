'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@/hooks'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useLocalStorage('pwa-install-dismissed', false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after 30 seconds if not dismissed
      if (!dismissed) {
        timeoutRef.current = setTimeout(() => setIsVisible(true), 30000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    const handleAppInstalled = () => {
      setInstallPrompt(null)
      setIsVisible(false)
    }
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [dismissed])

  const handleInstall = async () => {
    if (!installPrompt) return

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setDismissed(true)
  }

  if (!installPrompt || !isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm"
      >
        <div className="rounded-2xl border border-white/10 bg-gray-900/95 p-4 shadow-xl backdrop-blur-xl">
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20">
              <Smartphone className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1 pr-6">
              <h3 className="font-semibold text-white">앱으로 설치하기</h3>
              <p className="mt-1 text-sm text-gray-400">
                AIpick을 홈 화면에 추가하고 더 빠르게 접속하세요
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleInstall}
              className="flex-1"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              설치하기
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
            >
              나중에
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
