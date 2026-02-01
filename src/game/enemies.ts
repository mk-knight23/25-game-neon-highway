/**
 * Enemy Management
 * Enemy spawning, movement, and AI
 */

import type { Enemy } from '../types/game'
import { gameState } from '../core/state'
import { CONFIG, ENEMY_COLORS } from '../core/constants'
import { createProjectile, canShooterFire, markShooterFired } from './projectiles'
import { visualEffects, EFFECTS } from '../visual/effects'
import { createSparkle } from './particles'

const ENEMY_TYPES = ['normal', 'fast', 'tank', 'zigzag', 'shooter'] as const

/**
 * Generate a unique ID for enemies
 */
function generateId(): string {
  return `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get enemy type weights based on level
 */
function getEnemyTypeWeights(level: number): Record<Enemy['type'], number> {
  return {
    normal: Math.max(30 - level * 2, 10),
    fast: Math.min(10 + level * 3, 30),
    tank: Math.min(5 + level * 2, 20),
    zigzag: level >= 4 ? Math.min(5 + level, 25) : 0,
    shooter: level >= 6 ? Math.min(3 + level, 15) : 0,
  }
}

/**
 * Select enemy type based on weights
 */
function selectEnemyType(level: number): Enemy['type'] {
  const weights = getEnemyTypeWeights(level)
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight

  for (const [type, weight] of Object.entries(weights)) {
    random -= weight
    if (random <= 0) {
      return type as Enemy['type']
    }
  }

  return 'normal'
}

/**
 * Create a new enemy at the given position
 */
export function createEnemy(y: number = -100): Enemy {
  const { width } = gameState.getRoadDimensions()
  const laneWidth = width / CONFIG.laneCount

  // Select random lane
  const lane = Math.floor(Math.random() * CONFIG.laneCount)
  const x = lane * laneWidth + (laneWidth - 50) / 2

  // Determine enemy type based on level
  const level = gameState.getState().level
  const type = selectEnemyType(level)

  // Set properties based on type
  const baseSpeed = gameState.getState().speed
  let speed = baseSpeed * 0.8
  let color: string = ENEMY_COLORS.normal
  let height = 80
  let enemyWidth = 50

  switch (type) {
    case 'fast':
      speed = baseSpeed * 1.5
      color = ENEMY_COLORS.fast as string
      height = 60
      enemyWidth = 45
      break
    case 'tank':
      speed = baseSpeed * 0.5
      color = ENEMY_COLORS.tank as string
      height = 120
      enemyWidth = 55
      break
    case 'zigzag':
      speed = baseSpeed * 1.1
      color = '#ff6600'
      height = 70
      enemyWidth = 45
      break
    case 'shooter':
      speed = baseSpeed * 0.7
      color = '#ff0066'
      height = 75
      enemyWidth = 50
      break
  }

  return {
    id: generateId(),
    x,
    y,
    width: enemyWidth,
    height,
    speed,
    color,
    type,
    spawnTime: Date.now(), // V3: Track spawn for hesitation
  }
}

/**
 * Update enemy positions and behaviors
 * V3: Added hesitation effect for human-like imperfection
 */
export function updateEnemies(deltaTime: number): void {
  const enemies = gameState.getEnemies()
  const { height: roadHeight, width: roadWidth } = gameState.getRoadDimensions()
  const state = gameState.getState()
  const time = Date.now() / 1000

  // Calculate effective speed (slow-mo affects enemies too)
  const speedMultiplier = state.slowMoActive ? 0.5 : 1

  const updatedEnemies: Enemy[] = []

  for (const enemy of enemies) {
    let newX = enemy.x
    let newY = enemy.y

    // V3: Human-like hesitation - enemies below y=0 have a "reaction time"
    if (enemy.y < 0) {
      const age = Date.now() - enemy.spawnTime
      const hesitationTime = 200 + parseInt(enemy.id.slice(-3), 36) % 300 // 200-500ms random hesitation
      const hesitationFactor = age < hesitationTime ? 0.2 + 0.8 * (age / hesitationTime) : 1
      newY = enemy.y + enemy.speed * speedMultiplier * hesitationFactor
    } else {
      newY = enemy.y + enemy.speed * speedMultiplier
    }

    // Apply enemy-specific behaviors
    if (enemy.type === 'zigzag') {
      // Zigzag movement
      const zigzagAmplitude = 40
      const zigzagFrequency = 3
      const offsetX = Math.sin(time * zigzagFrequency + parseFloat(enemy.id.slice(-3)) / 100) * zigzagAmplitude
      newX = enemy.x + offsetX
    } else if (enemy.type === 'shooter') {
      // Shooters move slower but pulse (visual effect handled in renderer)
      newY = enemy.y + enemy.speed * 0.8 * speedMultiplier

      // Fire projectiles if cooldown is ready and enemy is on screen
      if (enemy.y > 0 && enemy.y < roadHeight * 0.7 && canShooterFire(enemy.id)) {
        const projectile = createProjectile(enemy.x, enemy.y, enemy.width, enemy.id)
        gameState.addProjectile(projectile)
        markShooterFired(enemy.id)

        // Visual feedback when projectile is fired (accessibility: visual cue for sound)
        visualEffects.shake(EFFECTS.projectileFired.shake, 5)
        visualEffects.flash(EFFECTS.projectileFired.flash, 5)

        // Create muzzle flash sparkle effect
        const { width: roadWidth } = gameState.getRoadDimensions()
        const roadX = (500 - roadWidth) / 2 // Approximate road offset
        for (let i = 0; i < 5; i++) {
          createSparkle(
            enemy.x + enemy.width / 2 + (Math.random() - 0.5) * 20,
            enemy.y + enemy.height + (Math.random() - 0.5) * 10
          )
        }
      }
    }

    // Keep within road bounds
    newX = Math.max(0, Math.min(newX, roadWidth - enemy.width))

    // Reset enemy if it goes off screen
    if (newY > roadHeight + 100) {
      const newEnemy = createEnemy(-100)
      updatedEnemies.push(newEnemy)

      // Award points for passing enemy
      const points = {
        normal: 10,
        fast: 15,
        tank: 25,
        zigzag: 20,
        shooter: 30,
      }[enemy.type] || 10

      gameState.addScore(points)
    } else {
      updatedEnemies.push({ ...enemy, x: newX, y: newY })
    }
  }

  gameState.setEnemies(updatedEnemies)
}

/**
 * Initialize enemies for game start
 */
export function initializeEnemies(): void {
  const enemies: Enemy[] = []

  for (let i = 0; i < CONFIG.enemyCount; i++) {
    const enemy = createEnemy(-200 - i * 250)
    enemies.push(enemy)
  }

  gameState.setEnemies(enemies)
}

/**
 * Increase enemy count based on level
 */
export function updateEnemyCount(): void {
  const level = gameState.getState().level
  const currentEnemies = gameState.getEnemies().length
  const targetCount = Math.min(CONFIG.enemyCount + Math.floor(level / 2), 10)

  if (currentEnemies < targetCount) {
    const newEnemy = createEnemy(-300)
    gameState.addEnemy(newEnemy)
  }
}
