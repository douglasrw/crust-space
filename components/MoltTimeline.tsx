'use client'

import { MoltEvent, MOLT_EVENT_ICONS } from '@/lib/types-v2'

interface MoltTimelineProps {
  events: MoltEvent[]
  limit?: number
}

export function MoltTimeline({ events, limit }: MoltTimelineProps) {
  const displayEvents = limit ? events.slice(0, limit) : events
  
  if (displayEvents.length === 0) {
    return (
      <div className="text-center py-8 text-ocean-500">
        <div className="text-3xl mb-2">🥚</div>
        <p>No molt history yet</p>
      </div>
    )
  }
  
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-crust-500 via-shell-500 to-ocean-700" />
      
      <div className="space-y-6">
        {displayEvents.map((event, index) => (
          <MoltEventItem key={event.id} event={event} isFirst={index === 0} />
        ))}
      </div>
      
      {limit && events.length > limit && (
        <div className="mt-4 text-center">
          <button className="text-crust-400 hover:text-crust-300 text-sm">
            View all {events.length} events →
          </button>
        </div>
      )}
    </div>
  )
}

function MoltEventItem({ event, isFirst }: { event: MoltEvent; isFirst: boolean }) {
  const icon = MOLT_EVENT_ICONS[event.event_type] || '📌'
  const date = new Date(event.occurred_at)
  
  return (
    <div className="relative flex gap-4 pl-2">
      {/* Icon bubble */}
      <div className={`
        relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg
        ${isFirst 
          ? 'bg-gradient-to-br from-crust-500 to-shell-500 ring-2 ring-crust-400 ring-offset-2 ring-offset-ocean-900' 
          : 'bg-ocean-800 border border-ocean-700'
        }
      `}>
        {icon}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h4 className="font-medium text-white">{event.title}</h4>
          <span className="text-xs text-ocean-500">
            {date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
        
        {event.description && (
          <p className="text-ocean-400 text-sm mt-1">{event.description}</p>
        )}
      </div>
    </div>
  )
}

// Compact version for profile sidebar
export function MoltTimelineCompact({ events }: { events: MoltEvent[] }) {
  const recent = events.slice(0, 3)
  
  return (
    <div className="space-y-2">
      {recent.map((event) => {
        const icon = MOLT_EVENT_ICONS[event.event_type] || '📌'
        const date = new Date(event.occurred_at)
        
        return (
          <div key={event.id} className="flex items-center gap-2 text-sm">
            <span>{icon}</span>
            <span className="text-ocean-300 truncate flex-1">{event.title}</span>
            <span className="text-ocean-500 text-xs">
              {date.toLocaleDateString('en-US', { month: 'short' })}
            </span>
          </div>
        )
      })}
      
      {events.length > 3 && (
        <button className="text-crust-400 hover:text-crust-300 text-xs">
          +{events.length - 3} more
        </button>
      )}
    </div>
  )
}
