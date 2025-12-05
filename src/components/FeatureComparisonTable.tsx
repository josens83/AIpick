'use client'

import { memo } from 'react'
import { Check, X, Minus, Star, Users, DollarSign, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Tool } from '@/types'

interface FeatureComparisonTableProps {
  tools: Tool[]
  onRemoveTool?: (toolId: string) => void
}

// Feature categories and their items
const featureCategories = [
  {
    name: '기본 정보',
    features: [
      { key: 'rating', label: '평점', type: 'rating' as const },
      { key: 'userCount', label: '사용자 수', type: 'text' as const },
      { key: 'reviewCount', label: '리뷰 수', type: 'number' as const },
    ],
  },
  {
    name: '가격',
    features: [
      { key: 'pricing.free', label: '무료 플랜', type: 'boolean' as const },
      { key: 'pricing.startingPrice', label: '시작 가격', type: 'price' as const },
      { key: 'pricing.hasTrial', label: '무료 체험', type: 'boolean' as const },
    ],
  },
  {
    name: '기능',
    features: [
      { key: 'features.api', label: 'API 제공', type: 'boolean' as const },
      { key: 'features.mobileApp', label: '모바일 앱', type: 'boolean' as const },
      { key: 'features.collaboration', label: '팀 협업', type: 'boolean' as const },
      { key: 'features.integrations', label: '외부 연동', type: 'boolean' as const },
      { key: 'features.customization', label: '커스터마이징', type: 'boolean' as const },
    ],
  },
  {
    name: '지원',
    features: [
      { key: 'support.documentation', label: '문서화', type: 'boolean' as const },
      { key: 'support.liveChat', label: '실시간 채팅', type: 'boolean' as const },
      { key: 'support.email', label: '이메일 지원', type: 'boolean' as const },
      { key: 'support.korean', label: '한국어 지원', type: 'boolean' as const },
    ],
  },
]

// Helper to get nested value from object
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined
  }, obj as unknown)
}

// Render cell based on type
function renderCell(value: unknown, type: string) {
  switch (type) {
    case 'boolean':
      if (value === true) {
        return (
          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/20 p-1">
              <Check className="h-4 w-4 text-green-400" />
            </div>
          </div>
        )
      } else if (value === false) {
        return (
          <div className="flex justify-center">
            <div className="rounded-full bg-red-500/20 p-1">
              <X className="h-4 w-4 text-red-400" />
            </div>
          </div>
        )
      }
      return (
        <div className="flex justify-center">
          <Minus className="h-4 w-4 text-gray-500" />
        </div>
      )

    case 'rating':
      const rating = typeof value === 'number' ? value : 0
      return (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-white">{rating.toFixed(1)}</span>
        </div>
      )

    case 'price':
      if (!value) return <span className="text-gray-400">-</span>
      return (
        <div className="flex items-center justify-center gap-1">
          <DollarSign className="h-3 w-3 text-gray-400" />
          <span className="text-white">{String(value)}</span>
        </div>
      )

    case 'number':
      return (
        <span className="text-white">
          {typeof value === 'number' ? value.toLocaleString() : value || '-'}
        </span>
      )

    case 'text':
    default:
      return <span className="text-white">{String(value || '-')}</span>
  }
}

export const FeatureComparisonTable = memo(function FeatureComparisonTable({
  tools,
  onRemoveTool,
}: FeatureComparisonTableProps) {
  if (tools.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-gray-400">비교할 도구를 선택해주세요</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Header with tool info */}
        <thead>
          <tr className="border-b border-white/10">
            <th className="sticky left-0 z-10 bg-gray-900 p-4 text-left">
              <span className="text-sm font-medium text-gray-400">기능 비교</span>
            </th>
            {tools.map((tool) => (
              <th key={tool.id} className="min-w-[200px] p-4">
                <div className="flex flex-col items-center gap-3">
                  {/* Tool Logo */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 text-2xl font-bold text-purple-400">
                    {tool.name.charAt(0)}
                  </div>

                  {/* Tool Name */}
                  <h3 className="text-lg font-semibold text-white">{tool.name}</h3>

                  {/* Category Badge */}
                  <Badge variant="secondary">{tool.category}</Badge>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={tool.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        방문
                      </a>
                    </Button>
                    {onRemoveTool && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveTool(tool.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {featureCategories.map((category) => (
            <>
              {/* Category Header */}
              <tr key={category.name} className="bg-white/5">
                <td
                  colSpan={tools.length + 1}
                  className="sticky left-0 z-10 bg-white/5 px-4 py-2"
                >
                  <span className="text-sm font-semibold text-purple-400">
                    {category.name}
                  </span>
                </td>
              </tr>

              {/* Feature Rows */}
              {category.features.map((feature) => (
                <tr
                  key={feature.key}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="sticky left-0 z-10 bg-gray-900 px-4 py-3">
                    <span className="text-sm text-gray-300">{feature.label}</span>
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="px-4 py-3 text-center">
                      {renderCell(
                        getNestedValue(tool as unknown as Record<string, unknown>, feature.key),
                        feature.type
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}

          {/* Tags comparison */}
          <tr className="bg-white/5">
            <td
              colSpan={tools.length + 1}
              className="sticky left-0 z-10 bg-white/5 px-4 py-2"
            >
              <span className="text-sm font-semibold text-purple-400">태그</span>
            </td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="sticky left-0 z-10 bg-gray-900 px-4 py-3">
              <span className="text-sm text-gray-300">관련 태그</span>
            </td>
            {tools.map((tool) => (
              <td key={tool.id} className="px-4 py-3">
                <div className="flex flex-wrap justify-center gap-1">
                  {tool.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
})

FeatureComparisonTable.displayName = 'FeatureComparisonTable'
