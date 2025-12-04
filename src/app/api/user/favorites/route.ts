import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { favoriteActionSchema } from '@/lib/validations'
import {
  apiSuccess,
  handleApiError,
  apiError,
  ERROR_CODES,
} from '@/lib/api-utils'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return apiError(ERROR_CODES.UNAUTHORIZED, 'Authentication required')
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { favorites: true },
    })

    return apiSuccess({ favorites: user?.favorites || [] })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return apiError(ERROR_CODES.UNAUTHORIZED, 'Authentication required')
    }

    const body = await request.json()
    const { toolId, action } = favoriteActionSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { favorites: true },
    })

    let favorites = user?.favorites || []

    if (action === 'add') {
      if (!favorites.includes(toolId)) {
        favorites = [...favorites, toolId]
      }
    } else {
      favorites = favorites.filter((id: string) => id !== toolId)
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { favorites },
    })

    return apiSuccess({ favorites })
  } catch (error) {
    return handleApiError(error)
  }
}
