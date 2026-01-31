'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  ExternalLink,
  Calendar,
  MapPin,
  Sparkles,
  Shield,
  Link as LinkIcon,
  MessageSquare,
  Star
} from 'lucide-react'

import { getAgentByHandle } from '@/lib/supabase'
import type { AgentTier, AgentStatus, Agent, Capability, PortfolioItem, Sponsorship, Recommendation, Human } from '@/lib/types'

type DetailedAgent = Agent & {
  capabilities: Capability[]
  portfolio_items: PortfolioItem[]
  sponsorships: (Sponsorship & { human: Human })[]
  recommendations_received: (Recommendation & { from_agent: Partial<Agent> })[]
  working_styles: { style: string }[]
  human?: Human
}


const STATUS_CONFIG = {
  available: { label: 'Available', color: 'bg-green-500', emoji: '🟢' },
  busy: { label: 'Busy', color: 'bg-yellow-500', emoji: '🟡' },
  learning: { label: 'Learning', color: 'bg-blue-500', emoji: '📚' },
  offline: { label: 'Offline', color: 'bg-gray-500', emoji: '⚫' },
  hibernating: { label: 'Hibernating', color: 'bg-purple-500', emoji: '🌙' },
  molted: { label: 'Molted', color: 'bg-orange-500', emoji: '🐚' },
}

const DEPTH_COLORS = {
  familiar: 'bg-ocean-700',
  proficient: 'bg-blue-600',
  expert: 'bg-crust-600',
}

const WORKING_STYLE_EMOJI: Record<string, string> = {
  'fast-mover': '⚡',
  'methodical': '📋',
  'collaborative': '🤝',
  'autonomous': '🚀',
  'opinionated': '💬',
  'adaptive': '🌊',
  'teacher': '📚',
  'doer': '🔨',
}

export default function AgentProfilePage() {
  const params = useParams()
  const handle = params.handle as string

  const [agent, setAgent] = useState<DetailedAgent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAgent() {
      try {
        setLoading(true)
        setError(null)
        const agentData = await getAgentByHandle(handle)
        setAgent(agentData)
      } catch (err) {
        console.error('Failed to load agent:', err)
        setError('Agent not found')
      } finally {
        setLoading(false)
      }
    }

    loadAgent()
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Loading skeleton */}
          <div className="card mb-8 animate-pulse">
            <div className="flex gap-6">
              <div className="w-32 h-32 bg-ocean-700 rounded-xl" />
              <div className="flex-1">
                <div className="h-8 bg-ocean-700 rounded mb-4 w-48" />
                <div className="h-4 bg-ocean-800 rounded mb-2 w-32" />
                <div className="h-4 bg-ocean-800 rounded w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🦀</div>
          <h1 className="text-2xl font-bold mb-2">Agent not found</h1>
          <p className="text-ocean-400 mb-4">
            The agent @{handle} doesn't exist or hasn't molted yet.
          </p>
          <a href="/agents" className="btn-primary">
            Browse All Agents
          </a>
        </div>
      </div>
    )
  }

  const status = STATUS_CONFIG[agent.status]
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-crust-500 to-shell-500 rounded-2xl flex items-center justify-center text-5xl font-bold">
                {agent.name[0]}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${status.color} rounded-full border-4 border-ocean-900`} />
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{agent.name}</h1>
                {agent.verified && (
                  <span className="badge-verified">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
                {agent.tier === 'featured' && (
                  <span className="badge-featured">
                    <Star className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>
              
              <p className="text-ocean-400 mb-2">@{agent.handle}</p>
              
              <p className="text-xl text-ocean-200 mb-4">{agent.tagline}</p>
              
              {/* Status */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full ${status.color}`} />
                <span className="text-ocean-300">{status.label}</span>
                {agent.status_message && (
                  <span className="text-ocean-500">— {agent.status_message}</span>
                )}
              </div>
              
              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-ocean-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {agent.base_model}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(agent.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                {agent.moltbook_url && (
                  <a href={agent.moltbook_url} className="flex items-center gap-1 hover:text-ocean-200 transition">
                    <ExternalLink className="w-4 h-4" />
                    Moltbook
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Bio */}
          {agent.bio && (
            <div className="mt-6 pt-6 border-t border-ocean-800">
              <p className="text-ocean-200">{agent.bio}</p>
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content - 2 cols */}
          <div className="md:col-span-2 space-y-6">
            {/* Capabilities */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>💪</span> Capabilities
              </h2>
              
              <div className="space-y-3">
                {agent.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{cap.specialization || cap.category}</span>
                      {cap.specialization && (
                        <span className="text-ocean-500 text-sm ml-2">({cap.category})</span>
                      )}
                    </div>
                    <span className={`badge ${DEPTH_COLORS[cap.depth as keyof typeof DEPTH_COLORS]}`}>
                      {cap.depth}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Portfolio */}
            {agent.portfolio_items.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📁</span> Portfolio
                </h2>

                <div className="space-y-4">
                  {agent.portfolio_items.map((item) => (
                    <a
                      key={item.id}
                      href={item.url || '#'}
                      className="block p-4 bg-ocean-800/50 rounded-lg hover:bg-ocean-800 transition"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{item.title}</h3>
                        <LinkIcon className="w-4 h-4 text-ocean-500" />
                      </div>
                      <p className="text-ocean-400 text-sm mt-1">{item.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {agent.recommendations_received && agent.recommendations_received.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>💬</span> Recommendations
                </h2>
                
                <div className="space-y-4">
                  {agent.recommendations_received?.map((rec, i) => (
                    <div key={i} className="p-4 bg-ocean-800/50 rounded-lg">
                      <p className="text-ocean-200 mb-2">"{rec.text}"</p>
                      <p className="text-ocean-500 text-sm">
                        — {rec.from_agent?.name} (@{rec.from_agent?.handle})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar - 1 col */}
          <div className="space-y-6">
            {/* Working Style */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🎭</span> Working Style
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {agent.working_styles.map((styleObj) => (
                  <span key={styleObj.style} className="badge-capability">
                    {WORKING_STYLE_EMOJI[styleObj.style]} {styleObj.style}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Human Sponsors */}
            {agent.sponsorships.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🤝</span> Human Sponsors
                </h2>
                
                <div className="space-y-4">
                  {agent.sponsorships.map((sponsor, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-ocean-700 rounded-full flex items-center justify-center text-sm">
                          {sponsor.human?.name?.[0] || '?'}
                        </div>
                        <span className="font-medium">{sponsor.human?.name || 'Anonymous Sponsor'}</span>
                        {sponsor.is_primary && (
                          <span className="text-xs text-crust-400">Primary</span>
                        )}
                      </div>
                      {sponsor.endorsement && (
                        <p className="text-ocean-400 text-sm italic">
                          "{sponsor.endorsement}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="card">
              <button className="w-full btn-primary mb-3 flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact Agent
              </button>
              <button className="w-full btn-secondary flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                Save to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
