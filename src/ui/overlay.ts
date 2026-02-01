/**
 * UI Overlay Manager
 * Handles HTML-based UI overlays for menus and game screens
 * V2: Added combo system HUD integration
 * V3: Added per-mode high scores, audio toggle, enhanced pause menu
 */

import { gameState } from '../core/state'
import { inputHandler } from '../core/input'
import { soundManager } from '../audio/soundManager'
import { COLORS, STORAGE_KEYS } from '../core/constants'
import { comboSystem } from '../game/comboSystem'

export class UIOverlay {
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  /**
   * Show main menu
   * V3: Added per-mode high scores and audio toggle
   */
  public showMenu(): void {
    const highScores = gameState.getState().highScores
    const soundEnabled = soundManager.isEnabled()

    this.container.innerHTML = `
      <div class="menu-overlay" role="dialog" aria-labelledby="game-title" aria-modal="true">
        <div class="menu-content">
          <h1 class="game-title" id="game-title">NEON HIGHWAY</h1>
          <p class="game-subtitle">CYBERPUNK RACING</p>

          <div class="menu-stats-highscores" role="region" aria-label="High Scores">
            <div class="stat-item">
              <span class="stat-label">∞ ENDLESS</span>
              <span class="stat-value" aria-label="Endless Mode High Score: ${highScores.endless}">${highScores.endless}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">⏱ TIME TRIAL</span>
              <span class="stat-value" aria-label="Time Trial Mode High Score: ${highScores.timetrial}">${highScores.timetrial}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">☯ ZEN</span>
              <span class="stat-value" aria-label="Zen Mode High Score: ${highScores.zen}">${highScores.zen}</span>
            </div>
          </div>

          <div class="game-modes" role="group" aria-label="Game Modes">
            <p class="mode-title">SELECT MODE</p>
            <div class="mode-buttons">
              <button class="mode-btn" data-mode="endless" aria-label="Start Endless Mode - Race forever, go for high score">
                <span class="mode-icon">∞</span>
                <span class="mode-name">ENDLESS</span>
                <span class="mode-desc">Race forever, go for high score</span>
              </button>
              <button class="mode-btn" data-mode="timetrial" aria-label="Start Time Trial Mode - 2 minutes to score maximum points">
                <span class="mode-icon">⏱</span>
                <span class="mode-name">TIME TRIAL</span>
                <span class="mode-desc">2 minutes to score maximum points</span>
              </button>
              <button class="mode-btn" data-mode="zen" aria-label="Start Zen Mode - No enemies, just drive and relax">
                <span class="mode-icon">☯</span>
                <span class="mode-name">ZEN</span>
                <span class="mode-desc">No enemies, just drive and relax</span>
              </button>
            </div>
          </div>

          <div class="menu-controls" role="region" aria-label="Controls Information">
            <p class="controls-title">CONTROLS</p>
            <div class="controls-grid">
              <div class="control-item">
                <span class="key">↑↓←→</span>
                <span class="key-desc">Move</span>
              </div>
              <div class="control-item">
                <span class="key">SPACE</span>
                <span class="key-desc">Boost</span>
              </div>
              <div class="control-item">
                <span class="key">ESC</span>
                <span class="key-desc">Pause</span>
              </div>
            </div>
          </div>

          <div class="menu-legend" role="region" aria-label="Power-up Legend">
            <span class="legend-item">🔵 Shield</span>
            <span class="legend-item">🟢 Boost</span>
            <span class="legend-item">🟣 Slow-Mo</span>
          </div>

          <div class="menu-footer">
            <button class="sound-toggle" id="sound-toggle" aria-label="Toggle sound ${soundEnabled ? 'off' : 'on'}" aria-pressed="${soundEnabled}">
              <span class="sound-icon">${soundEnabled ? '🔊' : '🔇'}</span>
              <span class="sound-text">${soundEnabled ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>
            <button class="theme-toggle" id="theme-toggle" aria-label="Toggle Light/Dark Mode">
              <span class="theme-icon">🌓</span>
              <span class="theme-text">THEME</span>
            </button>
          </div>
        </div>
      </div>
    `

    // Attach event listeners for mode buttons
    const modeButtons = this.container.querySelectorAll('.mode-btn')
    modeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = (e.currentTarget as HTMLElement).dataset.mode as 'endless' | 'timetrial' | 'zen'
        soundManager.playMenuSelect()
        gameState.setGameMode(mode)
        this.hide()
        gameState.setGameState('playing')
      })

      btn.addEventListener('mouseenter', () => soundManager.playMenuHover())
    })

    // Sound toggle handler
    const soundToggle = this.container.querySelector('#sound-toggle')
    soundToggle?.addEventListener('click', () => {
      const currentState = soundManager.isEnabled()
      const newState = !currentState
      soundManager.setEnabled(newState)
      localStorage.setItem(STORAGE_KEYS.soundEnabled, newState.toString())

      // Update button
      const icon = soundToggle.querySelector('.sound-icon')
      const text = soundToggle.querySelector('.sound-text')
      if (icon) icon.textContent = newState ? '🔊' : '🔇'
      if (text) text.textContent = newState ? 'SOUND ON' : 'SOUND OFF'

      if (newState) soundManager.playMenuSelect()
    })

    // Theme toggle handler
    const themeToggle = this.container.querySelector('#theme-toggle')
    themeToggle?.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark'
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('neon_highway_theme', newTheme)
      soundManager.playMenuSelect()
    })
  }

  /**
   * Show game over screen
   * V2: Added combo statistics display
   */
  public showGameOver(score: number, highScore: number): void {
    const isNewHighScore = score >= highScore
    const comboSummary = comboSystem.getComboSummary()

    this.container.innerHTML = `
      <div class="gameover-overlay">
        <div class="gameover-content">
          <h1 class="gameover-title">WASTED</h1>

          <div class="gameover-stats">
            <div class="go-stat">
              <span class="go-label">SCORE</span>
              <span class="go-value">${score}</span>
            </div>
            <div class="go-stat">
              <span class="go-label">LEVEL</span>
              <span class="go-value">${gameState.getState().level}</span>
            </div>
            <div class="go-stat">
              <span class="go-label">DISTANCE</span>
              <span class="go-value">${(gameState.getState().distance / 1000).toFixed(1)}km</span>
            </div>
          </div>

          <!-- V2: Combo Statistics Section -->
          <div class="combo-stats">
            <p class="combo-section-title">COMBO MASTERY</p>
            <div class="combo-grid">
              <div class="combo-stat">
                <span class="combo-label">MAX MULTIPLIER</span>
                <span class="combo-value">${comboSummary.maxMultiplier}x</span>
              </div>
              <div class="combo-stat">
                <span class="combo-label">CLOSE CALLS</span>
                <span class="combo-value">${comboSummary.totalCombos}</span>
              </div>
              <div class="combo-stat">
                <span class="combo-label">BEST COMBO</span>
                <span class="combo-value">${comboSummary.bestComboCount}</span>
              </div>
            </div>
          </div>

          ${isNewHighScore ? `
            <div class="new-highscore">
              <span class="trophy">🏆</span>
              <span class="new-record">NEW RECORD!</span>
            </div>
          ` : `
            <div class="go-highscore">
              <span class="go-label">BEST</span>
              <span class="go-value">${highScore}</span>
            </div>
          `}

          <div class="gameover-buttons">
            <button class="menu-btn primary" id="restart-btn">
              <span class="btn-text">ONE MORE TRY</span>
            </button>
            <button class="menu-btn secondary" id="menu-btn">
              <span class="btn-text">GARAGE</span>
            </button>
          </div>
        </div>
      </div>
    `

    // Attach event listeners
    document.getElementById('restart-btn')?.addEventListener('click', () => {
      soundManager.playMenuSelect()
      this.hide()
      gameState.setGameState('playing')
    })

    document.getElementById('menu-btn')?.addEventListener('click', () => {
      soundManager.playMenuSelect()
      this.showMenu()
    })

    // Add hover sounds
    const buttons = this.container.querySelectorAll('.menu-btn')
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => soundManager.playMenuHover())
    })
  }

  /**
   * Show pause menu
   * V3: Enhanced pause menu with resume/restart/quit options
   */
  public showPause(): void {
    const state = gameState.getState()

    this.container.innerHTML = `
      <div class="pause-overlay">
        <div class="pause-content">
          <h1 class="pause-title">PAUSED</h1>

          <div class="pause-stats">
            <div class="pause-stat">
              <span class="pause-label">SCORE</span>
              <span class="pause-value">${state.score}</span>
            </div>
            <div class="pause-stat">
              <span class="pause-label">LEVEL</span>
              <span class="pause-value">${state.level}</span>
            </div>
            ${state.mode === 'timetrial' ? `
            <div class="pause-stat">
              <span class="pause-label">TIME</span>
              <span class="pause-value">${Math.ceil(state.timeRemaining)}s</span>
            </div>
            ` : ''}
          </div>

          <div class="pause-buttons">
            <button class="pause-btn primary" id="resume-btn">
              <span class="btn-icon">▶</span>
              <span class="btn-text">RESUME</span>
            </button>
            <button class="pause-btn secondary" id="restart-btn">
              <span class="btn-icon">↻</span>
              <span class="btn-text">RESTART</span>
            </button>
            <button class="pause-btn danger" id="quit-btn">
              <span class="btn-icon">✕</span>
              <span class="btn-text">QUIT</span>
            </button>
          </div>
        </div>
      </div>
    `

    // Attach event listeners
    document.getElementById('resume-btn')?.addEventListener('click', () => {
      soundManager.playMenuSelect()
      this.hide()
      gameState.setGameState('playing')
    })

    document.getElementById('restart-btn')?.addEventListener('click', () => {
      soundManager.playMenuSelect()
      this.hide()
      gameState.resetGame()
      gameState.setGameState('playing')
    })

    document.getElementById('quit-btn')?.addEventListener('click', () => {
      soundManager.playMenuSelect()
      this.showMenu()
    })

    // Add hover sounds
    const buttons = this.container.querySelectorAll('.pause-btn')
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => soundManager.playMenuHover())
    })
  }

  /**
   * Hide all overlays
   */
  public hide(): void {
    this.container.innerHTML = ''
  }

  /**
   * Update HUD elements (score, speed, etc.)
   * V2: Added combo multiplier display
   */
  public updateHUD(): void {
    const state = gameState.getState()

    let scoreEl = document.getElementById('hud-score')
    let speedEl = document.getElementById('hud-speed')
    let levelEl = document.getElementById('hud-level')
    let highScoreEl = document.getElementById('hud-highscore')
    let comboEl = document.getElementById('hud-combo')

    if (!scoreEl) {
      // Create HUD if it doesn't exist
      this.createHUD()
      scoreEl = document.getElementById('hud-score')
      speedEl = document.getElementById('hud-speed')
      levelEl = document.getElementById('hud-level')
      highScoreEl = document.getElementById('hud-highscore')
      comboEl = document.getElementById('hud-combo')
    }

    if (scoreEl) scoreEl.textContent = state.score.toString()

    // V5: Added human touch - speedometer jitter
    const jitter = state.speed > 18 ? (Math.random() - 0.5) * 2 : 0
    if (speedEl) speedEl.textContent = `SPD: ${(state.speed + jitter).toFixed(1)}`

    if (levelEl) levelEl.textContent = `LVL: ${state.level}`
    if (highScoreEl) highScoreEl.textContent = `BEST: ${state.highScore}`

    // V2: Update combo display
    const comboInfo = comboSystem.getDisplayInfo()
    if (comboEl) {
      if (comboInfo.show) {
        comboEl.innerHTML = `<span class="combo-mult">${comboInfo.multiplier.toFixed(1)}x</span> <span class="combo-count">COMBO</span>`
        comboEl.classList.add('combo-active')
        comboEl.style.opacity = '1'
      } else {
        comboEl.classList.remove('combo-active')
        comboEl.style.opacity = '0.3'
      }
    }
  }

  /**
   * Create HUD elements
   * V2: Added combo multiplier display
   */
  private createHUD(): void {
    const hud = document.createElement('div')
    hud.className = 'game-hud'
    hud.innerHTML = `
      <div class="hud-row">
        <div class="hud-item">
          <span class="hud-label">SCORE</span>
          <span class="hud-value" id="hud-score">0</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">LEVEL</span>
          <span class="hud-value" id="hud-level">1</span>
        </div>
      </div>
      <div class="hud-row">
        <div class="hud-item">
          <span class="hud-label">SPEED</span>
          <span class="hud-value" id="hud-speed">5.0</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">BEST</span>
          <span class="hud-value" id="hud-highscore">0</span>
        </div>
      </div>
      <div class="hud-row hud-combo-row" id="hud-combo">
        <span class="hud-label">COMBO</span>
        <span class="hud-value combo-mult">1.0x</span>
      </div>
    `
    this.container.appendChild(hud)
  }

  /**
   * Show power-up notification
   */
  public showPowerUpNotification(type: string): void {
    const notification = document.createElement('div')
    notification.className = `powerup-notification powerup-${type}`

    const icons: Record<string, string> = {
      shield: '🛡️',
      boost: '⚡',
      slowmo: '⏱️',
      magnet: '🧲',
    }

    notification.innerHTML = `
      <span class="powerup-icon">${icons[type] || '⭐'}</span>
      <span class="powerup-name">${type.toUpperCase()}</span>
    `

    this.container.appendChild(notification)

    setTimeout(() => {
      notification.classList.add('show')
    }, 10)

    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => notification.remove(), 300)
    }, 2000)
  }
}

/**
 * Initialize UI overlays
 */
export function initUI(container: HTMLElement): UIOverlay {
  // Add virtual controls for mobile
  if ('ontouchstart' in window) {
    inputHandler.createVirtualControls(container)
  }

  return new UIOverlay(container)
}
