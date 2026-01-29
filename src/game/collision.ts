/**
 * Collision Detection
 * AABB collision and response
 * V2: Integrated combo system for skill ceiling
 */

import type { Rect } from '../types/game'
import { gameState } from '../core/state'
import { comboSystem } from './comboSystem'

/**
 * AABB (Axis-Aligned Bounding Box) collision detection
 */
export function checkCollision(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  )
}

/**
 * Check if player collides with any enemy
 */
export function checkPlayerEnemyCollision(): boolean {
  const player = gameState.getPlayer()
  const enemies = gameState.getEnemies()
  const state = gameState.getState()

  // Shield protects from collision
  if (state.shieldActive) return false

  const playerRect: Rect = {
    x: player.x + 5, // Tighten hitbox slightly
    y: player.y + 5,
    width: player.width - 10,
    height: player.height - 10,
  }

  for (const enemy of enemies) {
    const enemyRect: Rect = {
      x: enemy.x + 3,
      y: enemy.y + 3,
      width: enemy.width - 6,
      height: enemy.height - 6,
    }

    if (checkCollision(playerRect, enemyRect)) {
      return true
    }
  }

  return false
}

/**
 * Check if player collects a power-up
 */
export function checkPowerUpCollision(): { type: string; id: string } | null {
  const player = gameState.getPlayer()
  const powerUps = gameState.getPowerUps()

  const playerRect: Rect = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
  }

  for (const powerUp of powerUps) {
    if (!powerUp.active) continue

    const powerUpRect: Rect = {
      x: powerUp.x,
      y: powerUp.y,
      width: 30,
      height: 30,
    }

    if (checkCollision(playerRect, powerUpRect)) {
      return { type: powerUp.type, id: powerUp.id }
    }
  }

  return null
}

/**
 * Check if point is inside a rect (for click/touch detection)
 */
export function checkPointInRect(x: number, y: number, rect: Rect): boolean {
  return x >= rect.x && x <= rect.x + rect.width &&
         y >= rect.y && y <= rect.y + rect.height
}

/**
 * Check for close calls with enemies (for combo system)
 * Returns points earned from close calls
 */
export function checkCloseCalls(): number {
  const player = gameState.getPlayer()
  const enemies = gameState.getEnemies()
  const state = gameState.getState()

  // No close calls in zen mode
  if (state.mode === 'zen') return 0

  let totalPoints = 0

  for (const enemy of enemies) {
    // Skip if enemy is above player (already passed)
    if (enemy.y + enemy.height < player.y) continue

    // Check for close call
    const points = comboSystem.checkCloseCall(
      player.x,
      player.y,
      player.width,
      player.height,
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height
    )

    totalPoints += points
  }

  return totalPoints
}

/**
 * Check if player is within road bounds
 */
export function checkRoadBounds(
  x: number,
  y: number,
  roadWidth: number,
  roadHeight: number
): boolean {
  const { width, height } = gameState.getPlayer()

  return (
    x >= 0 &&
    x + width <= roadWidth &&
    y >= 0 &&
    y + height <= roadHeight
  )
}
