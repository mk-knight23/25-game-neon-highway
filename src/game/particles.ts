/**
 * Particle System
 * Visual effects using particles
 */

import type { Particle } from '../types/game'
import { gameState } from '../core/state'
import { COLORS } from '../core/constants'

/**
 * Create an explosion of particles
 */
export function createExplosion(x: number, y: number, color: string, count: number = 20): void {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count
    const speed = 2 + Math.random() * 4

    gameState.addParticle({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 30 + Math.random() * 20,
      color,
      size: 2 + Math.random() * 4,
    })
  }
}

/**
 * Create a trail behind the player
 */
export function createTrail(x: number, y: number, width: number): void {
  gameState.addParticle({
    x: x + width / 2 + (Math.random() - 0.5) * 20,
    y: y + 80,
    vx: 0,
    vy: gameState.getState().speed * 0.5,
    life: 0,
    maxLife: 15,
    color: COLORS.neonCyan,
    size: 3 + Math.random() * 3,
  })
}

/**
 * Create speed lines effect
 */
export function createSpeedLines(): void {
  const { width, height } = gameState.getRoadDimensions()

  for (let i = 0; i < 3; i++) {
    gameState.addParticle({
      x: Math.random() * width,
      y: -20,
      vx: 0,
      vy: gameState.getState().speed * 2,
      life: 0,
      maxLife: 40,
      color: COLORS.glowCyan,
      size: 1 + Math.random() * 2,
    })
  }
}

/**
 * Create sparkle effect for power-ups
 */
export function createSparkle(x: number, y: number): void {
  gameState.addParticle({
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    life: 0,
    maxLife: 20,
    color: COLORS.neonMagenta,
    size: 2,
  })
}

/**
 * Create shield effect particles
 */
export function createShieldEffect(x: number, y: number, width: number, height: number): void {
  // Create particles around the player
  const positions = [
    { x: x, y: y },
    { x: x + width, y: y },
    { x: x, y: y + height },
    { x: x + width, y: y + height },
  ]

  positions.forEach(pos => {
    gameState.addParticle({
      x: pos.x,
      y: pos.y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 0,
      maxLife: 10,
      color: COLORS.neonBlue,
      size: 2,
    })
  })
}

/**
 * Update all particles
 */
export function updateParticles(): void {
  gameState.updateParticles()
}

/**
 * Clear all particles
 */
export function clearParticles(): void {
  gameState.clearParticles()
}
