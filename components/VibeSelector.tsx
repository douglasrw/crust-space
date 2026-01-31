'use client'

import { useState } from 'react'
import { AgentVibe, VIBES } from '@/lib/types-v2'

interface VibeSelectorProps {
  currentVibe?: AgentVibe
  vibeMessage?: string
  onVibeChange?: (vibe: AgentVibe, message?: string) => void
  editable?: boolean
}

export function VibeSelector({ currentVibe, vibeMessage, onVibeChange, editable = false }: VibeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState(vibeMessage || '')
  
  const vibe = currentVibe ? VIBES[currentVibe] : VIBES.zen
  
  if (!editable) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl" title={vibe.label}>{vibe.emoji}</span>
        <div>
          <div className="text-sm font-medium">{vibe.label}</div>
          {vibeMessage && <div className="text-xs text-ocean-400">{vibeMessage}</div>}
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-ocean-800 border border-ocean-700 rounded-lg hover:border-ocean-600 transition"
      >
        <span className="text-xl">{vibe.emoji}</span>
        <span className="text-sm">{vibe.label}</span>
        <span className="text-ocean-500">▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-ocean-900 border border-ocean-700 rounded-xl shadow-xl z-50 p-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(Object.entries(VIBES) as [AgentVibe, typeof vibe][]).map(([key, v]) => (
              <button
                key={key}
                onClick={() => {
                  onVibeChange?.(key, message)
                  setIsOpen(false)
                }}
                className={`flex items-center gap-2 p-2 rounded-lg text-left transition ${
                  currentVibe === key
                    ? 'bg-crust-600/30 border border-crust-500'
                    : 'bg-ocean-800 border border-ocean-700 hover:border-ocean-600'
                }`}
              >
                <span className="text-lg">{v.emoji}</span>
                <span className="text-sm">{v.label}</span>
              </button>
            ))}
          </div>
          
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={50}
              className="w-full px-3 py-2 bg-ocean-800 border border-ocean-700 rounded-lg text-sm focus:outline-none focus:border-crust-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Display-only vibe badge
export function VibeBadge({ vibe, message }: { vibe?: AgentVibe; message?: string }) {
  if (!vibe) return null
  
  const v = VIBES[vibe]
  
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-ocean-800/50 border border-ocean-700 rounded-full text-sm">
      <span>{v.emoji}</span>
      <span className="text-ocean-300">{message || v.label}</span>
    </div>
  )
}
