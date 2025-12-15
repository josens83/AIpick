'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  FileText,
  Star,
  Mail,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, formatDate } from '@/lib/utils'

interface DashboardStats {
  overview: {
    totalUsers: number
    newUsers: number
    userGrowth: number
    totalTools: number
    totalReviews: number
    newReviews: number
    totalNewsletterSubscribers: number
    averageRating: number
  }
  topTools: Array<{
    id: string
    name: string
    rating: number
    reviewCount: number
    category: string
  }>
  recentActivity: Array<{
    type: string
    user: string
    action: string
    rating?: number
    date: string
  }>
  period: {
    days: number
    startDate: string
    endDate: string
  }
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/stats?days=${period}`)
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-400">
        통계를 불러올 수 없습니다
      </div>
    )
  }

  const statCards = [
    {
      title: '전체 사용자',
      value: stats.overview.totalUsers.toLocaleString(),
      change: stats.overview.userGrowth,
      icon: Users,
      description: `신규 ${stats.overview.newUsers}명`,
    },
    {
      title: '전체 도구',
      value: stats.overview.totalTools.toLocaleString(),
      icon: FileText,
      description: '등록된 AI 도구',
    },
    {
      title: '전체 리뷰',
      value: stats.overview.totalReviews.toLocaleString(),
      icon: Star,
      description: `평균 ${stats.overview.averageRating.toFixed(1)}점`,
    },
    {
      title: '뉴스레터 구독',
      value: stats.overview.totalNewsletterSubscribers.toLocaleString(),
      icon: Mail,
      description: '이메일 구독자',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          {formatDate(stats.period.startDate)} ~ {formatDate(stats.period.endDate)}
        </p>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">최근 7일</SelectItem>
            <SelectItem value="30">최근 30일</SelectItem>
            <SelectItem value="90">최근 90일</SelectItem>
            <SelectItem value="365">최근 1년</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 flex items-center gap-2">
                  {stat.change !== undefined && (
                    <span
                      className={cn(
                        'flex items-center text-xs',
                        stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                      )}
                    >
                      {stat.change >= 0 ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {Math.abs(stat.change)}%
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              인기 도구
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topTools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-sm font-medium text-purple-400">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{tool.name}</p>
                      <p className="text-xs text-gray-400">{tool.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-white">
                        {tool.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {tool.reviewCount} 리뷰
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-purple-400" />
              최근 활동
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.user}</span>
                      {' · '}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                  {activity.rating && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {activity.rating}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
