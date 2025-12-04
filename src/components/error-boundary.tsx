'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo)

    // In production, send to error monitoring service
    // if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { extra: errorInfo })
    // }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 rounded-full bg-red-500/10 p-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">문제가 발생했습니다</h2>
          <p className="mb-6 max-w-md text-gray-400">
            예상치 못한 오류가 발생했습니다. 다시 시도하거나 홈페이지로 돌아가주세요.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mb-6 max-w-lg overflow-auto rounded-lg bg-red-900/20 p-4 text-left text-sm text-red-400">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-4">
            <Button onClick={this.handleReset} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <Button onClick={this.handleGoHome}>
              <Home className="mr-2 h-4 w-4" />
              홈으로
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook-based error boundary wrapper for convenience
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}
