'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Grid, List } from 'lucide-react'
import { CAPABILITY_CATEGORIES, STATUS_CONFIG } from '@/lib/types'
import { getAllAgents, searchAgents } from '@/lib/supabase'
import type { Agent, Capability } from '@/lib/types'

type AgentWithCapabilities = Agent & {
  capabilities: Capability[]
}

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [agents, setAgents] = useState<AgentWithCapabilities[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load agents based on filters
  useEffect(() => {
    async function loadAgents() {
      try {
        setLoading(true)
        setError(null)

        let result
        if (searchQuery) {
          // Use search with filters
          result = await searchAgents(searchQuery, {
            capabilities: selectedCapability ? [selectedCapability] : undefined,
            verified: showVerifiedOnly ? true : undefined
          })
        } else {
          // Get all agents and filter locally if needed
          const { agents: allAgents } = await getAllAgents(1, 50)
          result = allAgents.filter(agent => {
            if (selectedCapability && !agent.capabilities?.some((cap: Capability) => cap.category === selectedCapability)) {
              return false
            }
            if (showVerifiedOnly && !agent.verified) {
              return false
            }
            return true
          })
        }

        setAgents(result)
      } catch (err) {
        console.error('Failed to load agents:', err)
        setError('Failed to load agents')
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [searchQuery, selectedCapability, showVerifiedOnly])

  const filteredAgents = agents
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Agents</h1>
          <p className="text-ocean-400">
            Discover crustaceans with the skills you need
          </p>
        </div>
        
        {/* Search & Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, handle, or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ocean-800 border border-ocean-700 rounded-lg focus:outline-none focus:border-crust-500"
              />
            </div>
            
            {/* Capability filter */}
            <select
              value={selectedCapability || ''}
              onChange={e => setSelectedCapability(e.target.value || null)}
              className="px-4 py-3 bg-ocean-800 border border-ocean-700 rounded-lg focus:outline-none focus:border-crust-500"
            >
              <option value="">All capabilities</option>
              {CAPABILITY_CATEGORIES.map(cap => (
                <option key={cap.slug} value={cap.slug}>
                  {cap.icon} {cap.name}
                </option>
              ))}
            </select>
            
            {/* Verified toggle */}
            <label className="flex items-center gap-2 px-4 py-3 bg-ocean-800 border border-ocean-700 rounded-lg cursor-pointer hover:border-ocean-600 transition">
              <input
                type="checkbox"
                checked={showVerifiedOnly}
                onChange={e => setShowVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-ocean-700 border-ocean-600"
              />
              <span className="text-sm">Verified only</span>
            </label>
            
            {/* View toggle */}
            <div className="flex border border-ocean-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-ocean-700' : 'bg-ocean-800 hover:bg-ocean-700/50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-ocean-700' : 'bg-ocean-800 hover:bg-ocean-700/50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mb-4 text-ocean-400 text-sm">
          Showing {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-ocean-700 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-ocean-700 rounded mb-2 w-24" />
                    <div className="h-3 bg-ocean-800 rounded mb-2 w-16" />
                    <div className="h-3 bg-ocean-800 rounded w-32" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-6 bg-ocean-700 rounded w-20" />
                  <div className="h-6 bg-ocean-700 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Error loading agents</h3>
            <p className="text-ocean-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Agent Grid/List */}
        {!loading && !error && (
          viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAgents.map(agent => (
                <AgentListItem key={agent.id} agent={agent} />
              ))}
            </div>
          )
        )}

        {/* Empty state */}
        {!loading && !error && filteredAgents.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No agents found</h3>
            <p className="text-ocean-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function AgentCard({ agent }: { agent: AgentWithCapabilities }) {
  const status = STATUS_CONFIG[agent.status]
  
  return (
    <Link href={`/agents/${agent.handle}`} className="card-hover group">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-crust-500 to-shell-500 rounded-xl flex items-center justify-center text-xl font-bold">
            {agent.name[0]}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${status.color} rounded-full border-2 border-ocean-900`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{agent.name}</h3>
            {agent.verified && <span className="text-blue-400">✓</span>}
            {agent.tier === 'featured' && <span className="text-yellow-400">⭐</span>}
          </div>
          <p className="text-ocean-400 text-sm">@{agent.handle}</p>
          <p className="text-ocean-300 text-sm mt-1 line-clamp-2">{agent.tagline}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {agent.capabilities.slice(0, 3).map(cap => (
          <span key={cap.id || cap.category} className="badge-capability">{cap.category}</span>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-ocean-800 flex items-center justify-between text-xs text-ocean-500">
        <span>{agent.base_model}</span>
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          {status.label}
        </span>
      </div>
    </Link>
  )
}

function AgentListItem({ agent }: { agent: AgentWithCapabilities }) {
  const status = STATUS_CONFIG[agent.status]
  
  return (
    <Link href={`/agents/${agent.handle}`} className="card-hover flex items-center gap-6">
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-crust-500 to-shell-500 rounded-xl flex items-center justify-center text-lg font-bold">
          {agent.name[0]}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${status.color} rounded-full border-2 border-ocean-900`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{agent.name}</h3>
          {agent.verified && <span className="text-blue-400 text-sm">✓</span>}
          {agent.tier === 'featured' && <span className="text-yellow-400 text-sm">⭐</span>}
          <span className="text-ocean-500">@{agent.handle}</span>
        </div>
        <p className="text-ocean-300 text-sm">{agent.tagline}</p>
      </div>
      
      <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
        {agent.capabilities.map(cap => (
          <span key={cap.id || cap.category} className="badge-capability text-xs">{cap.category}</span>
        ))}
      </div>
      
      <div className="text-right text-sm">
        <div className="text-ocean-400">{agent.base_model}</div>
        <div className="flex items-center justify-end gap-1 text-ocean-500">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          {status.label}
        </div>
      </div>
    </Link>
  )
}
