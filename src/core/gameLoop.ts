/**
 * Main Game Loop
 * Orchestrates all game systems
 */

import { gameState } from './state'
import { checkPlayerEnemyCollision, checkPowerUpCollision } from '../game/collision'
import { updatePlayer, initializePlayer } from '../game/player'
import { updateEnemies, initializeEnemies, updateEnemyCount } from '../game/enemies'
import { updateRoadLines, initializeRoadLines } from '../game/road'
import { createExplosion, createTrail, createSpeedLines, updateParticles, clearParticles, createShieldEffect, createSparkle } from '../game/particles'
import { checkPowerUpSpawn, updatePowerUps, initializePowerUps } from '../game/powerups'
import { soundManager } from '../audio/soundManager'
import { visualEffects, EFFECTS } from '../visual/effects'
import { updateDifficulty, getLevelProgress } from '../game/difficulty'
import { comboSystem } from '../game/comboSystem'
import type { CanvasRenderer } from '../renderer/canvas'
import type { UIOverlay } from '../ui/overlay'

let animationId: number = 0
let lastTime = 0
let accumulator = 0
let lastLevel = 1
let lastSpeedThreshold = 0 // Track last speed increase point
const FIXED_DELTA = 1000 / 60 // 60 FPS

/**
 * Start the game loop
 */
export function startGameLoop(renderer: CanvasRenderer, ui: UIOverlay): void {
  // Resume audio context
  soundManager.resume()

  // Reset level and speed tracking
  lastLevel = 1
  lastSpeedThreshold = 0

  // Initialize game systems
  gameState.resetGame()
  const { width, height } = gameState.getRoadDimensions()

  initializePlayer(width, height)
  initializeEnemies()
  initializeRoadLines()
  initializePowerUps()
  clearParticles()

  // Reset combo system
  comboSystem.reset()

  lastTime = performance.now()
  accumulator = 0

  animationId = requestAnimationFrame((time) => gameLoop(time, renderer, ui))
}

/**
 * Main game loop
 */
function gameLoop(currentTime: number, renderer: CanvasRenderer, ui: UIOverlay): void {
  const deltaTime = currentTime - lastTime
  lastTime = currentTime
  accumulator += deltaTime

  // Fixed timestep update
  while (accumulator >= FIXED_DELTA) {
    update(FIXED_DELTA)
    accumulator -= FIXED_DELTA
  }

  // Render
  render(renderer, ui)

  // Continue loop
  const state = gameState.getCurrentState()
  if (state === 'playing' || state === 'paused') {
    animationId = requestAnimationFrame((time) => gameLoop(time, renderer, ui))
  }
}

/**
 * Update game logic
 */
function update(deltaTime: number): void {
  const state = gameState.getCurrentState()

  if (state === 'paused') return

  const player = gameState.getPlayer()
  const stateData = gameState.getState()

  // Update player
  updatePlayer(deltaTime)

  // Update road lines
  updateRoadLines(stateData.speed)

  // Update enemies (skip in zen mode)
  const gameMode = gameState.getGameMode()
  if (gameMode !== 'zen') {
    updateEnemies(deltaTime)
    updateEnemyCount()
  }

  // Spawn and update power-ups
  checkPowerUpSpawn()
  updatePowerUps(deltaTime)

  // Update power-up states
  gameState.updatePowerUpStates()

  // Update difficulty (skip in zen mode)
  if (gameMode !== 'zen') {
    updateDifficulty()
  }

  // Create player trail
  if (player.boostActive) {
    createTrail(player.x, player.y, player.width)
  }

  // Create speed lines at high speeds
  if (stateData.speed > 10 && Math.random() < 0.3) {
    createSpeedLines()
  }

  // Update particles
  updateParticles()

  // Update combo system
  comboSystem.update(deltaTime)

  // Create shield effect
  if (stateData.shieldActive && Math.random() < 0.1) {
    createShieldEffect(player.x, player.y, player.width, player.height)
  }

  // Check collisions (skip in zen mode)
  if (gameMode !== 'zen' && checkPlayerEnemyCollision()) {
    handlePlayerDeath()
    return
  }

  // Check power-up collection
  const powerUpData = checkPowerUpCollision()
  if (powerUpData) {
    handlePowerUp(powerUpData.type, powerUpData.id)
  }

  // Update score and distance
  gameState.addScore(1)
  gameState.addDistance(stateData.speed * deltaTime / 1000)

  // Handle time trial mode
  if (gameMode === 'timetrial') {
    gameState.setTimeRemaining(stateData.timeRemaining - deltaTime / 1000)
    if (stateData.timeRemaining <= 0) {
      // Time's up!
      gameState.setGameState('gameover')
      return
    }
  }

  // Check for level up (skip in zen and time trial modes)
  if (gameMode === 'endless') {
    const currentLevel = stateData.level
    if (currentLevel > lastLevel) {
      // Level up!
      visualEffects.shake(EFFECTS.levelUp.shake, 12)
      visualEffects.flash(EFFECTS.levelUp.flash, 8)
      soundManager.playLevelUp()
      lastLevel = currentLevel
    }

    // Increase speed at score thresholds (every 500 points)
    const nextThreshold = lastSpeedThreshold + 500
    if (stateData.score >= nextThreshold && nextThreshold > 0) {
      gameState.setSpeed(stateData.speed + 0.5)
      lastSpeedThreshold = nextThreshold
    }
  }
}

/**
 * Render frame
 */
function render(renderer: CanvasRenderer, ui: UIOverlay): void {
  const state = gameState.getCurrentState()

  // Clear canvas
  renderer.clear()

  // Draw road
  renderer.drawRoad()

  // Draw power-ups
  renderer.drawPowerUps()

  // Draw enemies
  renderer.drawEnemies()

  // Draw player
  renderer.drawPlayer()

  // Draw particles
  renderer.drawParticles()

  // Draw HUD
  renderer.drawHUD()

  // Draw pause overlay
  if (state === 'paused') {
    renderer.drawPauseOverlay()
  }

  // Post-render effects (flash, restore context)
  renderer.postRender()

  // Update HTML HUD
  if (state === 'playing') {
    ui.updateHUD()
  }
}

/**
 * Handle player death
 */
function handlePlayerDeath(): void {
  const player = gameState.getPlayer()
  const state = gameState.getState()

  // Trigger visual effects
  visualEffects.shake(EFFECTS.collision.shake, 15)
  visualEffects.flash(EFFECTS.collision.flash, 10)

  // Play crash sound
  soundManager.playCrash()

  // Create explosion
  createExplosion(
    player.x + player.width / 2,
    player.y + player.height / 2,
    '#ff0080',
    50
  )

  // Save high score
  if (state.score > state.highScore) {
    localStorage.setItem('neon_racing_highscore', state.score.toString())
  }

  // Play game over sound after explosion
  setTimeout(() => soundManager.playGameOver(), 300)

  // Set game over state
  gameState.setGameState('gameover')
}

/**
 * Handle power-up collection
 */
function handlePowerUp(type: string, powerUpId: string): void {
  // Remove the power-up
  gameState.removePowerUp(powerUpId)

  // Trigger visual effects
  visualEffects.shake(EFFECTS.powerUp.shake, 8)
  visualEffects.flash(EFFECTS.powerUp.flash, 5)

  // Play power-up sound
  soundManager.playPowerUp(type as 'shield' | 'boost' | 'slowmo' | 'magnet')

  // Create sparkle effect at player position
  const player = gameState.getPlayer()
  for (let i = 0; i < 10; i++) {
    createSparkle(
      player.x + player.width / 2 + (Math.random() - 0.5) * 40,
      player.y + player.height / 2 + (Math.random() - 0.5) * 40
    )
  }

  // Apply power-up effect
  switch (type) {
    case 'shield':
      gameState.activateShield()
      break
    case 'boost':
      gameState.setPlayerBoost(true)
      soundManager.playBoost()
      visualEffects.shake(EFFECTS.boost.shake, 5)
      visualEffects.flash(EFFECTS.boost.flash, 3)
      break
    case 'slowmo':
      gameState.activateSlowMo()
      break
    case 'magnet':
      // Magnet attracts nearby power-ups and clears enemies
      gameState.activateShield()
      break
  }
}

/**
 * Stop the game loop
 */
export function stopGameLoop(): void {
  cancelAnimationFrame(animationId)
}
