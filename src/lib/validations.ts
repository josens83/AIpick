import { z } from 'zod'

// Common schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const idSchema = z.string().min(1, 'ID is required')

// Tool schemas
export const toolQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  pricing: z.enum(['free', 'freemium', 'paid', 'enterprise', '']).optional(),
  sort: z.enum(['rating', 'name', 'newest', 'popular', '']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
})

export const toolRecommendSchema = z.object({
  q: z.string().min(1, 'Query is required').max(500),
  limit: z.coerce.number().int().positive().max(20).default(6),
})

export const toolCompareSchema = z.object({
  tools: z.string().min(1, 'Tool IDs are required'),
})

export const toolSlugSchema = z.object({
  slug: z.string().min(1, 'Slug is required').max(100),
})

// User schemas
export const favoriteActionSchema = z.object({
  toolId: z.string().min(1, 'Tool ID is required'),
  action: z.enum(['add', 'remove'], {
    errorMap: () => ({ message: 'Action must be "add" or "remove"' }),
  }),
})

// Newsletter schemas
export const newsletterSubscribeSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
})

// Stripe schemas
export const stripeCheckoutSchema = z.object({
  plan: z.enum(['pro', 'enterprise'], {
    errorMap: () => ({ message: 'Invalid plan. Must be "pro" or "enterprise"' }),
  }),
})

// Compare schemas
export const toolCompareBodySchema = z.object({
  toolSlugs: z
    .array(z.string().min(1))
    .min(1, 'At least one tool slug is required')
    .max(3, 'Maximum 3 tools can be compared'),
})

// Contact/Feedback schemas
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})

// Review schemas
export const reviewSchema = z.object({
  toolId: z.string().min(1, 'Tool ID is required'),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(10, 'Review must be at least 10 characters').max(2000),
  pros: z.array(z.string().max(200)).max(5).optional(),
  cons: z.array(z.string().max(200)).max(5).optional(),
})

// Utility function to parse search params
export function parseSearchParams<T extends z.ZodTypeAny>(
  schema: T,
  searchParams: URLSearchParams
): z.infer<T> {
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return schema.parse(params)
}

// Type exports
export type ToolQuery = z.infer<typeof toolQuerySchema>
export type ToolRecommend = z.infer<typeof toolRecommendSchema>
export type FavoriteAction = z.infer<typeof favoriteActionSchema>
export type NewsletterSubscribe = z.infer<typeof newsletterSubscribeSchema>
export type ContactForm = z.infer<typeof contactSchema>
export type ReviewForm = z.infer<typeof reviewSchema>
