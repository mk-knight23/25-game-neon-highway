/**
 * Game Constants
 * Neon Highway Racing - Futuristic Cyberpunk Theme
 */

import type { GameConfig } from '../types/game'

// Neon color palette - Cyberpunk theme
export const COLORS = {
  // Primary neon colors
  neonCyan: '#00ffff',
  neonMagenta: '#ff00ff',
  neonBlue: '#0066ff',
  neonPink: '#ff0080',
  neonPurple: '#8000ff',
  neonGreen: '#00ff80',

  // Background
  darkBg: '#0a0a0f',
  darkerBg: '#050508',
  roadColor: '#12121a',

  // UI
  textPrimary: '#ffffff',
  textSecondary: '#8888aa',

  // Effects
  glowCyan: 'rgba(0, 255, 255, 0.6)',
  glowMagenta: 'rgba(255, 0, 255, 0.6)',
  glowBlue: 'rgba(0, 102, 255, 0.6)',
} as const

// Enemy colors by type
export const ENEMY_COLORS = {
  normal: COLORS.neonPink,
  fast: COLORS.neonCyan,
  tank: COLORS.neonPurple,
} as const

export const CONFIG: GameConfig = {
  roadWidth: 400,
  roadHeight: 800,
  laneCount: 4,
  playerSpeed: 8,
  baseSpeed: 5,
  maxSpeed: 20,
  enemyCount: 3,
}

export const LEVEL_THRESHOLDS = [0, 1000, 2500, 5000, 10000, 20000]

export const POWER_UP_TYPES = {
  shield: { color: COLORS.neonBlue, duration: 5000 },
  boost: { color: COLORS.neonGreen, duration: 3000 },
  slowmo: { color: COLORS.neonPurple, duration: 4000 },
  magnet: { color: COLORS.neonMagenta, duration: 6000 },
} as const

// Canvas rendering settings
export const RENDER_CONFIG = {
  glowAmount: 20,
  lineWidth: 2,
  particleCount: 50,
  trailLength: 10,
} as const

export const STORAGE_KEYS = {
  highScore: 'neon_racing_highscore',
  settings: 'neon_racing_settings',
} as const
