/**
 * Visual Effects Manager
 * Screen shake, flash, and other visual effects
 */

import { gameState } from '../core/state'

export class VisualEffects {
  private shakeIntensity = 0
  private shakeDuration = 0
  private shakeX = 0
  private shakeY = 0

  private flashIntensity = 0
  private flashDuration = 0

  /**
   * Trigger screen shake
   */
  public shake(intensity: number, duration: number): void {
    this.shakeIntensity = intensity
    this.shakeDuration = duration
  }

  /**
   * Trigger screen flash
   */
  public flash(intensity: number, duration: number): void {
    this.flashIntensity = intensity
    this.flashDuration = duration
  }

  /**
   * Update effects
   */
  public update(): void {
    // Update shake
    if (this.shakeDuration > 0) {
      const progress = 1 - this.shakeDuration / 20 // Assuming max duration of 20
      const currentIntensity = this.shakeIntensity * (1 - progress * 0.5)

      this.shakeX = (Math.random() - 0.5) * currentIntensity
      this.shakeY = (Math.random() - 0.5) * currentIntensity

      this.shakeDuration--
    } else {
      this.shakeX = 0
      this.shakeY = 0
    }

    // Update flash
    if (this.flashDuration > 0) {
      this.flashDuration--
    }
  }

  /**
   * Get shake offset
   */
  public getShakeOffset(): { x: number; y: number } {
    return { x: this.shakeX, y: this.shakeY }
  }

  /**
   * Get flash intensity (0-1)
   */
  public getFlashIntensity(): number {
    if (this.flashDuration <= 0) return 0
    return this.flashIntensity * (this.flashDuration / 30)
  }

  /**
   * Check if effects are active
   */
  public isActive(): boolean {
    return this.shakeDuration > 0 || this.flashDuration > 0
  }
}

// Export singleton
export const visualEffects = new VisualEffects()

/**
 * Effect presets
 */
export const EFFECTS = {
  collision: { shake: 15, flash: 0.3 },
  powerUp: { shake: 5, flash: 0.2 },
  boost: { shake: 3, flash: 0.1 },
  levelUp: { shake: 10, flash: 0.4 },
  smallHit: { shake: 5, flash: 0.15 },
  projectileFired: { shake: 3, flash: 0.1 },
  projectileNearMiss: { shake: 2, flash: 0 },
} as const
