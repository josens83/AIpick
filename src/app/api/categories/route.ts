import { getCategories } from '@/lib/data'
import { apiSuccess, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const categories = await getCategories()

    return apiSuccess({ categories })
  } catch (error) {
    return handleApiError(error)
  }
}
