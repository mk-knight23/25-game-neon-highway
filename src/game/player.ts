/**
 * Player Management
 * Player movement and physics
 */

import { gameState } from '../core/state'
import { checkRoadBounds } from './collision'
import { CONFIG } from '../core/constants'

export function updatePlayer(deltaTime: number): void {
  const input = gameState.getInput()
  const player = gameState.getPlayer()
  const { width, height } = gameState.getRoadDimensions()
  const state = gameState.getState()

  // Calculate speed based on boost and slow-mo
  let speed = player.speed
  if (player.boostActive) {
    speed *= 1.5
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

  // Apply movement
  let newX = player.x + dx
  let newY = player.y + dy

  // Clamp to road bounds
  newX = Math.max(0, Math.min(newX, width - player.width))
  newY = Math.max(0, Math.min(newY, height - player.height))

  gameState.setPlayerPosition(newX, newY)

  // Handle boost input
  if (input.boost && !player.boostActive) {
    gameState.setPlayerBoost(true)
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
