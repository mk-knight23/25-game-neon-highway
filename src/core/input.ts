/**
 * Input Handler
 * Manages keyboard and touch input
 */

import { gameState } from './state'

type InputKey = 'left' | 'right' | 'up' | 'down' | 'boost'

class InputHandler {
  private keys: Map<string, InputKey> = new Map()
  private touchStartX = 0
  private touchStartY = 0

  constructor() {
    this.setupKeyboard()
    this.setupTouch()
  }

  private setupKeyboard(): void {
    // Map arrow keys and WASD
    this.keys.set('ArrowLeft', 'left')
    this.keys.set('ArrowRight', 'right')
    this.keys.set('ArrowUp', 'up')
    this.keys.set('ArrowDown', 'down')
    this.keys.set('a', 'left')
    this.keys.set('d', 'right')
    this.keys.set('w', 'up')
    this.keys.set('s', 'down')
    this.keys.set(' ', 'boost')
    this.keys.set('Shift', 'boost')

    // Keydown handler
    document.addEventListener('keydown', (e) => {
      const key = this.keys.get(e.key)
      if (key !== undefined) {
        e.preventDefault()
        gameState.setInput(key, true)
      }

      // ESC for pause
      if (e.key === 'Escape') {
        this.togglePause()
      }
    })

    // Keyup handler
    document.addEventListener('keyup', (e) => {
      const key = this.keys.get(e.key)
      if (key !== undefined) {
        e.preventDefault()
        gameState.setInput(key, false)
      }
    })
  }

  private setupTouch(): void {
    const gameArea = document.querySelector('.game-canvas') as HTMLElement

    if (!gameArea) return

    // Touch start
    gameArea.addEventListener('touchstart', (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      this.touchStartX = touch.clientX
      this.touchStartY = touch.clientY
    }, { passive: false })

    // Touch move - detect swipe direction
    gameArea.addEventListener('touchmove', (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const deltaX = touch.clientX - this.touchStartX
      const deltaY = touch.clientY - this.touchStartY

      // Reset all direction inputs
      gameState.setInput('left', false)
      gameState.setInput('right', false)
      gameState.setInput('up', false)
      gameState.setInput('down', false)

      // Detect primary swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 30) gameState.setInput('right', true)
        else if (deltaX < -30) gameState.setInput('left', true)
      } else {
        // Vertical swipe
        if (deltaY > 30) gameState.setInput('down', true)
        else if (deltaY < -30) gameState.setInput('up', true)
      }
    }, { passive: false })

    // Touch end
    gameArea.addEventListener('touchend', (e) => {
      e.preventDefault()
      gameState.setInput('left', false)
      gameState.setInput('right', false)
      gameState.setInput('up', false)
      gameState.setInput('down', false)
    })

    // Double tap for boost
    let lastTap = 0
    gameArea.addEventListener('touchend', (e) => {
      const now = Date.now()
      if (now - lastTap < 300) {
        gameState.setInput('boost', true)
        setTimeout(() => gameState.setInput('boost', false), 500)
      }
      lastTap = now
    })
  }

  private togglePause(): void {
    const current = gameState.getCurrentState()
    if (current === 'playing') {
      gameState.setGameState('paused')
    } else if (current === 'paused') {
      gameState.setGameState('playing')
    }
  }

  /**
   * On-screen controls for touch devices.
   * Left cluster: steering (◀ ▶). Right cluster: accelerate (▲), brake (▼),
   * and a dedicated nitro button (⚡). Uses Pointer Events so multiple
   * buttons can be held simultaneously (e.g. steer + accelerate + nitro).
   */
  public createVirtualControls(container: HTMLElement): void {
    const controls = document.createElement('div')
    controls.className = 'virtual-controls'
    controls.setAttribute('role', 'group')
    controls.setAttribute('aria-label', 'Touch controls')
    controls.innerHTML = `
      <div class="vc-cluster vc-steer">
        <button class="vc-btn vc-left" data-dir="left" aria-label="Steer left">◀</button>
        <button class="vc-btn vc-right" data-dir="right" aria-label="Steer right">▶</button>
      </div>
      <div class="vc-cluster vc-drive">
        <button class="vc-btn vc-up" data-dir="up" aria-label="Accelerate">▲</button>
        <button class="vc-btn vc-down" data-dir="down" aria-label="Brake">▼</button>
        <button class="vc-btn vc-nitro" data-dir="boost" aria-label="Nitro boost">⚡</button>
      </div>
    `

    const buttons = controls.querySelectorAll('[data-dir]')
    buttons.forEach(btn => {
      const dir = btn.getAttribute('data-dir') as InputKey
      const press = (e: Event) => {
        e.preventDefault()
        gameState.setInput(dir, true)
        btn.classList.add('vc-active')
      }
      const release = (e: Event) => {
        e.preventDefault()
        gameState.setInput(dir, false)
        btn.classList.remove('vc-active')
      }

      // Pointer events cover touch + mouse + pen, and allow multi-touch.
      btn.addEventListener('pointerdown', press)
      btn.addEventListener('pointerup', release)
      btn.addEventListener('pointercancel', release)
      btn.addEventListener('pointerleave', release)
      // Prevent the browser from firing synthetic mouse/scroll on touch.
      btn.addEventListener('contextmenu', (e) => e.preventDefault())
    })

    container.appendChild(controls)
  }
}

// Export singleton
export const inputHandler = new InputHandler()
