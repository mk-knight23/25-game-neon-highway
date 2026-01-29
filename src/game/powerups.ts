/**
 * Power-up System
 * Spawning and collection logic
 */

import type { PowerUp } from '../types/game'
import { gameState } from '../core/state'
import { CONFIG, POWER_UP_TYPES } from '../core/constants'

/**
 * Generate a unique ID for power-ups
 */
function generateId(): string {
  return `powerup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create a new power-up
 */
export function createPowerUp(y: number = -50): PowerUp {
  const { width } = gameState.getRoadDimensions()
  const laneWidth = width / CONFIG.laneCount

  // Select random lane
  const lane = Math.floor(Math.random() * CONFIG.laneCount)
  const x = lane * laneWidth + (laneWidth - 30) / 2

  // Select random type
  const types = Object.keys(POWER_UP_TYPES) as Array<keyof typeof POWER_UP_TYPES>
  const type = types[Math.floor(Math.random() * types.length)]

  return {
    id: generateId(),
    x,
    y,
    type,
    active: true,
  }
}

/**
 * Update power-up positions
 */
export function updatePowerUps(deltaTime: number): void {
  const powerUps = gameState.getPowerUps()
  const { height: roadHeight } = gameState.getRoadDimensions()
  const state = gameState.getState()

  // Calculate effective speed
  const speedMultiplier = state.slowMoActive ? 0.5 : 1

  const updatedPowerUps: PowerUp[] = []

  for (const powerUp of powerUps) {
    let newY = powerUp.y + state.speed * speedMultiplier

    // Remove power-up if it goes off screen
    if (newY > roadHeight + 100) {
      continue
    }

    updatedPowerUps.push({ ...powerUp, y: newY })
  }

  // Remove inactive power-ups
  gameState.setPowerUps(updatedPowerUps.filter(p => p.active))
}

/**
 * Check if power-up should spawn
 */
export function checkPowerUpSpawn(): void {
  const powerUps = gameState.getPowerUps()
  const level = gameState.getState().level

  // Max power-ups based on level
  const maxPowerUps = Math.min(1 + Math.floor(level / 2), 3)

  if (powerUps.length >= maxPowerUps) return

  // Spawn chance (5% per frame at level 1, increases with level)
  const spawnChance = 0.005 + (level * 0.002)

  if (Math.random() < spawnChance) {
    const powerUp = createPowerUp(-100)
    gameState.addPowerUp(powerUp)
  }
}

/**
 * Initialize power-ups for game start
 */
export function initializePowerUps(): void {
  gameState.setPowerUps([])
}

/**
 * Get power-up color for rendering
 */
export function getPowerUpColor(type: PowerUp['type']): string {
  return POWER_UP_TYPES[type]?.color || '#ffffff'
}

/**
 * Get power-up duration in ms
 */
export function getPowerUpDuration(type: PowerUp['type']): number {
  return POWER_UP_TYPES[type]?.duration || 3000
}

/**
 * Check if power-up exists at position
 */
export function getPowerUpAt(x: number, y: number): PowerUp | null {
  const powerUps = gameState.getPowerUps()

  for (const powerUp of powerUps) {
    if (!powerUp.active) continue

    const dx = Math.abs(powerUp.x - x)
    const dy = Math.abs(powerUp.y - y)

    if (dx < 40 && dy < 40) {
      return powerUp
    }
  }

  return null
}
