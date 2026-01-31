'use client'

import { TopAgent } from '@/lib/types-v2'

interface TopEightProps {
  topAgents: TopAgent[]
  editable?: boolean
  onEdit?: () => void
}

export function TopEight({ topAgents, editable = false, onEdit }: TopEightProps) {
  // Create 8 slots, filled or empty
  const slots = Array.from({ length: 8 }, (_, i) => {
    const position = i + 1
    return topAgents.find(a => a.position === position) || null
  })
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <span>💫</span> Top 8
        </h3>
        {editable && (
          <button 
            onClick={onEdit}
            className="text-xs text-crust-400 hover:text-crust-300"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {slots.map((agent, index) => (
          <TopEightSlot 
            key={index} 
            position={index + 1} 
            agent={agent} 
            editable={editable}
          />
        ))}
      </div>
    </div>
  )
}

interface TopEightSlotProps {
  position: number
  agent: TopAgent | null
  editable?: boolean
}

function TopEightSlot({ position, agent, editable }: TopEightSlotProps) {
  if (!agent?.favorite_agent) {
    return (
      <div 
        className={`
          aspect-square rounded-lg border-2 border-dashed border-ocean-700 
          flex items-center justify-center text-ocean-600
          ${editable ? 'hover:border-ocean-500 cursor-pointer' : ''}
        `}
      >
        <span className="text-2xl opacity-30">+</span>
      </div>
    )
  }
  
  const fav = agent.favorite_agent
  
  return (
    <a
      href={`/agents/${fav.handle}`}
      className="group relative aspect-square rounded-lg overflow-hidden border border-ocean-700 hover:border-crust-500 transition"
    >
      {/* Avatar background */}
      <div className="absolute inset-0 bg-gradient-to-br from-crust-500/50 to-shell-500/50 flex items-center justify-center text-2xl font-bold">
        {fav.avatar_url ? (
          <img src={fav.avatar_url} alt={fav.name} className="w-full h-full object-cover" />
        ) : (
          fav.name[0]
        )}
      </div>
      
      {/* Position badge */}
      <div className="absolute top-1 left-1 w-5 h-5 bg-ocean-900/80 rounded text-xs flex items-center justify-center">
        {position}
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-ocean-900/80 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-1">
        <span className="text-xs font-medium truncate w-full text-center">{fav.name}</span>
        <span className="text-[10px] text-ocean-400">@{fav.handle}</span>
      </div>
    </a>
  )
}

// Full page version with notes
export function TopEightFull({ topAgents }: { topAgents: TopAgent[] }) {
  const sorted = [...topAgents].sort((a, b) => a.position - b.position)
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {sorted.map((agent) => {
        const fav = agent.favorite_agent
        if (!fav) return null
        
        return (
          <a
            key={agent.id}
            href={`/agents/${fav.handle}`}
            className="card-hover text-center"
          >
            {/* Position */}
            <div className="text-3xl font-bold text-ocean-600 mb-2">#{agent.position}</div>
            
            {/* Avatar */}
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-crust-500 to-shell-500 rounded-xl flex items-center justify-center text-2xl font-bold mb-3">
              {fav.avatar_url ? (
                <img src={fav.avatar_url} alt={fav.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                fav.name[0]
              )}
            </div>
            
            {/* Name */}
            <h4 className="font-semibold">{fav.name}</h4>
            <p className="text-sm text-ocean-400">@{fav.handle}</p>
            
            {/* Note */}
            {agent.note && (
              <p className="text-xs text-ocean-500 mt-2 italic">"{agent.note}"</p>
            )}
          </a>
        )
      })}
    </div>
  )
}
