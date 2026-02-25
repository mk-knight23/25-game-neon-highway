/**
 * Nitro Boost System
 * Provides temporary speed boosts with visual effects
 */

import * as THREE from 'three'
import type { GameState } from '@/types/game'

export interface NitroState {
  available: boolean
  active: boolean
  charge: number // 0-100
  maxCharge: number
  boostMultiplier: number
  duration: number
  cooldown: number
  lastUsed: number
}

export class NitroSystem {
  private state: NitroState
  private scene: THREE.Scene
  private player: THREE.Object3D
  private boostParticles: THREE.Points[] = []
  private trailEffect?: THREE.Mesh
  private screenShakeIntensity = 0

  constructor(scene: THREE.Scene, player: THREE.Object3D) {
    this.scene = scene
    this.player = player
    this.state = {
      available: true,
      active: false,
      charge: 100,
      maxCharge: 100,
      boostMultiplier: 2.5,
      duration: 2000, // ms
      cooldown: 5000, // ms
      lastUsed: 0
    }
    this.createBoostEffects()
  }

  private createBoostEffects(): void {
    // Boost trail particles
    const particleCount = 100
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0

      // Cyan to magenta gradient
      colors[i * 3] = 0 + Math.random() * 1
      colors[i * 3 + 1] = 1 - Math.random()
      colors[i * 3 + 2] = 1
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(geometry, material)
    this.boostParticles.push(particles)
    this.scene.add(particles)

    // Speed lines effect
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(50 * 6) // 50 lines, 2 points each

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 5
      linePositions[i * 6] = Math.cos(angle) * radius
      linePositions[i * 6 + 1] = (Math.random() - 0.5) * 2
      linePositions[i * 6 + 2] = Math.sin(angle) * radius
      linePositions[i * 6 + 3] = Math.cos(angle) * (radius + 10)
      linePositions[i * 6 + 4] = linePositions[i * 6 + 1]
      linePositions[i * 6 + 5] = Math.sin(angle) * (radius + 10)
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0
    })

    this.trailEffect = new THREE.LineSegments(lineGeometry, lineMaterial)
    this.scene.add(this.trailEffect)
  }

  activate(currentTime: number): boolean {
    if (!this.canActivate(currentTime)) return false

    this.state.active = true
    this.state.lastUsed = currentTime
    this.state.charge -= 25 // Use 25% charge per boost

    // Visual feedback
    if (this.trailEffect) {
      this.trailEffect.material.opacity = 0.6
    }

    this.screenShakeIntensity = 0.3

    return true
  }

  canActivate(currentTime: number): boolean {
    const timeSinceLastUse = currentTime - this.state.lastUsed
    return (
      this.state.available &&
      !this.state.active &&
      this.state.charge >= 25 &&
      timeSinceLastUse >= this.state.cooldown
    )
  }

  update(deltaTime: number, currentTime: number, speed: number): number {
    // Recharge nitro over time
    if (!this.state.active && this.state.charge < this.state.maxCharge) {
      this.state.charge = Math.min(
        this.state.maxCharge,
        this.state.charge + deltaTime * 5 // Recharge rate
      )
    }

    // Check if boost duration ended
    if (this.state.active && currentTime - this.state.lastUsed >= this.state.duration) {
      this.state.active = false
      if (this.trailEffect) {
        this.trailEffect.material.opacity = 0
      }
    }

    // Update visual effects
    this.updateEffects(deltaTime, speed)

    // Return speed multiplier
    return this.state.active ? this.state.boostMultiplier : 1
  }

  private updateEffects(deltaTime: number, speed: number): void {
    // Update boost particles
    this.boostParticles.forEach((particles, index) => {
      const positions = particles.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length / 3; i++) {
        // Move particles backward based on speed
        positions[i * 3 + 2] += speed * deltaTime * 2

        // Reset particles that are too far
        if (positions[i * 3 + 2] > 20) {
          positions[i * 3] = this.player.position.x + (Math.random() - 0.5) * 0.5
          positions[i * 3 + 1] = this.player.position.y + (Math.random() - 0.5) * 0.5
          positions[i * 3 + 2] = this.player.position.z - Math.random() * 2
        }
      }

      particles.geometry.attributes.position.needsUpdate = true

      // Show particles only when boosting
      particles.visible = this.state.active
      particles.material.opacity = this.state.active ? 0.8 : 0
    })

    // Update trail effect
    if (this.trailEffect && this.state.active) {
      this.trailEffect.position.copy(this.player.position)
      this.trailEffect.rotation.y += deltaTime * 2
    }

    // Decay screen shake
    this.screenShakeIntensity *= 0.9
  }

  getScreenShake(): THREE.Vector3 {
    if (this.screenShakeIntensity < 0.01) return new THREE.Vector3(0, 0, 0)

    return new THREE.Vector3(
      (Math.random() - 0.5) * this.screenShakeIntensity,
      (Math.random() - 0.5) * this.screenShakeIntensity,
      (Math.random() - 0.5) * this.screenShakeIntensity
    )
  }

  getState(): NitroState {
    return { ...this.state }
  }

  addCharge(amount: number): void {
    this.state.charge = Math.min(this.state.maxCharge, this.state.charge + amount)
  }

  dispose(): void {
    this.boostParticles.forEach(p => {
      this.scene.remove(p)
      p.geometry.dispose()
      ;(p.material as THREE.Material).dispose()
    })

    if (this.trailEffect) {
      this.scene.remove(this.trailEffect)
      this.trailEffect.geometry.dispose()
      ;(this.trailEffect.material as THREE.Material).dispose()
    }
  }
}
