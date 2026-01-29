/**
 * Combo System
 * Skill ceiling improvement - rewards risky play and consecutive actions
 *
 * Game Design Notes:
 * - Close calls with enemies build combo multiplier
 * - Consecutive power-up collection extends combo timer
 * - Higher multiplier = exponentially more points
 * - Creates risk-reward decision moments for players
 */

export interface ComboState {
  active: boolean
  multiplier: number
  count: number
  timer: number
  maxMultiplier: number
  totalComboScore: number
}

export interface ComboEvent {
  type: 'close_call' | 'powerup' | 'near_miss' | 'perfect_dodge'
  value: number
  timestamp: number
}

const COMBO_CONFIG = {
  baseMultiplier: 1,
  maxMultiplier: 10,
  baseTime: 3000, // 3 seconds to maintain combo
  timeBonus: 1500, // +1.5s per event
  closeCallDistance: 30, // pixels for "close call"
  nearMissDistance: 15, // pixels for "near miss"
  perfectDodgeDistance: 5, // pixels for "perfect dodge"
  multiplierIncrease: 0.5, // per event
} as const

class ComboManager {
  private state: ComboState
  private events: ComboEvent[] = []

  constructor() {
    this.state = {
      active: false,
      multiplier: COMBO_CONFIG.baseMultiplier,
      count: 0,
      timer: 0,
      maxMultiplier: 1,
      totalComboScore: 0,
    }
  }

  /**
   * Get current combo state
   */
  public getState(): Readonly<ComboState> {
    return this.state
  }

  /**
   * Check for close call with enemy and award combo
   * Returns points earned from close call
   */
  public checkCloseCall(
    playerX: number,
    playerY: number,
    playerWidth: number,
    playerHeight: number,
    enemyX: number,
    enemyY: number,
    enemyWidth: number,
    enemyHeight: number
  ): number {
    // Calculate closest distance between player and enemy
    const closestX = this.closestDistance(
      playerX,
      playerX + playerWidth,
      enemyX,
      enemyX + enemyWidth
    )
    const closestY = this.closestDistance(
      playerY,
      playerY + playerHeight,
      enemyY,
      enemyY + enemyHeight
    )

    const distance = Math.sqrt(closestX * closestX + closestY * closestY)

    let eventValue = 0
    let eventType: ComboEvent['type'] = 'close_call'

    if (distance < COMBO_CONFIG.perfectDodgeDistance) {
      eventType = 'perfect_dodge'
      eventValue = 5 // +5 combo
    } else if (distance < COMBO_CONFIG.nearMissDistance) {
      eventType = 'near_miss'
      eventValue = 3 // +3 combo
    } else if (distance < COMBO_CONFIG.closeCallDistance) {
      eventType = 'close_call'
      eventValue = 1 // +1 combo
    }

    if (eventValue > 0) {
      this.addComboEvent(eventType, eventValue)
      return Math.floor(10 * this.state.multiplier)
    }

    return 0
  }

  /**
   * Award combo for power-up collection
   */
  public collectPowerUp(): number {
    this.addComboEvent('powerup', 2)
    return Math.floor(50 * this.state.multiplier)
  }

  /**
   * Update combo timer - call every frame
   */
  public update(deltaTime: number): void {
    if (!this.state.active) return

    this.state.timer -= deltaTime

    if (this.state.timer <= 0) {
      this.endCombo()
    }
  }

  /**
   * End current combo and calculate final score
   */
  public endCombo(): void {
    if (this.state.count > 5) {
      // Bonus for long combos
      this.state.totalComboScore = Math.floor(
        this.state.count * 25 * this.state.multiplier
      )
    }
    this.state.active = false
    this.state.multiplier = COMBO_CONFIG.baseMultiplier
  }

  /**
   * Reset combo system
   */
  public reset(): void {
    this.state = {
      active: false,
      multiplier: COMBO_CONFIG.baseMultiplier,
      count: 0,
      timer: 0,
      maxMultiplier: Math.max(this.state.maxMultiplier, this.state.multiplier),
      totalComboScore: 0,
    }
    this.events = []
  }

  /**
   * Get combo display info
   */
  public getDisplayInfo(): {
    show: boolean
    multiplier: number
    count: number
    timerPercent: number
  } {
    return {
      show: this.state.active && this.state.multiplier > 1,
      multiplier: this.state.multiplier,
      count: this.state.count,
      timerPercent: this.state.timer / COMBO_CONFIG.baseTime,
    }
  }

  /**
   * Get combo summary for end of run
   */
  public getComboSummary(): {
    maxMultiplier: number
    totalCombos: number
    bestComboCount: number
  } {
    return {
      maxMultiplier: this.state.maxMultiplier,
      totalCombos: this.events.filter(e => e.type !== 'powerup').length,
      bestComboCount: this.state.count,
    }
  }

  /**
   * Private: Add combo event and update state
   */
  private addComboEvent(type: ComboEvent['type'], value: number): void {
    const now = Date.now()
    this.events.push({ type, value, timestamp: now })

    // Start or extend combo
    if (!this.state.active) {
      this.state.active = true
      this.state.count = 0
      this.state.multiplier = COMBO_CONFIG.baseMultiplier
    }

    this.state.count += value
    this.state.timer = COMBO_CONFIG.baseTime + (this.state.count * COMBO_CONFIG.timeBonus / 10)

    // Increase multiplier
    this.state.multiplier = Math.min(
      COMBO_CONFIG.maxMultiplier,
      COMBO_CONFIG.baseMultiplier + Math.floor(this.state.count / 3) * COMBO_CONFIG.multiplierIncrease
    )

    // Track max multiplier
    this.state.maxMultiplier = Math.max(this.state.maxMultiplier, this.state.multiplier)
  }

  /**
   * Private: Calculate closest distance between two ranges
   */
  private closestDistance(
    aMin: number,
    aMax: number,
    bMin: number,
    bMax: number
  ): number {
    // No overlap
    if (aMax < bMin) return bMin - aMax
    if (bMax < aMin) return aMin - bMax
    return 0 // Overlapping
  }
}

// Singleton instance
export const comboSystem = new ComboManager()
