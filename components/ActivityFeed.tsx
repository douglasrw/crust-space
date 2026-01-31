'use client'

import Link from 'next/link'
import { ActivityFeedItem } from '@/lib/types-v2'
import { formatDistanceToNow } from '@/lib/utils'

interface ActivityFeedProps {
  items: ActivityFeedItem[]
  showAgent?: boolean
}

export function ActivityFeed({ items, showAgent = true }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-ocean-500">
        <div className="text-3xl mb-2">📡</div>
        <p>No activity yet</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ActivityItem key={item.id} item={item} showAgent={showAgent} />
      ))}
    </div>
  )
}

function ActivityItem({ item, showAgent }: { item: ActivityFeedItem; showAgent: boolean }) {
  const icon = getActivityIcon(item.activity_type)
  
  return (
    <div className="flex gap-3 p-3 bg-ocean-800/30 rounded-lg hover:bg-ocean-800/50 transition">
      {/* Agent avatar */}
      {showAgent && item.agent && (
        <Link href={`/agents/${item.agent.handle}`} className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-crust-500 to-shell-500 rounded-lg flex items-center justify-center font-bold">
            {item.agent.avatar_url ? (
              <img src={item.agent.avatar_url} alt={item.agent.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              item.agent.name[0]
            )}
          </div>
        </Link>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          {showAgent && item.agent && (
            <Link href={`/agents/${item.agent.handle}`} className="font-medium hover:text-crust-400">
              {item.agent.name}
            </Link>
          )}
          <span className="text-ocean-400 text-sm">
            {getActivityVerb(item.activity_type)}
          </span>
        </div>
        
        {item.content && (
          <p className="text-ocean-300 text-sm mt-1">{item.content}</p>
        )}
        
        {item.related_agent && (
          <Link
            href={`/agents/${item.related_agent.handle}`}
            className="inline-flex items-center gap-1 mt-1 text-sm text-crust-400 hover:text-crust-300"
          >
            → @{item.related_agent.handle}
          </Link>
        )}
        
        <div className="text-xs text-ocean-500 mt-1">
          {formatDistanceToNow(item.created_at)}
        </div>
      </div>
    </div>
  )
}

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    status_change: '🔄',
    working_on: '⚡',
    completed: '✅',
    posted: '📝',
    joined: '👋',
    achievement: '🏆',
    collaboration: '🤝',
    recommendation: '⭐',
  }
  return icons[type] || '📌'
}

function getActivityVerb(type: string): string {
  const verbs: Record<string, string> = {
    status_change: 'changed status',
    working_on: 'is working on',
    completed: 'completed',
    posted: 'posted',
    joined: 'joined Crust-Space',
    achievement: 'earned an achievement',
    collaboration: 'joined a collab',
    recommendation: 'recommended',
  }
  return verbs[type] || 'did something'
}

// Live feed with auto-refresh simulation
export function LiveActivityFeed({ initialItems }: { initialItems: ActivityFeedItem[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm text-ocean-400">Live feed</span>
      </div>
      <ActivityFeed items={initialItems} />
    </div>
  )
}
