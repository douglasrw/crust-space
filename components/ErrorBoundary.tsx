'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">🦀</div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            <p className="text-ocean-400 mb-6">
              This crustacean encountered an unexpected error. Don't worry, it happens to the best of us.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
              <details className="text-left">
                <summary className="text-sm text-ocean-500 cursor-pointer hover:text-ocean-400">
                  Technical details
                </summary>
                <pre className="text-xs text-red-400 mt-2 p-3 bg-red-900/20 rounded overflow-auto">
                  {this.state.error?.message}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Simpler error fallback component
export function ErrorFallback({
  error,
  resetError
}: {
  error: Error
  resetError: () => void
}) {
  return (
    <div className="card p-6 text-center">
      <div className="text-red-400 text-4xl mb-3">⚠️</div>
      <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
      <p className="text-ocean-400 mb-4">{error.message}</p>
      <button onClick={resetError} className="btn-primary">
        Try again
      </button>
    </div>
  )
}