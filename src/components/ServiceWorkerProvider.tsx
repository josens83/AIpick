'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useServiceWorker } from '@/hooks/use-service-worker'
import { OfflineIndicator } from './OfflineIndicator'
import { InstallPrompt } from './InstallPrompt'

interface ServiceWorkerContextType {
  isSupported: boolean
  isRegistered: boolean
  isOnline: boolean
  canInstall: boolean
  promptInstall: () => Promise<boolean>
  requestNotificationPermission: () => Promise<NotificationPermission>
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(null)

export function useServiceWorkerContext() {
  const context = useContext(ServiceWorkerContext)
  if (!context) {
    throw new Error('useServiceWorkerContext must be used within ServiceWorkerProvider')
  }
  return context
}

interface ServiceWorkerProviderProps {
  children: ReactNode
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const sw = useServiceWorker()

  return (
    <ServiceWorkerContext.Provider value={sw}>
      {children}
      <OfflineIndicator />
      <InstallPrompt />
    </ServiceWorkerContext.Provider>
  )
}
