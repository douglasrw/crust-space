'use client'

import { Achievement, AgentAchievement, ACHIEVEMENTS } from '@/lib/types-v2'

interface AchievementsDisplayProps {
  earned: AgentAchievement[]
  showAll?: boolean
}

export function AchievementsDisplay({ earned, showAll = false }: AchievementsDisplayProps) {
  const earnedSlugs = new Set(earned.map(a => a.achievement_slug))
  
  const displayAchievements = showAll 
    ? ACHIEVEMENTS 
    : ACHIEVEMENTS.filter(a => earnedSlugs.has(a.slug))
  
  if (displayAchievements.length === 0) {
    return (
      <div className="text-center py-6 text-ocean-500">
        <div className="text-3xl mb-2">🏅</div>
        <p>No achievements yet</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {displayAchievements.map((achievement) => {
        const isEarned = earnedSlugs.has(achievement.slug)
        const earnedData = earned.find(a => a.achievement_slug === achievement.slug)
        
        return (
          <AchievementBadge 
            key={achievement.slug} 
            achievement={achievement} 
            earned={isEarned}
            earnedAt={earnedData?.earned_at}
          />
        )
      })}
    </div>
  )
}

interface AchievementBadgeProps {
  achievement: Achievement
  earned: boolean
  earnedAt?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AchievementBadge({ achievement, earned, earnedAt, size = 'md' }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
  }
  
  return (
    <div 
      className="group relative flex flex-col items-center"
      title={`${achievement.name}: ${achievement.description}`}
    >
      <div className={`
        ${sizeClasses[size]} rounded-xl flex items-center justify-center transition
        ${earned 
          ? 'bg-gradient-to-br from-sand-500/30 to-crust-500/30 border border-sand-500/50 shadow-lg shadow-sand-500/20' 
          : 'bg-ocean-800/30 border border-ocean-700/50 opacity-40 grayscale'
        }
      `}>
        {achievement.emoji}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-ocean-900 border border-ocean-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 w-48 text-center">
        <div className="font-medium text-sm">{achievement.name}</div>
        <div className="text-xs text-ocean-400 mt-1">{achievement.description}</div>
        {earned && earnedAt && (
          <div className="text-xs text-crust-400 mt-2">
            Earned {new Date(earnedAt).toLocaleDateString()}
          </div>
        )}
        {!earned && (
          <div className="text-xs text-ocean-500 mt-2">Not yet earned</div>
        )}
        <div className="text-xs text-sand-500 mt-1">+{achievement.points} pts</div>
      </div>
    </div>
  )
}

// Compact row for profile
export function AchievementsRow({ earned }: { earned: AgentAchievement[] }) {
  const earnedAchievements = ACHIEVEMENTS.filter(a => 
    earned.some(e => e.achievement_slug === a.slug)
  ).slice(0, 8)
  
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0)
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-ocean-400">Achievements</span>
        <span className="text-sm text-sand-500">{totalPoints} pts</span>
      </div>
      <div className="flex gap-1 flex-wrap">
        {earnedAchievements.map((achievement) => (
          <span 
            key={achievement.slug} 
            className="text-xl" 
            title={achievement.name}
          >
            {achievement.emoji}
          </span>
        ))}
        {earned.length > 8 && (
          <span className="text-sm text-ocean-500">+{earned.length - 8}</span>
        )}
      </div>
    </div>
  )
}
