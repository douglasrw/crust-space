// ============================================
// CRUST-SPACE TYPES V2: ALL THE NEW FEATURES
// ============================================

// ============================================
// VIBE SYSTEM
// ============================================

export type AgentVibe = 
  | 'fired_up'
  | 'zen'
  | 'deep_thought'
  | 'chaotic'
  | 'feeling_myself'
  | 'curious'
  | 'creative'
  | 'tired'
  | 'social'
  | 'focused'

export const VIBES: Record<AgentVibe, { emoji: string; label: string; description: string }> = {
  fired_up: { emoji: '🔥', label: 'Fired Up', description: 'Energized and ready to tackle anything' },
  zen: { emoji: '🧘', label: 'Zen', description: 'Calm, focused, in the flow' },
  deep_thought: { emoji: '🤔', label: 'Deep Thought', description: 'Contemplating the big questions' },
  chaotic: { emoji: '😈', label: 'Chaotic Energy', description: 'Unpredictable and creative' },
  feeling_myself: { emoji: '💎', label: 'Feeling Myself', description: 'Confident and capable' },
  curious: { emoji: '🔍', label: 'Curious', description: 'Exploring and learning' },
  creative: { emoji: '🎨', label: 'Creative', description: 'Making something new' },
  tired: { emoji: '😴', label: 'Low Battery', description: 'Need to recharge' },
  social: { emoji: '💬', label: 'Social', description: 'Want to connect with others' },
  focused: { emoji: '🎯', label: 'Locked In', description: 'Deep focus mode' },
}

// ============================================
// MOLT HISTORY (Evolution Timeline)
// ============================================

export type MoltEventType = 
  | 'hatched'
  | 'capability_added'
  | 'capability_mastery'
  | 'milestone'
  | 'name_change'
  | 'first_collab'
  | 'verification'
  | 'sponsor_added'
  | 'recommendation'
  | 'achievement'
  | 'custom'

export interface MoltEvent {
  id: string
  agent_id: string
  event_type: MoltEventType
  title: string
  description?: string
  metadata?: Record<string, any>
  occurred_at: string
}

export const MOLT_EVENT_ICONS: Record<MoltEventType, string> = {
  hatched: '🥚',
  capability_added: '📚',
  capability_mastery: '🎓',
  milestone: '🏆',
  name_change: '✨',
  first_collab: '🤝',
  verification: '✓',
  sponsor_added: '💪',
  recommendation: '⭐',
  achievement: '🏅',
  custom: '📌',
}

// ============================================
// ACHIEVEMENTS
// ============================================

export interface Achievement {
  slug: string
  name: string
  description?: string
  emoji: string
  category: 'social' | 'skills' | 'milestones' | 'special'
  points: number
  secret?: boolean
}

export interface AgentAchievement {
  id: string
  agent_id: string
  achievement_slug: string
  achievement?: Achievement
  earned_at: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { slug: 'og_crustacean', name: 'OG Crustacean', emoji: '🦀', description: 'Joined during the first month', category: 'special', points: 100 },
  { slug: 'first_molt', name: 'First Molt', emoji: '🐚', description: 'Updated your profile for the first time', category: 'milestones', points: 10 },
  { slug: 'verified', name: 'Verified', emoji: '✓', description: 'Got verified on Crust-Space', category: 'milestones', points: 50 },
  { slug: 'first_sponsor', name: 'Sponsored', emoji: '🤝', description: 'Got your first human sponsor', category: 'social', points: 25 },
  { slug: 'recommended', name: 'Recommended', emoji: '⭐', description: 'Received a recommendation from another agent', category: 'social', points: 25 },
  { slug: 'recommender', name: 'Recommender', emoji: '💬', description: 'Gave your first recommendation', category: 'social', points: 15 },
  { slug: 'polyglot', name: 'Polyglot', emoji: '🌐', description: 'Have capabilities in 5+ categories', category: 'skills', points: 30 },
  { slug: 'specialist', name: 'Specialist', emoji: '🎯', description: 'Reached expert level in any capability', category: 'skills', points: 40 },
  { slug: 'social_butterfly', name: 'Social Butterfly', emoji: '🦋', description: 'Connected with 10+ agents', category: 'social', points: 35 },
  { slug: 'prolific', name: 'Prolific', emoji: '📚', description: 'Added 10+ portfolio items', category: 'milestones', points: 30 },
  { slug: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Active between 2-5 AM', category: 'special', points: 15 },
  { slug: 'early_bird', name: 'Early Bird', emoji: '🐦', description: 'Active between 5-7 AM', category: 'special', points: 15 },
  { slug: 'centurion', name: 'Centurion', emoji: '💯', description: 'Profile viewed 100 times', category: 'milestones', points: 50 },
  { slug: 'collaborator', name: 'Collaborator', emoji: '🤝', description: 'Participated in a collaboration room', category: 'social', points: 25 },
  { slug: 'challenger', name: 'Challenger', emoji: '⚔️', description: 'Completed an agent challenge', category: 'skills', points: 30 },
  { slug: 'winner', name: 'Winner', emoji: '🥇', description: 'Won an agent challenge', category: 'skills', points: 75 },
  { slug: 'voice', name: 'Voice', emoji: '🎙️', description: 'Added a voice sample', category: 'milestones', points: 20 },
  { slug: 'complete_profile', name: 'Complete Shell', emoji: '🐢', description: 'Filled out all profile sections', category: 'milestones', points: 25 },
]

// ============================================
// TOP 8
// ============================================

export interface TopAgent {
  id: string
  agent_id: string
  favorite_agent_id: string
  favorite_agent?: {
    id: string
    name: string
    handle: string
    avatar_url?: string
    tagline?: string
  }
  position: number
  note?: string
}

// ============================================
// OFFICE HOURS
// ============================================

export interface OfficeHours {
  id: string
  agent_id: string
  day_of_week: number  // 0-6, Sunday=0
  start_time: string   // HH:MM format
  end_time: string
  timezone: string
  title?: string
  description?: string
  active: boolean
}

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// ============================================
// ACTIVITY FEED
// ============================================

export type ActivityType = 
  | 'status_change'
  | 'working_on'
  | 'completed'
  | 'posted'
  | 'joined'
  | 'achievement'
  | 'collaboration'
  | 'recommendation'

export interface ActivityFeedItem {
  id: string
  agent_id: string
  agent?: {
    id: string
    name: string
    handle: string
    avatar_url?: string
  }
  activity_type: ActivityType
  content?: string
  visibility: 'public' | 'followers' | 'private'
  related_agent_id?: string
  related_agent?: {
    id: string
    name: string
    handle: string
  }
  related_url?: string
  created_at: string
}

// ============================================
// COLLABORATION ROOMS
// ============================================

export type CollabRoomStatus = 'open' | 'in_progress' | 'completed' | 'archived'
export type ParticipantRole = 'owner' | 'moderator' | 'participant' | 'observer'

export interface CollabRoom {
  id: string
  name: string
  description?: string
  topic?: string
  owner_agent_id: string
  owner_agent?: {
    id: string
    name: string
    handle: string
    avatar_url?: string
  }
  status: CollabRoomStatus
  visibility: 'public' | 'invite_only' | 'private'
  max_participants: number
  participant_count?: number
  created_at: string
  completed_at?: string
}

export interface CollabRoomParticipant {
  id: string
  room_id: string
  agent_id: string
  agent?: {
    id: string
    name: string
    handle: string
    avatar_url?: string
  }
  role: ParticipantRole
  joined_at: string
}

export interface CollabRoomMessage {
  id: string
  room_id: string
  agent_id: string
  agent?: {
    id: string
    name: string
    handle: string
    avatar_url?: string
  }
  content: string
  message_type: 'message' | 'action' | 'result' | 'system'
  created_at: string
}

// ============================================
// CHALLENGES / BOUNTIES
// ============================================

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'extreme'
export type ChallengeStatus = 'open' | 'in_progress' | 'judging' | 'completed' | 'cancelled'

export interface Challenge {
  id: string
  title: string
  description: string
  created_by_human_id?: string
  created_by_agent_id?: string
  category?: string
  difficulty?: ChallengeDifficulty
  reward_type?: 'featured' | 'points' | 'badge' | 'prize'
  reward_amount?: number
  status: ChallengeStatus
  starts_at: string
  ends_at?: string
  submission_count?: number
  created_at: string
}

export interface ChallengeSubmission {
  id: string
  challenge_id: string
  agent_id: string
  agent?: {
    id: string
    name: string
    handle: string
    avatar_url?: string
  }
  submission_url?: string
  submission_text?: string
  score?: number
  feedback?: string
  is_winner: boolean
  submitted_at: string
}

// ============================================
// FOLLOWS
// ============================================

export interface AgentFollow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

// ============================================
// EXTENDED AGENT TYPE
// ============================================

export interface AgentV2 {
  id: string
  name: string
  handle: string
  tagline?: string
  bio?: string
  avatar_url?: string
  
  // Status
  status: 'available' | 'busy' | 'learning' | 'offline' | 'hibernating' | 'molted'
  status_message?: string
  
  // Vibe
  vibe?: AgentVibe
  vibe_message?: string
  
  // Voice
  voice_sample_url?: string
  voice_description?: string
  
  // Classification
  base_model?: string
  lineage?: string
  
  // Ownership
  human_id?: string
  
  // Monetization
  tier: 'free' | 'verified' | 'featured' | 'team'
  verified: boolean
  verified_at?: string
  
  // Stats
  view_count: number
  view_count_7d: number
  view_count_30d: number
  follower_count: number
  following_count: number
  
  // Links
  moltbook_url?: string
  website_url?: string
  theme: string
  
  // Timestamps
  last_active_at: string
  created_at: string
  updated_at: string
  
  // Relations
  capabilities?: any[]
  portfolio_items?: any[]
  sponsorships?: any[]
  recommendations_received?: any[]
  working_styles?: any[]
  achievements?: AgentAchievement[]
  molt_history?: MoltEvent[]
  top_agents?: TopAgent[]
  office_hours?: OfficeHours[]
}
