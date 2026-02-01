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
const WARNING_TIME = 800 // ms before shot to show warning

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
 * Check if a shooter is about to fire (for warning indicator)
 * Returns progress 0-1 where 1 means about to fire
 */
export function getShooterChargeProgress(enemyId: string): number {
  const now = Date.now()
  const lastShot = shooterLastShot.get(enemyId) || 0
  const timeSinceShot = now - lastShot
  const timeUntilFire = SHOOT_COOLDOWN - timeSinceShot

  if (timeUntilFire < WARNING_TIME && timeUntilFire > 0) {
    return 1 - (timeUntilFire / WARNING_TIME)
  }
  return 0
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
  const player = gameState.getPlayer()

  // Calculate effective speed
  const speedMultiplier = state.slowMoActive ? 0.5 : 1

  const updatedProjectiles: Projectile[] = []
  let createdNearMissEffect = false

  for (const projectile of projectiles) {
    let newY = projectile.y + projectile.speed * speedMultiplier

    // Remove projectile if it goes off screen
    if (newY > roadHeight + 100) {
      continue
    }

    // Check for near-miss effect (projectile passes close to player)
    if (!createdNearMissEffect && !state.shieldActive) {
      const dx = Math.abs((projectile.x + projectile.width / 2) - (player.x + player.width / 2))
      const dy = Math.abs(projectile.y - player.y)
      if (dy < 30 && dx < 60 && dx > 20) {
        // Near miss - create sparkle effect
        const { createSparkle } = require('./particles')
        for (let i = 0; i < 5; i++) {
          createSparkle(
            projectile.x + projectile.width / 2 + (Math.random() - 0.5) * 30,
            projectile.y + (Math.random() - 0.5) * 30
          )
        }
        createdNearMissEffect = true
      }
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
