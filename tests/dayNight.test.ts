import { describe, test, expect } from 'vitest'
import { tintForPhase } from '../src/game/dayNight'

describe('tintForPhase', () => {
  test('returns valid RGBA channels for any phase', () => {
    for (let p = 0; p <= 1; p += 0.05) {
      const tint = tintForPhase(p)
      expect(tint.r).toBeGreaterThanOrEqual(0)
      expect(tint.r).toBeLessThanOrEqual(255)
      expect(tint.g).toBeGreaterThanOrEqual(0)
      expect(tint.g).toBeLessThanOrEqual(255)
      expect(tint.b).toBeGreaterThanOrEqual(0)
      expect(tint.b).toBeLessThanOrEqual(255)
      expect(tint.a).toBeGreaterThanOrEqual(0)
      expect(tint.a).toBeLessThanOrEqual(1)
    }
  })

  test('normalises out-of-range phases (wraps around)', () => {
    expect(tintForPhase(1.25)).toEqual(tintForPhase(0.25))
    expect(tintForPhase(-0.75)).toEqual(tintForPhase(0.25))
  })

  test('night phase is darker (higher alpha) than day phase', () => {
    const day = tintForPhase(0.25)
    const night = tintForPhase(0.75)
    expect(night.a).toBeGreaterThan(day.a)
  })
})
