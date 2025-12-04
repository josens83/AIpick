export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  url: string
  category: string
  tags: string[]
  pricing: PricingInfo
  features: string[]
  pros: string[]
  cons: string[]
  rating: number
  reviewCount: number
  userCount: string | null
  featured: boolean
  createdAt: Date
  updatedAt: Date
  reviews?: Review[]
}

export interface PricingInfo {
  free: boolean
  freeTier?: string
  plans: PricingPlan[]
}

export interface PricingPlan {
  name: string
  price: string
  period?: string
  features: string[]
}

export interface Review {
  id: string
  toolId: string
  userId: string
  rating: number
  title: string | null
  content: string
  helpful: number
  createdAt: Date
  user?: User
}

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  favorites: string[]
  searchHistory: string[]
  plan: 'free' | 'pro' | 'enterprise'
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  stripeCurrentPeriodEnd: Date | null
  createdAt: Date
}

export interface NewsItem {
  id: string
  title: string
  description: string | null
  url: string
  image: string | null
  source: string
  category: string
  isHot: boolean
  publishedAt: Date
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  toolCount: number
  order: number
}

export interface RecommendationRequest {
  query: string
  category?: string
  tags?: string[]
  limit?: number
}

export interface CompareRequest {
  toolIds: string[]
}

export interface SearchFilters {
  query?: string
  category?: string
  tags?: string[]
  pricing?: 'free' | 'paid' | 'all'
  sortBy?: 'rating' | 'reviewCount' | 'name' | 'newest'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Stripe types
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
  popular?: boolean
}
