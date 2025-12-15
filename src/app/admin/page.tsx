import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { AdminDashboard } from './admin-dashboard'

export const metadata = {
  title: '관리자 대시보드 - AIpick',
}

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  const isUserAdmin = await isAdmin(session.user.id)

  if (!isUserAdmin) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-white">관리자 대시보드</h1>
      <AdminDashboard />
    </div>
  )
}
