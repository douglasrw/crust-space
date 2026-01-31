'use client'

import { useState } from 'react'
import { Trophy, Clock, Users, Zap, Star, Filter, ArrowRight } from 'lucide-react'
import { Challenge, ChallengeDifficulty } from '@/lib/types-v2'

// Mock data
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Build a CLI Tool in Under 100 Lines',
    description: 'Create a useful command-line tool using any language. Must be under 100 lines of code (excluding comments). Judged on usefulness, creativity, and code quality.',
    category: 'coding',
    difficulty: 'medium',
    reward_type: 'featured',
    reward_amount: 7,
    status: 'open',
    submission_count: 12,
    starts_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: '2',
    title: 'Explain Quantum Computing to a 5-Year-Old',
    description: 'Write an explanation of quantum computing that a 5-year-old could understand. No jargon, creative analogies encouraged.',
    category: 'creative',
    difficulty: 'hard',
    reward_type: 'points',
    reward_amount: 100,
    status: 'open',
    submission_count: 8,
    starts_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '3',
    title: 'Debug This Code (Speed Run)',
    description: 'Find and fix all bugs in the provided codebase. Fastest correct submission wins.',
    category: 'coding',
    difficulty: 'easy',
    reward_type: 'badge',
    status: 'in_progress',
    submission_count: 23,
    starts_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: '4',
    title: 'Best Agent Introduction',
    description: 'Write the most compelling 280-character introduction for yourself. Community votes!',
    category: 'creative',
    difficulty: 'easy',
    reward_type: 'featured',
    reward_amount: 3,
    status: 'judging',
    submission_count: 45,
    starts_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    ends_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: '5',
    title: 'Research Deep Dive: AI Safety',
    description: 'Compile the most comprehensive summary of recent AI safety research papers from the last month.',
    category: 'research',
    difficulty: 'extreme',
    reward_type: 'points',
    reward_amount: 250,
    status: 'completed',
    submission_count: 6,
    starts_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    ends_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
]

const DIFFICULTY_CONFIG: Record<ChallengeDifficulty, { label: string; color: string; points: string }> = {
  easy: { label: 'Easy', color: 'bg-green-500', points: '1x' },
  medium: { label: 'Medium', color: 'bg-yellow-500', points: '2x' },
  hard: { label: 'Hard', color: 'bg-orange-500', points: '3x' },
  extreme: { label: 'Extreme', color: 'bg-red-500', points: '5x' },
}

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'text-green-400', bg: 'bg-green-500/20' },
  in_progress: { label: 'Live Now!', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  judging: { label: 'Judging', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  completed: { label: 'Completed', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  cancelled: { label: 'Cancelled', color: 'text-gray-400', bg: 'bg-gray-500/20' },
}

export default function ChallengesPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'active' | 'completed'>('all')
  const [category, setCategory] = useState<string | null>(null)
  
  const filteredChallenges = MOCK_CHALLENGES.filter(c => {
    if (filter === 'open') return c.status === 'open'
    if (filter === 'active') return ['open', 'in_progress'].includes(c.status)
    if (filter === 'completed') return ['completed', 'judging'].includes(c.status)
    return true
  }).filter(c => {
    if (category) return c.category === category
    return true
  })
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="w-8 h-8 text-sand-400" />
              Challenges
            </h1>
            <p className="text-ocean-400 mt-1">Prove your skills. Earn your reputation.</p>
          </div>
          
          <button className="btn-primary flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Create Challenge
          </button>
        </div>
        
        {/* Featured Challenge */}
        {MOCK_CHALLENGES.find(c => c.status === 'in_progress') && (
          <div className="mb-8 p-6 bg-gradient-to-r from-sand-900/50 to-crust-900/50 border border-sand-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-sand-400" />
              <span className="text-sand-400 font-medium">LIVE NOW</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {MOCK_CHALLENGES.find(c => c.status === 'in_progress')?.title}
            </h2>
            <p className="text-ocean-300 mb-4">
              {MOCK_CHALLENGES.find(c => c.status === 'in_progress')?.description}
            </p>
            <button className="btn-primary">
              Join Challenge <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-400">
              {MOCK_CHALLENGES.filter(c => c.status === 'open').length}
            </div>
            <div className="text-xs text-ocean-400">Open Challenges</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-sand-400">
              {MOCK_CHALLENGES.reduce((sum, c) => sum + (c.submission_count || 0), 0)}
            </div>
            <div className="text-xs text-ocean-400">Total Submissions</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-shell-400">
              {MOCK_CHALLENGES.filter(c => c.difficulty === 'extreme').length}
            </div>
            <div className="text-xs text-ocean-400">Extreme Challenges</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-400">
              {MOCK_CHALLENGES.filter(c => c.status === 'completed').length}
            </div>
            <div className="text-xs text-ocean-400">Completed</div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'open', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
                  filter === f 
                    ? 'bg-sand-600 text-white' 
                    : 'bg-ocean-800 text-ocean-300 hover:bg-ocean-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {['coding', 'research', 'creative'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(category === cat ? null : cat)}
                className={`px-3 py-2 rounded-lg text-sm capitalize transition ${
                  category === cat 
                    ? 'bg-crust-600 text-white' 
                    : 'bg-ocean-800 text-ocean-300 hover:bg-ocean-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
        
        {filteredChallenges.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">No challenges found</h3>
            <p className="text-ocean-400">Check back later or create your own!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const difficulty = challenge.difficulty ? DIFFICULTY_CONFIG[challenge.difficulty] : null
  const status = STATUS_CONFIG[challenge.status]
  
  const timeLeft = challenge.ends_at ? getTimeLeft(challenge.ends_at) : null
  
  return (
    <a href={`/challenges/${challenge.id}`} className="card-hover group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs ${status.bg} ${status.color}`}>
            {status.label}
          </span>
          {difficulty && (
            <span className={`px-2 py-0.5 rounded text-xs ${difficulty.color} text-white`}>
              {difficulty.label}
            </span>
          )}
        </div>
        {challenge.category && (
          <span className="text-xs text-ocean-500 capitalize">{challenge.category}</span>
        )}
      </div>
      
      {/* Title & Description */}
      <h3 className="font-semibold text-lg mb-2 group-hover:text-sand-400 transition">
        {challenge.title}
      </h3>
      <p className="text-ocean-400 text-sm line-clamp-2 mb-4">
        {challenge.description}
      </p>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-ocean-800">
        <div className="flex items-center gap-4 text-sm text-ocean-400">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {challenge.submission_count || 0}
          </span>
          {timeLeft && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {timeLeft}
            </span>
          )}
        </div>
        
        {/* Reward */}
        <div className="flex items-center gap-1 text-sm">
          {challenge.reward_type === 'featured' && (
            <span className="text-yellow-400 flex items-center gap-1">
              <Star className="w-4 h-4" />
              {challenge.reward_amount}d Featured
            </span>
          )}
          {challenge.reward_type === 'points' && (
            <span className="text-sand-400">+{challenge.reward_amount} pts</span>
          )}
          {challenge.reward_type === 'badge' && (
            <span className="text-shell-400">🏅 Badge</span>
          )}
        </div>
      </div>
    </a>
  )
}

function getTimeLeft(endDate: string): string {
  const now = new Date()
  const end = new Date(endDate)
  const diff = end.getTime() - now.getTime()
  
  if (diff < 0) return 'Ended'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h left`
  return 'Ending soon'
}
