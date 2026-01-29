/**
 * Road Management
 * Road lines animation and rendering state
 */

import type { RoadLine } from '../types/game'
import { gameState } from '../core/state'
import { CONFIG } from '../core/constants'

/**
 * Initialize road lines
 */
export function initializeRoadLines(): void {
  const { height } = gameState.getRoadDimensions()
  const lines: RoadLine[] = []

  for (let i = 0; i < 10; i++) {
    lines.push({
      y: i * 100,
      height: 50,
    })
  }

  gameState.setRoadLines(lines)
}

/**
 * Update road lines animation
 */
export function updateRoadLines(speed: number): void {
  const lines = gameState.getRoadLines()
  const { height } = gameState.getRoadDimensions()

  const updatedLines = lines.map(line => {
    let newY = line.y + speed

    // Reset line when it goes off screen
    if (newY > height) {
      newY = -line.height
    }

    return { ...line, y: newY }
  })

  gameState.setRoadLines(updatedLines)
}

/**
 * Get lane X positions for rendering
 */
export function getLanePositions(): number[] {
  const { width } = gameState.getRoadDimensions()
  const laneWidth = width / CONFIG.laneCount

  return Array.from({ length: CONFIG.laneCount }, (_, i) =>
    i * laneWidth + laneWidth / 2
  )
}
