/**
 * Achievement System
 * Tracks and unlocks achievements based on gameplay
 */

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
  progress: number
  maxProgress: number
  hidden: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface AchievementCondition {
  type: 'score' | 'distance' | 'speed' | 'combo' | 'time' | 'kills' | 'custom'
  target: number
  current: number
}

export class AchievementSystem {
  private achievements: Map<string, Achievement>
  private listeners: Set<(achievement: Achievement) => void> = new Set()

  constructor() {
    this.achievements = new Map()
    this.initializeAchievements()
    this.loadProgress()
  }

  private initializeAchievements(): void {
    // Speed achievements
    this.registerAchievement({
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Reach 200 km/h',
      icon: '⚡',
      unlocked: false,
      progress: 0,
      maxProgress: 200,
      hidden: false,
      rarity: 'common'
    })

    this.registerAchievement({
      id: 'hypersonic',
      name: 'Hypersonic',
      description: 'Reach 400 km/h with nitro',
      icon: '🚀',
      unlocked: false,
      progress: 0,
      maxProgress: 400,
      hidden: false,
      rarity: 'rare'
    })

    // Distance achievements
    this.registerAchievement({
      id: 'marathon',
      name: 'Marathon Racer',
      description: 'Travel 10 km total',
      icon: '🏃',
      unlocked: false,
      progress: 0,
      maxProgress: 10000,
      hidden: false,
      rarity: 'common'
    })

    this.registerAchievement({
      id: 'world_traveler',
      name: 'World Traveler',
      description: 'Travel 100 km total',
      icon: '🌍',
      unlocked: false,
      progress: 0,
      maxProgress: 100000,
      hidden: false,
      rarity: 'epic'
    })

    // Score achievements
    this.registerAchievement({
      id: 'high_score',
      name: 'High Score',
      description: 'Score 10,000 points',
      icon: '🏆',
      unlocked: false,
      progress: 0,
      maxProgress: 10000,
      hidden: false,
      rarity: 'common'
    })

    this.registerAchievement({
      id: 'millionaire',
      name: 'Millionaire',
      description: 'Score 1,000,000 points',
      icon: '💎',
      unlocked: false,
      progress: 0,
      maxProgress: 1000000,
      hidden: false,
      rarity: 'legendary'
    })

    // Combo achievements
    this.registerAchievement({
      id: 'combo_master',
      name: 'Combo Master',
      description: 'Achieve a 10x combo',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      hidden: false,
      rarity: 'rare'
    })

    this.registerAchievement({
      id: 'unstoppable',
      name: 'Unstoppable',
      description: 'Achieve a 25x combo',
      icon: '💥',
      unlocked: false,
      progress: 0,
      maxProgress: 25,
      hidden: false,
      rarity: 'epic'
    })

    // Survival achievements
    this.registerAchievement({
      id: 'survivor',
      name: 'Survivor',
      description: 'Play for 5 minutes',
      icon: '⏱️',
      unlocked: false,
      progress: 0,
      maxProgress: 300,
      hidden: false,
      rarity: 'common'
    })

    this.registerAchievement({
      id: 'endurance',
      name: 'Endurance King',
      description: 'Play for 30 minutes',
      icon: '👑',
      unlocked: false,
      progress: 0,
      maxProgress: 1800,
      hidden: false,
      rarity: 'rare'
    })

    // Special achievements
    this.registerAchievement({
      id: 'first_blood',
      name: 'First Blood',
      description: 'Destroy your first enemy',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      hidden: false,
      rarity: 'common'
    })

    this.registerAchievement({
      id: 'perfect_run',
      name: 'Perfect Run',
      description: 'Complete a run without taking damage',
      icon: '⭐',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      hidden: false,
      rarity: 'epic'
    })

    this.registerAchievement({
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Play during night time for 10 minutes',
      icon: '🦉',
      unlocked: false,
      progress: 0,
      maxProgress: 600,
      hidden: true,
      rarity: 'rare'
    })

    this.registerAchievement({
      id: 'nitro_master',
      name: 'Nitro Master',
      description: 'Use nitro 50 times',
      icon: '💨',
      unlocked: false,
      progress: 0,
      maxProgress: 50,
      hidden: false,
      rarity: 'common'
    })

    this.registerAchievement({
      id: 'collector',
      name: 'Collector',
      description: 'Collect 100 power-ups',
      icon: '🎁',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
      hidden: false,
      rarity: 'common'
    })

    this.registerAchievement({
      id: 'ghost_buster',
      name: 'Ghost Buster',
      description: 'Beat 10 ghost recordings',
      icon: '👻',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      hidden: true,
      rarity: 'rare'
    })
  }

  registerAchievement(achievement: Achievement): void {
    this.achievements.set(achievement.id, achievement)
  }

  updateProgress(id: string, value: number): void {
    const achievement = this.achievements.get(id)
    if (!achievement || achievement.unlocked) return

    achievement.progress = Math.min(achievement.maxProgress, value)

    if (achievement.progress >= achievement.maxProgress) {
      this.unlock(id)
    }

    this.saveProgress()
  }

  incrementProgress(id: string, amount: number = 1): void {
    const achievement = this.achievements.get(id)
    if (!achievement || achievement.unlocked) return

    achievement.progress = Math.min(
      achievement.maxProgress,
      achievement.progress + amount
    )

    if (achievement.progress >= achievement.maxProgress) {
      this.unlock(id)
    }

    this.saveProgress()
  }

  unlock(id: string): boolean {
    const achievement = this.achievements.get(id)
    if (!achievement || achievement.unlocked) return false

    achievement.unlocked = true
    achievement.unlockedAt = Date.now()

    // Notify listeners
    this.listeners.forEach(listener => listener(achievement))

    this.saveProgress()
    return true
  }

  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id)
  }

  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values())
  }

  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.unlocked)
  }

  getLockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => !a.unlocked)
  }

  getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
    return this.getAllAchievements().filter(a => a.rarity === rarity)
  }

  getUnlockedCount(): number {
    return this.getUnlockedAchievements().length
  }

  getTotalCount(): number {
    return this.achievements.size
  }

  getCompletionPercentage(): number {
    return (this.getUnlockedCount() / this.getTotalCount()) * 100
  }

  onUnlock(callback: (achievement: Achievement) => void): void {
    this.listeners.add(callback)
  }

  removeListener(callback: (achievement: Achievement) => void): void {
    this.listeners.delete(callback)
  }

  private saveProgress(): void {
    const data = Array.from(this.achievements.entries()).map(([id, achievement]) => [
      id,
      {
        unlocked: achievement.unlocked,
        unlockedAt: achievement.unlockedAt,
        progress: achievement.progress
      }
    ])

    try {
      localStorage.setItem('neon_highway_achievements', JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save achievements:', e)
    }
  }

  private loadProgress(): void {
    try {
      const saved = localStorage.getItem('neon_highway_achievements')
      if (!saved) return

      const data: Array<[string, {
        unlocked: boolean
        unlockedAt?: number
        progress: number
      }]> = JSON.parse(saved)

      data.forEach(([id, savedAchievement]) => {
        const achievement = this.achievements.get(id)
        if (achievement) {
          achievement.unlocked = savedAchievement.unlocked
          achievement.unlockedAt = savedAchievement.unlockedAt
          achievement.progress = savedAchievement.progress
        }
      })
    } catch (e) {
      console.error('Failed to load achievements:', e)
    }
  }

  reset(): void {
    this.achievements.forEach(achievement => {
      achievement.unlocked = false
      achievement.unlockedAt = undefined
      achievement.progress = 0
    })
    this.saveProgress()
  }

  export(): string {
    const data = Array.from(this.achievements.entries()).map(([id, achievement]) => ({
      id,
      name: achievement.name,
      unlocked: achievement.unlocked,
      unlockedAt: achievement.unlockedAt
    }))
    return JSON.stringify(data, null, 2)
  }
}
