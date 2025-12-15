'use client'

import { useEffect, useState, useRef } from 'react'
import { logger } from '@/lib/logger'

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isOnline: boolean
  registration: ServiceWorkerRegistration | null
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    registration: null,
  })

  // Store references for cleanup
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)
  const updateFoundHandlerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Check if service workers are supported
    const isSupported = 'serviceWorker' in navigator

    setState((prev) => ({ ...prev, isSupported }))

    if (!isSupported) return

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        registrationRef.current = registration

        setState((prev) => ({
          ...prev,
          isRegistered: true,
          registration,
        }))

        // Check for updates
        const handleUpdateFound = () => {
          const newWorker = registration.installing
          if (newWorker) {
            const handleStateChange = () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                logger.info('[SW] New content available')
              }
            }
            newWorker.addEventListener('statechange', handleStateChange)
          }
        }

        updateFoundHandlerRef.current = handleUpdateFound
        registration.addEventListener('updatefound', handleUpdateFound)
      } catch (error) {
        logger.error('[SW] Registration failed', error)
      }
    }

    registerSW()

    // Handle online/offline events
    const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)

      // Clean up service worker event listeners
      if (registrationRef.current && updateFoundHandlerRef.current) {
        registrationRef.current.removeEventListener('updatefound', updateFoundHandlerRef.current)
      }
    }
  }, [])

  // Request notification permission
  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied'
    }
    return await Notification.requestPermission()
  }

  // Check if app can be installed (PWA)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const promptInstall = async (): Promise<boolean> => {
    if (!installPrompt) return false

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    setInstallPrompt(null)
    return outcome === 'accepted'
  }

  return {
    ...state,
    canInstall: !!installPrompt,
    promptInstall,
    requestNotificationPermission,
  }
}

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
