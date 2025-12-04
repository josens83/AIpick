import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { TooltipProvider } from '@/components/ui/tooltip'

// Mock session data
const mockSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
    plan: 'free' as const,
    favorites: [],
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeCurrentPeriodEnd: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: typeof mockSession | null
}

// Custom render function with providers
function customRender(
  ui: ReactElement,
  { session = null, ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </SessionProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render, mockSession }
