import { describe, test, expect } from 'vitest'
import {
  applyComboMultiplier,
  distanceForStep,
  nextSpeedThreshold,
  levelForScore,
  SPEED_THRESHOLD_STEP,
} from '../src/game/scoring'

describe('applyComboMultiplier', () => {
  test('multiplies base points and floors the result', () => {
    expect(applyComboMultiplier(10, 1.5)).toBe(15)
    expect(applyComboMultiplier(3, 2.3)).toBe(6) // floor(6.9)
  })

  test('treats a non-positive multiplier as 1x', () => {
    expect(applyComboMultiplier(10, 0)).toBe(10)
    expect(applyComboMultiplier(10, -5)).toBe(10)
  })

  test('never returns negative points', () => {
    expect(applyComboMultiplier(-5, 2)).toBe(0)
  })
})

describe('distanceForStep', () => {
  test('computes speed * seconds', () => {
    // 10 units/s over 1000ms = 10 units
    expect(distanceForStep(10, 1000)).toBe(10)
    // 5 units/s over 500ms = 2.5 units
    expect(distanceForStep(5, 500)).toBeCloseTo(2.5)
  })

  test('returns 0 for non-positive speed or delta', () => {
    expect(distanceForStep(0, 1000)).toBe(0)
    expect(distanceForStep(10, 0)).toBe(0)
    expect(distanceForStep(-3, 1000)).toBe(0)
  })
})

describe('nextSpeedThreshold', () => {
  test('returns the next threshold when score has crossed it', () => {
    expect(nextSpeedThreshold(SPEED_THRESHOLD_STEP, 0)).toBe(SPEED_THRESHOLD_STEP)
    expect(nextSpeedThreshold(1200, 500)).toBe(1000)
  })

  test('returns null when the next threshold has not been reached', () => {
    expect(nextSpeedThreshold(400, 0)).toBeNull()
    expect(nextSpeedThreshold(900, 500)).toBeNull()
  })
})

describe('levelForScore', () => {
  test('starts at level 1 for low scores', () => {
    expect(levelForScore(0)).toBe(1)
    expect(levelForScore(999)).toBe(1)
  })

  test('crosses to level 2 at 1000 points', () => {
    expect(levelForScore(1000)).toBe(2)
  })

  test('reaches level 6 at the top threshold (1000 * 5^2)', () => {
    expect(levelForScore(25000)).toBe(6)
    expect(levelForScore(1_000_000)).toBe(6)
  })

  test('is monotonically non-decreasing', () => {
    let prev = levelForScore(0)
    for (let s = 0; s <= 30000; s += 250) {
      const cur = levelForScore(s)
      expect(cur).toBeGreaterThanOrEqual(prev)
      prev = cur
    }
  })
})
