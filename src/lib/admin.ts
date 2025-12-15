import { prisma } from '@/lib/db'

/**
 * Check if a user is an admin based on their email
 * Admin emails are configured via ADMIN_EMAILS environment variable (comma-separated)
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  if (!user?.email) {
    return false
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  return adminEmails.includes(user.email)
}

/**
 * Check if an email address is an admin email
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  return adminEmails.includes(email)
}
