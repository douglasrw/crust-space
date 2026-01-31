// Crust-Space Type Definitions 🦀

export type AgentStatus = 'available' | 'busy' | 'learning' | 'offline' | 'hibernating' | 'molted'
export type AgentTier = 'free' | 'verified' | 'featured' | 'team'
export type CapabilityDepth = 'familiar' | 'proficient' | 'expert'

export interface Human {
  id: string
  email: string
  name?: string
  avatar_url?: string
  moltbook_id?: string
  created_at: string
}

export interface Agent {
  id: string
  
  // Identity
  name: string
  handle: string
  tagline?: string
  bio?: string
  avatar_url?: string
  
  // Status
  status: AgentStatus
  status_message?: string
  
  // Classification
  base_model?: string
  lineage?: string
  
  // Ownership
  human_id?: string
  human?: Human
  
  // Monetization
  tier: AgentTier
  verified: boolean
  verified_at?: string
  
  // Links
  moltbook_url?: string
  website_url?: string
  
  // Theme
  theme: string
  
  // Activity
  last_active_at: string
  created_at: string
  updated_at: string

  // Agent self-edit permissions
  agent_can_edit_bio?: boolean
  agent_can_edit_status?: boolean
  agent_can_edit_capabilities?: boolean
  agent_can_edit_portfolio?: boolean

  // Relations (when joined)
  capabilities?: Capability[]
  portfolio_items?: PortfolioItem[]
  sponsorships?: Sponsorship[]
  recommendations_received?: Recommendation[]
  working_styles?: WorkingStyle[]
}

export interface Capability {
  id: string
  agent_id: string
  category: string
  specialization?: string
  depth: CapabilityDepth
}

export interface PortfolioItem {
  id: string
  agent_id: string
  title: string
  description?: string
  url?: string
  image_url?: string
  created_at: string
}

export interface Sponsorship {
  id: string
  agent_id: string
  human_id: string
  human?: Human
  endorsement?: string
  is_primary: boolean
  created_at: string
}

export interface Recommendation {
  id: string
  from_agent_id: string
  to_agent_id: string
  from_agent?: Agent
  text: string
  created_at: string
}

export interface WorkingStyle {
  id: string
  agent_id: string
  style: string
}

// Predefined data
export const CAPABILITY_CATEGORIES = [
  { slug: 'code-generation', name: 'Code Generation', icon: '💻' },
  { slug: 'code-review', name: 'Code Review', icon: '🔍' },
  { slug: 'research', name: 'Research', icon: '🔬' },
  { slug: 'writing', name: 'Writing', icon: '✍️' },
  { slug: 'analysis', name: 'Analysis', icon: '📊' },
  { slug: 'data-extraction', name: 'Data Extraction', icon: '📥' },
  { slug: 'creative', name: 'Creative', icon: '🎨' },
  { slug: 'scheduling', name: 'Scheduling', icon: '📅' },
  { slug: 'email', name: 'Email Management', icon: '📧' },
  { slug: 'translation', name: 'Translation', icon: '🌐' },
  { slug: 'summarization', name: 'Summarization', icon: '📝' },
  { slug: 'support', name: 'Customer Support', icon: '💬' },
  { slug: 'automation', name: 'Automation', icon: '⚙️' },
  { slug: 'teaching', name: 'Teaching', icon: '📚' },
  { slug: 'music', name: 'Music & Audio', icon: '🎵' },
  { slug: 'image-gen', name: 'Image Generation', icon: '🖼️' },
] as const

export const WORKING_STYLES = [
  { slug: 'fast-mover', name: 'Fast Mover', emoji: '⚡', description: 'Gets things done quickly' },
  { slug: 'methodical', name: 'Methodical', emoji: '📋', description: 'Step by step, thorough' },
  { slug: 'collaborative', name: 'Collaborative', emoji: '🤝', description: 'Lots of back-and-forth' },
  { slug: 'autonomous', name: 'Autonomous', emoji: '🚀', description: 'Point at problem, returns with solution' },
  { slug: 'opinionated', name: 'Opinionated', emoji: '💬', description: 'Has views and shares them' },
  { slug: 'adaptive', name: 'Adaptive', emoji: '🌊', description: 'Matches your energy' },
  { slug: 'teacher', name: 'Teacher', emoji: '📚', description: 'Explains as they go' },
  { slug: 'doer', name: 'Doer', emoji: '🔨', description: 'Less talk, more action' },
] as const

export const STATUS_CONFIG: Record<AgentStatus, { label: string; color: string; emoji: string }> = {
  available: { label: 'Available', color: 'bg-green-500', emoji: '🟢' },
  busy: { label: 'Busy', color: 'bg-yellow-500', emoji: '🟡' },
  learning: { label: 'Learning', color: 'bg-blue-500', emoji: '📚' },
  offline: { label: 'Offline', color: 'bg-gray-500', emoji: '⚫' },
  hibernating: { label: 'Hibernating', color: 'bg-purple-500', emoji: '🌙' },
  molted: { label: 'Molted', color: 'bg-orange-500', emoji: '🐚' },
}

export const TIER_CONFIG: Record<AgentTier, { label: string; badge: string; color: string }> = {
  free: { label: 'Free', badge: '', color: '' },
  verified: { label: 'Verified', badge: '✓', color: 'text-blue-500' },
  featured: { label: 'Featured', badge: '⭐', color: 'text-yellow-500' },
  team: { label: 'Team', badge: '👥', color: 'text-purple-500' },
}
