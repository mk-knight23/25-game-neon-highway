/**
 * Canvas Renderer
 * Handles all canvas drawing operations
 */

import { gameState } from '../core/state'
import { COLORS, RENDER_CONFIG, BOOST_CONFIG } from '../core/constants'
import { visualEffects } from '../visual/effects'
import { getLevelProgress } from '../game/difficulty'
import { comboSystem } from '../game/comboSystem'

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get canvas context')
    this.ctx = ctx
  }

  /**
   * Clear the canvas
   */
  public clear(): void {
    // Update visual effects
    visualEffects.update()

    // Get shake offset
    const shake = visualEffects.getShakeOffset()

    // Save context state
    this.ctx.save()

    // Apply shake
    if (shake.x !== 0 || shake.y !== 0) {
      this.ctx.translate(shake.x, shake.y)
    }

    // Clear with background color
    this.ctx.fillStyle = COLORS.darkBg
    this.ctx.fillRect(-10, -10, this.canvas.width + 20, this.canvas.height + 20)
  }

  /**
   * Draw the road
   */
  public drawRoad(): void {
    const { width, height } = gameState.getRoadDimensions()
    const roadWidth = width
    const roadX = (this.canvas.width - roadWidth) / 2

    // Road background
    this.ctx.fillStyle = COLORS.roadColor
    this.ctx.fillRect(roadX, 0, roadWidth, height)

    // Road edges with glow
    this.ctx.shadowColor = COLORS.neonCyan
    this.ctx.shadowBlur = RENDER_CONFIG.glowAmount
    this.ctx.strokeStyle = COLORS.neonCyan
    this.ctx.lineWidth = 3

    // Left edge
    this.ctx.beginPath()
    this.ctx.moveTo(roadX, 0)
    this.ctx.lineTo(roadX, height)
    this.ctx.stroke()

    // Right edge
    this.ctx.beginPath()
    this.ctx.moveTo(roadX + roadWidth, 0)
    this.ctx.lineTo(roadX + roadWidth, height)
    this.ctx.stroke()

    this.ctx.shadowBlur = 0

    // Draw lane dividers
    this.drawLaneDividers(roadX, roadWidth, height)

    // Draw road lines
    this.drawRoadLines(roadX, roadWidth)
  }

  /**
   * Draw lane dividers
   */
  private drawLaneDividers(roadX: number, roadWidth: number, height: number): void {
    const laneCount = 4
    const laneWidth = roadWidth / laneCount

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([40, 40])

    for (let i = 1; i < laneCount; i++) {
      const x = roadX + laneWidth * i

      this.ctx.beginPath()
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, height)
      this.ctx.stroke()
    }

    this.ctx.setLineDash([])
  }

  /**
   * Draw animated road lines
   */
  private drawRoadLines(roadX: number, roadWidth: number): void {
    const lines = gameState.getRoadLines()
    const laneWidth = roadWidth / 4

    this.ctx.fillStyle = COLORS.neonCyan
    this.ctx.shadowColor = COLORS.neonCyan
    this.ctx.shadowBlur = 10

    lines.forEach(line => {
      const lineWidth = 8
      const lineHeight = line.height

      // Draw center line segments in each lane
      for (let i = 0; i < 4; i++) {
        const x = roadX + laneWidth * i + laneWidth / 2 - lineWidth / 2
        this.ctx.fillRect(x, line.y, lineWidth, lineHeight)
      }
    })

    this.ctx.shadowBlur = 0
  }

  /**
   * Draw the player car
   */
  public drawPlayer(): void {
    const player = gameState.getPlayer()
    const { width: roadWidth } = gameState.getRoadDimensions()
    const roadX = (this.canvas.width - roadWidth) / 2
    const x = roadX + player.x
    const y = player.y

    // Draw shield if active
    if (gameState.getState().shieldActive) {
      this.ctx.shadowColor = COLORS.neonBlue
      this.ctx.shadowBlur = 30
      this.ctx.strokeStyle = COLORS.neonBlue
      this.ctx.lineWidth = 3
      this.ctx.beginPath()
      this.ctx.arc(
        x + player.width / 2,
        y + player.height / 2,
        player.width * 0.8,
        0,
        Math.PI * 2
      )
      this.ctx.stroke()
      this.ctx.shadowBlur = 0
    }

    // Car body - futuristic design
    this.ctx.shadowColor = player.boostActive ? COLORS.neonGreen : COLORS.neonCyan
    this.ctx.shadowBlur = player.boostActive ? 30 : 20

    // Main body
    this.ctx.fillStyle = player.boostActive ? COLORS.neonGreen : COLORS.darkBg
    this.ctx.fillRect(x + 5, y, player.width - 10, player.height)

    // Neon outline
    this.ctx.strokeStyle = player.boostActive ? COLORS.neonGreen : COLORS.neonCyan
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(x + 5, y, player.width - 10, player.height)

    // Windshield
    this.ctx.fillStyle = COLORS.neonBlue
    this.ctx.fillRect(x + 10, y + 10, player.width - 20, 20)

    // Rear lights
    this.ctx.fillStyle = COLORS.neonMagenta
    this.ctx.shadowColor = COLORS.neonMagenta
    this.ctx.shadowBlur = 15
    this.ctx.fillRect(x + 8, y + player.height - 10, 12, 6)
    this.ctx.fillRect(x + player.width - 20, y + player.height - 10, 12, 6)

    // Headlights glow
    this.ctx.shadowColor = COLORS.neonCyan
    this.ctx.shadowBlur = 20
    this.ctx.fillStyle = COLORS.neonCyan
    this.ctx.fillRect(x + 8, y, 10, 5)
    this.ctx.fillRect(x + player.width - 18, y, 10, 5)

    this.ctx.shadowBlur = 0
  }

  /**
   * Draw enemy cars
   */
  public drawEnemies(): void {
    const enemies = gameState.getEnemies()
    const { width: roadWidth } = gameState.getRoadDimensions()
    const roadX = (this.canvas.width - roadWidth) / 2
    const time = Date.now() / 1000

    enemies.forEach(enemy => {
      const x = roadX + enemy.x
      const y = enemy.y

      // Enemy glow with pulse for shooters
      if (enemy.type === 'shooter') {
        const pulse = Math.sin(time * 5) * 0.3 + 0.7
        this.ctx.shadowColor = enemy.color
        this.ctx.shadowBlur = 25 * pulse
      } else {
        this.ctx.shadowColor = enemy.color
        this.ctx.shadowBlur = 15
      }

      // Car body
      this.ctx.fillStyle = COLORS.darkBg
      this.ctx.fillRect(x + 5, y, enemy.width - 10, enemy.height)

      // Neon outline
      this.ctx.strokeStyle = enemy.color
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(x + 5, y, enemy.width - 10, enemy.height)

      // Type-specific details
      if (enemy.type === 'fast') {
        // Sleek design for fast cars
        this.ctx.fillStyle = enemy.color
        this.ctx.fillRect(x + 10, y + enemy.height - 15, enemy.width - 20, 10)
        // Speed lines
        this.ctx.strokeStyle = enemy.color
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.moveTo(x + 5, y + 20)
        this.ctx.lineTo(x - 10, y + 20)
        this.ctx.stroke()
      } else if (enemy.type === 'tank') {
        // Blocky design for tank cars
        this.ctx.fillStyle = enemy.color
        this.ctx.fillRect(x + 5, y + 10, enemy.width - 10, 15)
        this.ctx.fillRect(x + 5, y + enemy.height - 20, enemy.width - 10, 15)
        // Armor plates
        this.ctx.strokeStyle = enemy.color
        this.ctx.lineWidth = 1
        this.ctx.strokeRect(x + 8, y + 8, enemy.width - 16, enemy.height - 16)
      } else if (enemy.type === 'zigzag') {
        // Zigzag pattern
        this.ctx.strokeStyle = enemy.color
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        this.ctx.moveTo(x + 5, y + enemy.height / 2)
        this.ctx.lineTo(x + enemy.width / 2, y + 10)
        this.ctx.lineTo(x + enemy.width - 5, y + enemy.height / 2)
        this.ctx.lineTo(x + enemy.width / 2, y + enemy.height - 10)
        this.ctx.closePath()
        this.ctx.stroke()
      } else if (enemy.type === 'shooter') {
        // Shooter with targeting reticle
        this.ctx.fillStyle = enemy.color
        this.ctx.fillRect(x + 10, y + enemy.height - 10, 12, 6)
        this.ctx.fillRect(x + enemy.width - 22, y + enemy.height - 10, 12, 6)
        // Targeting reticle above car
        this.ctx.strokeStyle = enemy.color
        this.ctx.lineWidth = 1
        const reticleY = y - 15
        const reticleSize = 10 + Math.sin(time * 8) * 3
        this.ctx.beginPath()
        this.ctx.arc(x + enemy.width / 2, reticleY, reticleSize, 0, Math.PI * 2)
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.moveTo(x + enemy.width / 2 - reticleSize - 5, reticleY)
        this.ctx.lineTo(x + enemy.width / 2 + reticleSize + 5, reticleY)
        this.ctx.stroke()
      } else {
        // Standard design
        this.ctx.fillStyle = enemy.color
        this.ctx.fillRect(x + 10, y + enemy.height - 10, 12, 6)
        this.ctx.fillRect(x + enemy.width - 22, y + enemy.height - 10, 12, 6)
      }

      this.ctx.shadowBlur = 0
    })
  }

  /**
   * Draw particles
   */
  public drawParticles(): void {
    const particles = gameState.getParticles()
    const { width: roadWidth } = gameState.getRoadDimensions()
    const roadX = (this.canvas.width - roadWidth) / 2

    particles.forEach(particle => {
      const x = roadX + particle.x
      const alpha = 1 - particle.life / particle.maxLife

      this.ctx.globalAlpha = alpha
      this.ctx.fillStyle = particle.color
      this.ctx.shadowColor = particle.color
      this.ctx.shadowBlur = 10

      this.ctx.beginPath()
      this.ctx.arc(x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
    })

    this.ctx.globalAlpha = 1
    this.ctx.shadowBlur = 0
  }

  /**
   * Draw power-ups
   */
  public drawPowerUps(): void {
    const powerUps = gameState.getPowerUps()
    const { width: roadWidth } = gameState.getRoadDimensions()
    const roadX = (this.canvas.width - roadWidth) / 2
    const time = Date.now() / 200

    const colors: Record<string, string> = {
      shield: '#0066ff',
      boost: '#00ff80',
      slowmo: '#8000ff',
      magnet: '#ff00ff',
    }

    const icons: Record<string, string> = {
      shield: '🛡',
      boost: '⚡',
      slowmo: '⏱',
      magnet: '🧲',
    }

    powerUps.forEach(powerUp => {
      if (!powerUp.active) return

      const x = roadX + powerUp.x + 15
      const y = powerUp.y + 15
      const color = colors[powerUp.type] || '#ffffff'

      // Pulsing glow effect
      const pulse = Math.sin(time) * 0.3 + 0.7
      this.ctx.shadowColor = color
      this.ctx.shadowBlur = 20 * pulse

      // Draw outer ring
      this.ctx.strokeStyle = color
      this.ctx.lineWidth = 2
      this.ctx.beginPath()
      this.ctx.arc(x, y, 18, 0, Math.PI * 2)
      this.ctx.stroke()

      // Draw rotating inner ring
      const rotation = time * 0.5
      this.ctx.save()
      this.ctx.translate(x, y)
      this.ctx.rotate(rotation)
      this.ctx.strokeStyle = color
      this.ctx.lineWidth = 1
      this.ctx.beginPath()
      this.ctx.arc(0, 0, 12, 0, Math.PI * 1.5)
      this.ctx.stroke()
      this.ctx.restore()

      // Draw icon
      this.ctx.shadowBlur = 10
      this.ctx.font = '14px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText(icons[powerUp.type] || '⭐', x, y)
    })

    this.ctx.shadowBlur = 0
  }

  /**
   * Draw HUD (score, speed, etc.)
   */
  public drawHUD(): void {
    const state = gameState.getState()
    const canvas = this.canvas

    // Score
    this.ctx.fillStyle = COLORS.textPrimary
    this.ctx.font = 'bold 24px monospace'
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`SCORE: ${state.score}`, 20, 40)

    // High score
    this.ctx.fillStyle = COLORS.textSecondary
    this.ctx.font = '16px monospace'
    this.ctx.fillText(`BEST: ${state.highScore}`, 20, 65)

    // Speed
    this.ctx.fillStyle = state.speed > 15 ? COLORS.neonMagenta : COLORS.textPrimary
    this.ctx.font = 'bold 20px monospace'
    this.ctx.textAlign = 'right'
    this.ctx.fillText(`SPD: ${state.speed.toFixed(1)}`, canvas.width - 20, 40)

    // Level
    this.ctx.fillStyle = COLORS.neonCyan
    this.ctx.fillText(`LVL: ${state.level}`, canvas.width - 20, 65)

    // Level progress bar
    const progress = getLevelProgress()
    const barWidth = 100
    const barHeight = 6
    const barX = canvas.width - 20 - barWidth
    const barY = 80

    // Progress bar background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    this.ctx.fillRect(barX, barY, barWidth, barHeight)

    // Progress bar fill
    const gradient = this.ctx.createLinearGradient(barX, 0, barX + barWidth, 0)
    gradient.addColorStop(0, COLORS.neonCyan)
    gradient.addColorStop(1, COLORS.neonMagenta)
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(barX, barY, barWidth * progress, barHeight)

    // Progress bar glow
    this.ctx.shadowColor = COLORS.neonCyan
    this.ctx.shadowBlur = 10
    this.ctx.fillRect(barX, barY, barWidth * progress, barHeight)
    this.ctx.shadowBlur = 0

    // Combo multiplier display
    const comboInfo = comboSystem.getDisplayInfo()
    if (comboInfo.show) {
      const comboY = 95
      const comboX = canvas.width - 20

      // Combo multiplier with glow
      this.ctx.shadowColor = COLORS.neonMagenta
      this.ctx.shadowBlur = 15
      this.ctx.fillStyle = COLORS.neonMagenta
      this.ctx.font = 'bold 28px monospace'
      this.ctx.textAlign = 'right'
      this.ctx.fillText(`${comboInfo.multiplier.toFixed(1)}x`, comboX, comboY)
      this.ctx.shadowBlur = 0

      // Combo timer bar
      const timerBarWidth = 60
      const timerBarHeight = 4
      const timerBarX = comboX - timerBarWidth
      const timerBarY = comboY + 8

      this.ctx.fillStyle = 'rgba(255, 0, 128, 0.2)'
      this.ctx.fillRect(timerBarX, timerBarY, timerBarWidth, timerBarHeight)

      this.ctx.fillStyle = COLORS.neonMagenta
      this.ctx.fillRect(timerBarX, timerBarY, timerBarWidth * Math.max(0, comboInfo.timerPercent), timerBarHeight)
    }

    // Power-up indicators
    let yOffset = 100
    if (state.shieldActive) {
      const remaining = Math.ceil((state.shieldTime - Date.now()) / 1000)
      this.ctx.fillStyle = COLORS.neonBlue
      this.ctx.font = 'bold 14px monospace'
      this.ctx.textAlign = 'left'
      this.ctx.fillText(`🛡️ SHIELD: ${remaining}s`, 20, yOffset)
      yOffset += 25
    }

    if (state.slowMoActive) {
      const remaining = Math.ceil((state.slowMoTime - Date.now()) / 1000)
      this.ctx.fillStyle = COLORS.neonPurple
      this.ctx.font = 'bold 14px monospace'
      this.ctx.textAlign = 'left'
      this.ctx.fillText(`⏱️ SLOW-MO: ${remaining}s`, 20, yOffset)
    }

    // V3: Boost energy bar
    const player = gameState.getPlayer()
    const boostEnergy = player.boostEnergy
    const boostBarWidth = 120
    const boostBarHeight = 8
    const boostBarX = 20
    const boostBarY = canvas.height - 30

    // Boost bar background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    this.ctx.fillRect(boostBarX, boostBarY, boostBarWidth, boostBarHeight)

    // Boost bar fill with color based on energy level
    const energyPercent = boostEnergy / BOOST_CONFIG.maxEnergy
    const boostColor: string = energyPercent < 0.3 ? COLORS.neonPink : energyPercent < 0.6 ? COLORS.neonCyan : COLORS.neonGreen

    this.ctx.fillStyle = boostColor
    this.ctx.fillRect(boostBarX, boostBarY, boostBarWidth * energyPercent, boostBarHeight)

    // Glow effect when boosting
    if (player.boostActive) {
      this.ctx.shadowColor = boostColor
      this.ctx.shadowBlur = 15
      this.ctx.fillRect(boostBarX, boostBarY, boostBarWidth * energyPercent, boostBarHeight)
      this.ctx.shadowBlur = 0
    }

    // Boost label
    this.ctx.fillStyle = COLORS.textSecondary
    this.ctx.font = '12px monospace'
    this.ctx.textAlign = 'left'
    this.ctx.fillText('BOOST', boostBarX, boostBarY - 5)
  }

  /**
   * Draw pause overlay
   */
  public drawPauseOverlay(): void {
    const canvas = this.canvas

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, canvas.width, canvas.height)

    this.ctx.fillStyle = COLORS.neonCyan
    this.ctx.font = 'bold 48px monospace'
    this.ctx.textAlign = 'center'
    this.ctx.shadowColor = COLORS.neonCyan
    this.ctx.shadowBlur = 20
    this.ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2)

    this.ctx.font = '18px monospace'
    this.ctx.shadowBlur = 0
    this.ctx.fillText('Press ESC to resume', canvas.width / 2, canvas.height / 2 + 40)
  }

  /**
   * Draw flash overlay and restore context
   */
  public postRender(): void {
    // Restore context (undo shake transform)
    this.ctx.restore()

    // Draw flash overlay
    const flashIntensity = visualEffects.getFlashIntensity()
    if (flashIntensity > 0) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity})`
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }
}

/**
 * Initialize canvas with proper sizing
 */
export function initCanvas(canvas: HTMLCanvasElement): CanvasRenderer {
  const container = canvas.parentElement
  if (!container) throw new Error('Canvas has no parent')

  // Set canvas size
  const maxWidth = 500
  const maxHeight = 800

  canvas.width = Math.min(maxWidth, container.clientWidth)
  canvas.height = Math.min(maxHeight, window.innerHeight - 100)

  // Update road dimensions in state
  gameState.setRoadDimensions(400, canvas.height)

  return new CanvasRenderer(canvas)
}
