/**
 * Game State Management
 * Centralized state store for game logic
 */

import type {
  GameState,
  GameStateData,
  InputState,
  Player,
  Enemy,
  RoadLine,
  Particle,
  PowerUp,
  GameMode,
} from '../types/game'
import { STORAGE_KEYS, CONFIG } from './constants'

class GameStateManager {
  // Game state
  private state: GameStateData
  private player: Player
  private enemies: Enemy[]
  private roadLines: RoadLine[]
  private particles: Particle[]
  private powerUps: PowerUp[]

  // Input state
  private input: InputState

  // Road dimensions
  private roadWidth: number
  private roadHeight: number

  constructor() {
    // Load high score from storage
    const savedHighScore = parseInt(localStorage.getItem(STORAGE_KEYS.highScore) || '0', 10)

    this.state = {
      current: 'menu',
      mode: 'endless',
      score: 0,
      highScore: savedHighScore,
      level: 1,
      speed: CONFIG.baseSpeed,
      distance: 0,
      shieldActive: false,
      shieldTime: 0,
      slowMoActive: false,
      slowMoTime: 0,
      timeRemaining: 0,
    }

    this.player = {
      x: 0,
      y: 0,
      width: 50,
      height: 80,
      speed: CONFIG.playerSpeed,
      boostActive: false,
      boostTime: 0,
    }

    this.enemies = []
    this.roadLines = []
    this.particles = []
    this.powerUps = []

    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      boost: false,
    }

    this.roadWidth = CONFIG.roadWidth
    this.roadHeight = CONFIG.roadHeight
  }

  // State getters
  public getState(): Readonly<GameStateData> {
    return this.state
  }

  public getCurrentState(): GameState {
    return this.state.current
  }

  public getPlayer(): Readonly<Player> {
    return this.player
  }

  public getEnemies(): Readonly<Enemy[]> {
    return this.enemies
  }

  public getRoadLines(): Readonly<RoadLine[]> {
    return this.roadLines
  }

  public getParticles(): Readonly<Particle[]> {
    return this.particles
  }

  public getPowerUps(): Readonly<PowerUp[]> {
    return this.powerUps
  }

  public getInput(): Readonly<InputState> {
    return this.input
  }

  public getRoadDimensions(): { width: number; height: number } {
    return { width: this.roadWidth, height: this.roadHeight }
  }

  // State setters
  public setGameState(newState: GameState): void {
    this.state.current = newState
  }

  public setGameMode(mode: GameMode): void {
    this.state.mode = mode

    // Set time for time trial mode
    if (mode === 'timetrial') {
      this.state.timeRemaining = 120 // 2 minutes
    } else {
      this.state.timeRemaining = 0
    }
  }

  public getGameMode(): GameMode {
    return this.state.mode
  }

  public setTimeRemaining(time: number): void {
    this.state.timeRemaining = Math.max(0, time)
  }

  public addTime(time: number): void {
    this.state.timeRemaining = Math.max(0, this.state.timeRemaining + time)
  }

  public setScore(score: number): void {
    this.state.score = score

    // Update high score
    if (score > this.state.highScore) {
      this.state.highScore = score
      localStorage.setItem(STORAGE_KEYS.highScore, score.toString())
    }

    // Update level
    this.updateLevel()
  }

  public addScore(points: number): void {
    this.setScore(this.state.score + points)
  }

  public setSpeed(speed: number): void {
    this.state.speed = Math.min(speed, CONFIG.maxSpeed)
  }

  public setDistance(distance: number): void {
    this.state.distance = distance
  }

  public addDistance(distance: number): void {
    this.setDistance(this.state.distance + distance)
  }

  // Player methods
  public setPlayerPosition(x: number, y: number): void {
    this.player.x = x
    this.player.y = y
  }

  public setPlayerBoost(active: boolean): void {
    this.player.boostActive = active
    if (active) {
      this.player.boostTime = Date.now() + 3000
    }
  }

  // Enemy methods
  public setEnemies(enemies: Enemy[]): void {
    this.enemies = enemies
  }

  public addEnemy(enemy: Enemy): void {
    this.enemies.push(enemy)
  }

  public removeEnemy(id: string): void {
    this.enemies = this.enemies.filter(e => e.id !== id)
  }

  public updateEnemy(id: string, updates: Partial<Enemy>): void {
    const index = this.enemies.findIndex(e => e.id === id)
    if (index !== -1) {
      this.enemies[index] = { ...this.enemies[index], ...updates }
    }
  }

  // Road lines methods
  public setRoadLines(lines: RoadLine[]): void {
    this.roadLines = lines
  }

  // Particle methods
  public addParticle(particle: Particle): void {
    this.particles.push(particle)
  }

  public updateParticles(): void {
    // In-place update to avoid creating new arrays every frame
    let writeIndex = 0
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life++

      // Keep particle if it's still alive
      if (p.life < p.maxLife) {
        // Move to write position if needed
        if (i !== writeIndex) {
          this.particles[writeIndex] = p
        }
        writeIndex++
      }
    }
    // Truncate array to new length
    this.particles.length = writeIndex
  }

  public clearParticles(): void {
    this.particles = []
  }

  // Power-up methods
  public addPowerUp(powerUp: PowerUp): void {
    this.powerUps.push(powerUp)
  }

  public setPowerUps(powerUps: PowerUp[]): void {
    this.powerUps = powerUps
  }

  public removePowerUp(id: string): void {
    this.powerUps = this.powerUps.filter(p => p.id !== id)
  }

  // Input methods
  public setInput(key: keyof InputState, value: boolean): void {
    this.input[key] = value
  }

  public resetInput(): void {
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      boost: false,
    }
  }

  // Power-up states
  public activateShield(): void {
    this.state.shieldActive = true
    this.state.shieldTime = Date.now() + 5000
  }

  public activateSlowMo(): void {
    this.state.slowMoActive = true
    this.state.slowMoTime = Date.now() + 4000
  }

  public updatePowerUpStates(): void {
    const now = Date.now()

    if (this.state.shieldActive && now > this.state.shieldTime) {
      this.state.shieldActive = false
    }

    if (this.state.slowMoActive && now > this.state.slowMoTime) {
      this.state.slowMoActive = false
    }

    if (this.player.boostActive && now > this.player.boostTime) {
      this.player.boostActive = false
    }
  }

  // Level management
  private updateLevel(): void {
    const score = this.state.score
    let newLevel = 1

    for (let i = 0; i < 5; i++) {
      if (score >= 1000 * (i + 1) * (i + 1)) {
        newLevel = i + 2
      }
    }

    this.state.level = newLevel
  }

  // Reset game
  public resetGame(): void {
    this.state.current = 'playing'
    this.state.score = 0
    this.state.speed = CONFIG.baseSpeed
    this.state.distance = 0
    this.state.shieldActive = false
    this.state.slowMoActive = false

    // Reset time for time trial mode
    if (this.state.mode === 'timetrial') {
      this.state.timeRemaining = 120
    }

    this.player.x = 0
    this.player.y = 0
    this.player.boostActive = false

    this.enemies = []
    this.particles = []
    this.powerUps = []
    this.resetInput()
  }

  // Set road dimensions
  public setRoadDimensions(width: number, height: number): void {
    this.roadWidth = width
    this.roadHeight = height
  }
}

// Singleton instance
export const gameState = new GameStateManager()
