/**
 * Projectile System
 * Shooter enemy projectiles that damage the player
 */

import type { Projectile } from '../types/game'
import { gameState } from '../core/state'
import { COLORS } from '../core/constants'

const PROJECTILE_SPEED = 12
const PROJECTILE_SIZE = 8
const PROJECTILE_COLOR = COLORS.neonPink
const SHOOT_COOLDOWN = 2000 // ms between shots

// Track last shot time for each shooter
const shooterLastShot = new Map<string, number>()

/**
 * Generate a unique ID for projectiles
 */
function generateId(): string {
  return `projectile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create a new projectile from a shooter enemy
 */
export function createProjectile(enemyX: number, enemyY: number, enemyWidth: number, enemyId: string): Projectile {
  return {
    id: generateId(),
    x: enemyX + enemyWidth / 2 - PROJECTILE_SIZE / 2,
    y: enemyY + 80, // Start from bottom of enemy
    width: PROJECTILE_SIZE,
    height: PROJECTILE_SIZE * 2,
    speed: PROJECTILE_SPEED,
    color: PROJECTILE_COLOR,
    ownerId: enemyId,
  }
}

/**
 * Check if a shooter enemy can fire (cooldown check)
 */
export function canShooterFire(enemyId: string): boolean {
  const now = Date.now()
  const lastShot = shooterLastShot.get(enemyId) || 0
  return now - lastShot >= SHOOT_COOLDOWN
}

/**
 * Mark a shooter as having fired
 */
export function markShooterFired(enemyId: string): void {
  shooterLastShot.set(enemyId, Date.now())
}

/**
 * Update projectile positions
 */
export function updateProjectiles(deltaTime: number): void {
  const projectiles = gameState.getProjectiles()
  const { height: roadHeight } = gameState.getRoadDimensions()
  const state = gameState.getState()

  // Calculate effective speed
  const speedMultiplier = state.slowMoActive ? 0.5 : 1

  const updatedProjectiles: Projectile[] = []

  for (const projectile of projectiles) {
    let newY = projectile.y + projectile.speed * speedMultiplier

    // Remove projectile if it goes off screen
    if (newY > roadHeight + 100) {
      continue
    }

    updatedProjectiles.push({ ...projectile, y: newY })
  }

  gameState.setProjectiles(updatedProjectiles)
}

/**
 * Clear all projectile cooldowns (called on game reset)
 */
export function clearCooldowns(): void {
  shooterLastShot.clear()
}

/**
 * Initialize projectiles for game start
 */
export function initializeProjectiles(): void {
  gameState.setProjectiles([])
  clearCooldowns()
}
