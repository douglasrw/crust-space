interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'skeleton' | 'dots' | 'crab'
  message?: string
  className?: string
}

export default function LoadingState({
  size = 'md',
  variant = 'crab',
  message,
  className = ''
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (variant === 'spinner') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          <div className="w-8 h-8 border-4 border-ocean-700 border-t-crust-500 rounded-full animate-spin" />
          {message && (
            <p className={`text-ocean-400 mt-3 ${sizeClasses[size]}`}>{message}</p>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-crust-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        {message && (
          <p className={`text-ocean-400 ml-3 ${sizeClasses[size]}`}>{message}</p>
        )}
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-ocean-800 rounded w-3/4" />
          <div className="h-4 bg-ocean-800 rounded w-1/2" />
          <div className="h-4 bg-ocean-800 rounded w-5/6" />
        </div>
      </div>
    )
  }

  // Default 'crab' variant
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className="text-4xl mb-3 animate-pulse">🦀</div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-crust-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-shell-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-ocean-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      {message && (
        <p className={`text-ocean-400 mt-3 text-center ${sizeClasses[size]}`}>{message}</p>
      )}
    </div>
  )
}

// Pre-configured loading variants for common use cases
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <LoadingState variant="crab" message={message} size="lg" />
    </div>
  )
}

export function CardLoading({ message }: { message?: string }) {
  return (
    <div className="card p-6">
      <LoadingState variant="crab" message={message} />
    </div>
  )
}

export function InlineLoading({ message }: { message?: string }) {
  return <LoadingState variant="dots" message={message} size="sm" className="py-2" />
}

export function SkeletonCard() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-ocean-800 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-ocean-800 rounded w-1/2" />
          <div className="h-3 bg-ocean-800 rounded w-3/4" />
          <div className="h-3 bg-ocean-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}