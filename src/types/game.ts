/**
 * Game Type Definitions
 * Neon Highway Racing - Futuristic Cyberpunk Theme
 */

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover'
export type GameMode = 'endless' | 'timetrial' | 'zen'

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Rect extends Position, Size {}

export interface Player {
  x: number
  y: number
  width: number
  height: number
  speed: number
  boostActive: boolean
  boostTime: number
  boostEnergy: number // V3: Boost energy system (0-100)
}

export interface Enemy {
  id: string
  x: number
  y: number
  width: number
  height: number
  speed: number
  color: string
  type: 'normal' | 'fast' | 'tank' | 'zigzag' | 'shooter'
  spawnTime: number // V3: Track spawn time for hesitation effect
}

export interface RoadLine {
  y: number
  height: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface PowerUp {
  id: string
  x: number
  y: number
  type: 'shield' | 'boost' | 'slowmo' | 'magnet'
  active: boolean
}

export interface Projectile {
  id: string
  x: number
  y: number
  width: number
  height: number
  speed: number
  color: string
  ownerId: string // ID of the enemy that fired this projectile
}

export interface GameStateData {
  current: GameState
  mode: GameMode
  score: number
  highScore: number
  highScores: {
    endless: number
    timetrial: number
    zen: number
  }
  level: number
  speed: number
  distance: number
  shieldActive: boolean
  shieldTime: number
  slowMoActive: boolean
  slowMoTime: number
  timeRemaining: number // For time trial mode
}

export interface InputState {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  boost: boolean
}

export interface GameConfig {
  roadWidth: number
  roadHeight: number
  laneCount: number
  playerSpeed: number
  baseSpeed: number
  maxSpeed: number
  enemyCount: number
}
