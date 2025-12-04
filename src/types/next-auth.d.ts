import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      plan: 'free' | 'pro' | 'enterprise'
      favorites: string[]
      stripeCustomerId: string | null
      stripeSubscriptionId: string | null
      stripeCurrentPeriodEnd: Date | null
    } & DefaultSession['user']
  }
}
