/**
 * Neon Highway Racing
 * A Futuristic Cyberpunk Racing Game
 *
 * Made by MK - Built by Musharraf Kazi
 */

import './style.css'
import { initCanvas } from './renderer/canvas'
import { initUI } from './ui/overlay'
import { startGameLoop, stopGameLoop } from './core/gameLoop'
import { gameState } from './core/state'
import { inputHandler } from './core/input'

// Game containers
let renderer: ReturnType<typeof initCanvas> | null = null
let ui: ReturnType<typeof initUI> | null = null
const canvasContainer = document.getElementById('canvas-container') as HTMLElement
const uiContainer = document.getElementById('ui-container') as HTMLElement
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement

// State monitoring
let stateMonitorInterval: number | null = null
let currentState: string = 'menu'

/**
 * Initialize game
 */
function init(): void {
  // Initialize renderer
  renderer = initCanvas(canvas)

  // Initialize UI
  ui = initUI(uiContainer)

  // Show main menu
  ui!.showMenu()

  // Start state monitoring for game state changes
  startStateMonitoring()
}

/**
 * Start state monitoring
 */
function startStateMonitoring(): void {
  // Clear any existing monitor
  stopStateMonitoring()

  currentState = gameState.getCurrentState()

  stateMonitorInterval = window.setInterval(() => {
    const newState = gameState.getCurrentState()

    if (newState !== currentState) {
      handleStateChange(currentState, newState)
      currentState = newState
    }
  }, 100)
}

/**
 * Stop state monitoring
 */
function stopStateMonitoring(): void {
  if (stateMonitorInterval !== null) {
    clearInterval(stateMonitorInterval)
    stateMonitorInterval = null
  }
}

/**
 * Handle game state changes
 * V3: Added pause state handling
 */
function handleStateChange(oldState: string, newState: string): void {
  switch (newState) {
    case 'playing':
      if (oldState === 'menu' || oldState === 'gameover') {
        startGameLoop(renderer!, ui!)
      } else if (oldState === 'paused') {
        // Resume from pause - just hide the pause overlay
        ui!.hide()
      }
      break

    case 'paused':
      // Show pause menu
      ui!.showPause()
      break

    case 'gameover':
      stopGameLoop()
      const state = gameState.getState()
      ui!.showGameOver(state.score, state.highScore)
      break

    case 'menu':
      stopGameLoop()
      ui!.showMenu()
      break
  }
}

/**
 * Handle window resize
 */
window.addEventListener('resize', () => {
  if (canvas && renderer) {
    const container = canvas.parentElement
    if (container) {
      canvas.width = Math.min(500, container.clientWidth)
      canvas.height = Math.min(800, window.innerHeight - 100)
      gameState.setRoadDimensions(400, canvas.height)
    }
  }
})

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Export for testing
export { init }
