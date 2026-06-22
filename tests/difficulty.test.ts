import { describe, test, expect } from 'vitest'
import {
  getDifficultyConfig,
  getLevelRequirement,
  calculateLevel,
  getLevelProgress,
} from '../src/game/difficulty'
import { CONFIG } from '../src/core/constants'

describe('getDifficultyConfig', () => {
  test('level 1 returns base speed and base enemy count', () => {
    const config = getDifficultyConfig(1)
    expect(config.speed).toBe(CONFIG.baseSpeed + 0.5)
    expect(config.enemyCount).toBe(CONFIG.enemyCount)
    expect(config.name).toBe('ROOKIE')
  })

  test('speed increases with level but is capped at +10', () => {
    const low = getDifficultyConfig(2)
    const high = getDifficultyConfig(100)

    expect(low.speed).toBeGreaterThan(getDifficultyConfig(1).speed)
    // Cap: speedIncrease maxes at +10 over base
    expect(high.speed).toBe(CONFIG.baseSpeed + 10)
  })

  test('enemy count increases with level but is capped at +6', () => {
    const high = getDifficultyConfig(100)
    expect(high.enemyCount).toBe(CONFIG.enemyCount + 6)
  })

  test('progression is monotonic and never decreasing in speed', () => {
    let prev = getDifficultyConfig(1).speed
    for (let lvl = 2; lvl <= 30; lvl++) {
      const cur = getDifficultyConfig(lvl).speed
      expect(cur).toBeGreaterThanOrEqual(prev)
      prev = cur
    }
  })

  test('assigns a difficulty name for very high levels', () => {
    expect(getDifficultyConfig(50).name).toBe('GODLIKE')
  })
})

describe('getLevelRequirement / calculateLevel', () => {
  test('level requirements increase strictly with level', () => {
    let prev = getLevelRequirement(1)
    for (let lvl = 2; lvl <= 10; lvl++) {
      const cur = getLevelRequirement(lvl)
      expect(cur).toBeGreaterThan(prev)
      prev = cur
    }
  })

  test('a score of 0 is always at least level 1', () => {
    expect(calculateLevel(0)).toBeGreaterThanOrEqual(1)
  })

  test('higher scores never produce a lower level', () => {
    let prev = calculateLevel(0)
    for (let score = 0; score <= 20000; score += 500) {
      const cur = calculateLevel(score)
      expect(cur).toBeGreaterThanOrEqual(prev)
      prev = cur
    }
  })
})

describe('getLevelProgress', () => {
  test('returns a value clamped between 0 and 1', () => {
    const progress = getLevelProgress()
    expect(progress).toBeGreaterThanOrEqual(0)
    expect(progress).toBeLessThanOrEqual(1)
  })
})
