import { describe, test, expect } from 'vitest'
import { checkCollision, checkPointInRect } from '../src/game/collision'
import type { Rect } from '../src/types/game'

const rect = (x: number, y: number, width: number, height: number): Rect => ({ x, y, width, height })

describe('checkCollision (AABB)', () => {
  test('returns true when two rects overlap', () => {
    // Arrange
    const a = rect(0, 0, 10, 10)
    const b = rect(5, 5, 10, 10)

    // Act / Assert
    expect(checkCollision(a, b)).toBe(true)
  })

  test('returns true when one rect is fully inside the other', () => {
    const outer = rect(0, 0, 100, 100)
    const inner = rect(40, 40, 10, 10)

    expect(checkCollision(outer, inner)).toBe(true)
    expect(checkCollision(inner, outer)).toBe(true)
  })

  test('returns false when rects are separated horizontally', () => {
    const a = rect(0, 0, 10, 10)
    const b = rect(20, 0, 10, 10)

    expect(checkCollision(a, b)).toBe(false)
  })

  test('returns false when rects are separated vertically', () => {
    const a = rect(0, 0, 10, 10)
    const b = rect(0, 50, 10, 10)

    expect(checkCollision(a, b)).toBe(false)
  })

  test('treats edge-touching rects as colliding', () => {
    // a right edge at x=10, b left edge at x=10
    const a = rect(0, 0, 10, 10)
    const b = rect(10, 0, 10, 10)

    expect(checkCollision(a, b)).toBe(true)
  })

  test('is symmetric for any pair of rects', () => {
    const a = rect(3, 4, 12, 8)
    const b = rect(10, 6, 5, 5)

    expect(checkCollision(a, b)).toBe(checkCollision(b, a))
  })
})

describe('checkPointInRect', () => {
  test('returns true for a point inside the rect', () => {
    expect(checkPointInRect(5, 5, rect(0, 0, 10, 10))).toBe(true)
  })

  test('returns true for a point on the boundary', () => {
    expect(checkPointInRect(0, 0, rect(0, 0, 10, 10))).toBe(true)
    expect(checkPointInRect(10, 10, rect(0, 0, 10, 10))).toBe(true)
  })

  test('returns false for a point outside the rect', () => {
    expect(checkPointInRect(11, 5, rect(0, 0, 10, 10))).toBe(false)
    expect(checkPointInRect(-1, 5, rect(0, 0, 10, 10))).toBe(false)
  })
})
