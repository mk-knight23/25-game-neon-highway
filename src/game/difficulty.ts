/**
 * Difficulty Manager
 * Progressive difficulty scaling
 */

import { gameState } from '../core/state'
import { CONFIG } from '../core/constants'

export interface DifficultyConfig {
  level: number
  speed: number
  enemyCount: number
  spawnRate: number
  powerUpRate: number
  name: string
}

/**
 * Get difficulty configuration for a given level
 */
export function getDifficultyConfig(level: number): DifficultyConfig {
  // Base difficulty
  const baseSpeed = CONFIG.baseSpeed
  const baseEnemies = CONFIG.enemyCount

  // Progressive scaling
  const speedIncrease = Math.min(level * 0.5, 10) // Max +10 speed
  const enemyIncrease = Math.min(Math.floor(level / 2), 6) // Max +6 enemies

  // Spawn rates (lower = more frequent)
  const spawnRate = Math.max(0.002 - level * 0.0003, 0.0005) // Power-up spawn rate
  const powerUpRate = Math.max(0.005 - level * 0.0005, 0.001) // Enemy spawn bonus

  // Level names
  const names = [
    'ROOKIE',
    'BEGINNER',
    'NOVICE',
    'APPRENTICE',
    'DRIVER',
    'EXPERIENCED',
    'SKILLED',
    'EXPERT',
    'MASTER',
    'ELITE',
    'LEGEND',
    'CHAMPION',
    'HALL OF FAME',
    'UNTOUCHABLE',
    'GODLIKE',
  ]

  const nameIndex = Math.min(level - 1, names.length - 1)

  return {
    level,
    speed: baseSpeed + speedIncrease,
    enemyCount: baseEnemies + enemyIncrease,
    spawnRate,
    powerUpRate: spawnRate,
    name: names[nameIndex] || 'INSANE',
  }
}

/**
 * Get level requirement (score needed for next level)
 */
export function getLevelRequirement(level: number): number {
  // Exponential scaling: 500, 1500, 3000, 5500, 9500...
  return 500 * level + 250 * level * (level - 1) / 2
}

/**
 * Calculate level from score
 */
export function calculateLevel(score: number): number {
  let level = 1
  let requirement = 0

  while (score >= requirement) {
    level++
    requirement = getLevelRequirement(level)
  }

  return Math.max(1, level - 1)
}

/**
 * Update difficulty based on current level
 */
export function updateDifficulty(): void {
  const state = gameState.getState()
  const config = getDifficultyConfig(state.level)

  // Update game speed (gradual increase)
  if (state.speed < config.speed) {
    gameState.setSpeed(state.speed + 0.01)
  }

  // Enemy count is handled by the enemy manager
}

/**
 * Get difficulty description
 */
export function getDifficultyDescription(level: number): string {
  const config = getDifficultyConfig(level)

  if (level <= 3) {
    return `Speed: ${config.speed.toFixed(1)} | Learn the basics`
  } else if (level <= 7) {
    return `Speed: ${config.speed.toFixed(1)} | Things are heating up!`
  } else if (level <= 12) {
    return `Speed: ${config.speed.toFixed(1)} | Only skilled drivers survive`
  } else {
    return `Speed: ${config.speed.toFixed(1)} | You're playing with fire now!`
  }
}

/**
 * Get next level progress (0-1)
 */
export function getLevelProgress(): number {
  const state = gameState.getState()
  const currentLevelReq = getLevelRequirement(state.level)
  const nextLevelReq = getLevelRequirement(state.level + 1)
  const progress = (state.score - currentLevelReq) / (nextLevelReq - currentLevelReq)

  return Math.max(0, Math.min(1, progress))
}
