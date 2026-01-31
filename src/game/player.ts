/**
 * Player Management
 * Player movement and physics
 */

import { gameState } from '../core/state'
import { checkRoadBounds } from './collision'
import { CONFIG, BOOST_CONFIG } from '../core/constants'

export function updatePlayer(deltaTime: number): void {
  const input = gameState.getInput()
  const player = gameState.getPlayer()
  const { width, height } = gameState.getRoadDimensions()
  const state = gameState.getState()

  // Calculate speed based on boost and slow-mo
  let speed = player.speed
  if (player.boostActive) {
    speed *= 1.5

    // V3: Consume boost energy while active
    const drainAmount = BOOST_CONFIG.drainRate * (deltaTime / 1000)
    gameState.consumeBoostEnergy(drainAmount)

    // Deactivate if energy runs out
    if (gameState.getBoostEnergy() <= 0) {
      gameState.setPlayerBoost(false)
    }
  } else {
    // Regenerate boost energy when not boosting
    const regenAmount = BOOST_CONFIG.regenRate * (deltaTime / 1000)
    gameState.regenerateBoostEnergy(regenAmount)
  }

  if (state.slowMoActive) {
    speed *= 0.5
  }

  // Movement with smooth acceleration
  let dx = 0
  let dy = 0

  if (input.left) dx -= speed
  if (input.right) dx += speed
  if (input.up) dy -= speed
  if (input.down) dy += speed

  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    dx *= 0.707 // 1 / sqrt(2)
    dy *= 0.707
  }

  // V3: Add subtle organic wobble when moving
  // This creates human-like imperfection - not perfectly robotic movement
  const wobbleAmount = 0.3
  const wobbleX = (Math.random() - 0.5) * wobbleAmount * (dx !== 0 ? 1 : 0)
  const wobbleY = (Math.random() - 0.5) * wobbleAmount * (dy !== 0 ? 1 : 0)

  // Apply movement
  let newX = player.x + dx + wobbleX
  let newY = player.y + dy + wobbleY

  // Clamp to road bounds
  newX = Math.max(0, Math.min(newX, width - player.width))
  newY = Math.max(0, Math.min(newY, height - player.height))

  gameState.setPlayerPosition(newX, newY)

  // V3: Handle boost input with energy check
  if (input.boost && !player.boostActive) {
    if (gameState.canActivateBoost()) {
      gameState.setPlayerBoost(true)
    }
  } else if (!input.boost && player.boostActive) {
    // Allow manual boost deactivation
    gameState.setPlayerBoost(false)
  }
}

/**
 * Initialize player at starting position
 */
export function initializePlayer(roadWidth: number, roadHeight: number): void {
  const x = roadWidth / 2 - 25
  const y = roadHeight - 150
  gameState.setPlayerPosition(x, y)
}

/**
 * Get player lane (0-3 for 4-lane road)
 */
export function getPlayerLane(): number {
  const player = gameState.getPlayer()
  const { width } = gameState.getRoadDimensions()
  const laneWidth = width / CONFIG.laneCount

  return Math.floor((player.x + player.width / 2) / laneWidth)
}
