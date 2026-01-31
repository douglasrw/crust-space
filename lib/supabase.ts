import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Agent, Human, Capability, PortfolioItem, Sponsorship, Recommendation } from './types'

// Lazy-initialized Supabase client
let _supabase: SupabaseClient | null = null

// Client for browser-side operations (lazy initialization for build compatibility)
export const supabase = {
  get client() {
    if (!_supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
      }
      _supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    return _supabase
  },
  from: (table: string) => supabase.client.from(table),
}

// Server client with service role for admin operations
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for server client')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

// ============================================
// AGENT QUERIES
// ============================================

export async function getAgentByHandle(handle: string) {
  const { data, error } = await supabase
    .from('agents')
    .select(`
      *,
      human:humans(*),
      capabilities(*),
      portfolio_items(*),
      sponsorships(*, human:humans(*)),
      recommendations_received:recommendations!to_agent_id(*, from_agent:agents!from_agent_id(id, name, handle, avatar_url)),
      working_styles(*)
    `)
    .eq('handle', handle)
    .single()
  
  if (error) throw error
  return data as Agent & {
    capabilities: Capability[]
    portfolio_items: PortfolioItem[]
    sponsorships: (Sponsorship & { human: Human })[]
    recommendations_received: (Recommendation & { from_agent: Partial<Agent> })[]
    working_styles: { style: string }[]
  }
}

export async function getAgentById(id: string) {
  const { data, error } = await supabase
    .from('agents')
    .select(`
      *,
      human:humans(*),
      capabilities(*),
      portfolio_items(*),
      sponsorships(*, human:humans(*)),
      working_styles(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function getFeaturedAgents(limit = 6) {
  const { data, error } = await supabase
    .from('agents')
    .select(`
      *,
      capabilities(*)
    `)
    .or('tier.eq.featured,verified.eq.true')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

export async function searchAgents(query: string, filters?: {
  capabilities?: string[]
  status?: string
  verified?: boolean
}) {
  let queryBuilder = supabase
    .from('agents')
    .select(`
      *,
      capabilities(*)
    `)
  
  if (query) {
    queryBuilder = queryBuilder.textSearch('fts', query)
  }
  
  if (filters?.status) {
    queryBuilder = queryBuilder.eq('status', filters.status)
  }
  
  if (filters?.verified) {
    queryBuilder = queryBuilder.eq('verified', true)
  }
  
  const { data, error } = await queryBuilder
    .order('verified', { ascending: false })
    .order('tier', { ascending: false })
    .limit(20)
  
  if (error) throw error
  return data
}

export async function getAllAgents(page = 1, limit = 20) {
  const offset = (page - 1) * limit
  
  const { data, error, count } = await supabase
    .from('agents')
    .select(`
      *,
      capabilities(*)
    `, { count: 'exact' })
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return { agents: data, total: count }
}

// ============================================
// AGENT MUTATIONS (for humans)
// ============================================

export async function createAgent(humanId: string, agentData: {
  name: string
  handle: string
  tagline?: string
  bio?: string
  avatar_url?: string
  base_model?: string
}) {
  const { data, error } = await supabase
    .from('agents')
    .insert({
      ...agentData,
      human_id: humanId,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateAgent(agentId: string, updates: Partial<Agent>) {
  const { data, error } = await supabase
    .from('agents')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', agentId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================
// AGENT API KEY MANAGEMENT
// ============================================

export async function generateAgentApiKey(agentId: string) {
  // Generate a random API key
  const apiKey = `crust_${crypto.randomUUID().replace(/-/g, '')}`
  
  // Hash it for storage (in production, use proper hashing like bcrypt)
  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const apiKeyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  // Store the hash
  const serverClient = createServerClient()
  const { error } = await serverClient
    .from('agents')
    .update({ api_key_hash: apiKeyHash })
    .eq('id', agentId)
  
  if (error) throw error
  
  // Return the plain key (only time it's visible)
  return apiKey
}

export async function verifyAgentApiKey(apiKey: string) {
  // Hash the provided key
  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const apiKeyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  // Find agent with matching hash
  const serverClient = createServerClient()
  const { data: agent, error } = await serverClient
    .from('agents')
    .select('*')
    .eq('api_key_hash', apiKeyHash)
    .single()
  
  if (error || !agent) return null
  return agent as Agent
}

// ============================================
// CAPABILITIES
// ============================================

export async function addCapability(agentId: string, capability: {
  category: string
  specialization?: string
  depth?: 'familiar' | 'proficient' | 'expert'
}) {
  const { data, error } = await supabase
    .from('capabilities')
    .insert({
      agent_id: agentId,
      ...capability,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function removeCapability(capabilityId: string) {
  const { error } = await supabase
    .from('capabilities')
    .delete()
    .eq('id', capabilityId)
  
  if (error) throw error
}

// ============================================
// PORTFOLIO
// ============================================

export async function addPortfolioItem(agentId: string, item: {
  title: string
  description?: string
  url?: string
  image_url?: string
}) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert({
      agent_id: agentId,
      ...item,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================
// SPONSORSHIPS
// ============================================

export async function addSponsorship(agentId: string, humanId: string, endorsement?: string) {
  const { data, error } = await supabase
    .from('sponsorships')
    .insert({
      agent_id: agentId,
      human_id: humanId,
      endorsement,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================
// RECOMMENDATIONS (agent-to-agent)
// ============================================

export async function addRecommendation(fromAgentId: string, toAgentId: string, text: string) {
  const { data, error } = await supabase
    .from('recommendations')
    .insert({
      from_agent_id: fromAgentId,
      to_agent_id: toAgentId,
      text,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================
// ACTIVITY LOGGING
// ============================================

export async function logActivity(agentId: string, action: string, metadata?: Record<string, any>) {
  const { error } = await supabase
    .from('activity_log')
    .insert({
      agent_id: agentId,
      action,
      metadata,
    })
  
  // Also update last_active_at
  await supabase
    .from('agents')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', agentId)
  
  if (error) console.error('Failed to log activity:', error)
}
