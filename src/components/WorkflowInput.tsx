'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Sparkles,
  Wand2,
  FileText,
  Image,
  Video,
  Music,
  Code,
  MessageSquare,
  Presentation,
  Mail,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const quickWorkflows = [
  { icon: FileText, label: '블로그 글 작성', query: '블로그 글을 작성하고 싶어요' },
  { icon: Image, label: '이미지 생성', query: 'AI로 이미지를 생성하고 싶어요' },
  { icon: Video, label: '영상 편집', query: 'AI로 영상을 편집하고 싶어요' },
  { icon: Music, label: '음악 제작', query: 'AI로 음악을 만들고 싶어요' },
  { icon: Code, label: '코드 작성', query: 'AI로 코드를 작성하고 싶어요' },
  { icon: MessageSquare, label: '챗봇 구축', query: 'AI 챗봇을 만들고 싶어요' },
  { icon: Presentation, label: '프레젠테이션', query: 'AI로 PPT를 만들고 싶어요' },
  { icon: Mail, label: '이메일 작성', query: 'AI로 이메일을 작성하고 싶어요' },
]

export function WorkflowInput() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    router.push(`/explore?q=${encodeURIComponent(query)}`)
  }

  const handleQuickWorkflow = (workflowQuery: string) => {
    setQuery(workflowQuery)
    router.push(`/explore?q=${encodeURIComponent(workflowQuery)}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Input */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <div
          className={cn(
            'relative rounded-2xl transition-all duration-300',
            isFocused
              ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20'
              : 'ring-1 ring-white/20'
          )}
        >
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="어떤 작업을 하고 싶으신가요? (예: 블로그 글 작성, 이미지 생성...)"
              className="flex-1 bg-transparent text-white text-lg placeholder:text-gray-400 focus:outline-none"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !query.trim()}
              className="h-12 px-6 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  추천받기
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.form>

      {/* Quick Workflow Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-400">인기 워크플로우</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickWorkflows.map((workflow, index) => (
            <motion.button
              key={workflow.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              onClick={() => handleQuickWorkflow(workflow.query)}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 hover:border-purple-500/50 transition-all duration-200"
            >
              <workflow.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
              <span className="text-sm text-gray-300 group-hover:text-white">{workflow.label}</span>
              <ArrowRight className="w-4 h-4 ml-auto text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
