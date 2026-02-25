/**
 * Obstacle Avoidance Power-ups
 * Special power-ups that help players avoid or destroy obstacles
 */

import * as THREE from 'three'
import type { PowerUp } from '@/types/game'

export type AvoidancePowerUpType =
  | 'shield'
  | 'ghost'
  | 'magnet'
  | 'shockwave'
  | 'phase_shift'

export interface AvoidancePowerUp extends PowerUp {
  type: AvoidancePowerUpType
  duration: number
  radius?: number
  strength?: number
}

export class AvoidancePowerUpSystem {
  private scene: THREE.Scene
  private activePowerUps: Map<AvoidancePowerUpType, ActivePowerUp> = new Map()
  private visualEffects: Map<AvoidancePowerUpType, THREE.Object3D> = new Map()

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.createVisualEffects()
  }

  private createVisualEffects(): void {
    // Shield effect
    const shieldGeometry = new THREE.SphereGeometry(1.5, 32, 32)
    const shieldMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial)
    this.visualEffects.set('shield', shield)
    this.scene.add(shield)

    // Ghost effect
    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: 0x8844ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    const ghost = new THREE.Mesh(
      new THREE.SphereGeometry(1.3, 32, 32),
      ghostMaterial
    )
    this.visualEffects.set('ghost', ghost)
    this.scene.add(ghost)

    // Magnet effect
    const magnetGeometry = new THREE.TorusGeometry(2, 0.1, 16, 100)
    const magnetMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const magnet = new THREE.Mesh(magnetGeometry, magnetMaterial)
    magnet.rotation.x = Math.PI / 2
    this.visualEffects.set('magnet', magnet)
    this.scene.add(magnet)

    // Shockwave effect
    const shockwaveGeometry = new THREE.RingGeometry(0.5, 1, 32)
    const shockwaveMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial)
    shockwave.rotation.x = -Math.PI / 2
    this.visualEffects.set('shockwave', shockwave)
    this.scene.add(shockwave)

    // Phase shift effect
    const phaseGeometry = new THREE.BoxGeometry(2, 1, 3)
    const phaseMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending
    })
    const phase = new THREE.Mesh(phaseGeometry, phaseMaterial)
    this.visualEffects.set('phase_shift', phase)
    this.scene.add(phase)
  }

  activate(type: AvoidancePowerUpType, player: THREE.Object3D): void {
    const config = this.getPowerUpConfig(type)
    const active: ActivePowerUp = {
      type,
      startTime: Date.now(),
      endTime: Date.now() + config.duration,
      strength: config.strength || 1,
      radius: config.radius || 2
    }

    this.activePowerUps.set(type, active)
    this.showEffect(type, player, true)
  }

  deactivate(type: AvoidancePowerUpType): void {
    this.activePowerUps.delete(type)
    this.showEffect(type, null, false)
  }

  isActive(type: AvoidancePowerUpType): boolean {
    const active = this.activePowerUps.get(type)
    if (!active) return false

    if (Date.now() > active.endTime) {
      this.deactivate(type)
      return false
    }

    return true
  }

  canAvoidObstacle(
    type: AvoidancePowerUpType,
    obstaclePosition: THREE.Vector3,
    playerPosition: THREE.Vector3
  ): boolean {
    if (!this.isActive(type)) return false

    const active = this.activePowerUps.get(type)!
    const distance = playerPosition.distanceTo(obstaclePosition)

    switch (type) {
      case 'shield':
        return distance < (active.radius || 2)

      case 'ghost':
        return true // Ghost mode avoids everything

      case 'magnet':
        return distance < (active.radius || 3)

      case 'shockwave':
        return distance < (active.radius || 5)

      case 'phase_shift':
        return true // Phase shift avoids everything

      default:
        return false
    }
  }

  update(deltaTime: number, player: THREE.Object3D): void {
    // Update active power-ups
    for (const [type, active] of this.activePowerUps.entries()) {
      if (Date.now() > active.endTime) {
        this.deactivate(type)
        continue
      }

      // Update visual effects
      this.updateEffect(type, player, active)
    }
  }

  private updateEffect(
    type: AvoidancePowerUpType,
    player: THREE.Object3D,
    active: ActivePowerUp
  ): void {
    const effect = this.visualEffects.get(type)
    if (!effect) return

    effect.position.copy(player.position)

    const remaining = active.endTime - Date.now()
    const progress = remaining / (active.endTime - active.startTime)

    switch (type) {
      case 'shield':
        effect.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1)
        ;(effect.material as THREE.Material).opacity = progress * 0.5
        break

      case 'ghost':
        effect.scale.setScalar(1)
        ;(effect.material as THREE.Material).opacity = progress * 0.3
        effect.rotation.y += deltaTime * 2
        break

      case 'magnet':
        effect.rotation.z += deltaTime * 3
        ;(effect.material as THREE.Material).opacity = Math.sin(Date.now() * 0.01) * 0.5 * progress
        break

      case 'shockwave':
        const scale = 1 + (1 - progress) * 5
        effect.scale.set(scale, scale, 1)
        ;(effect.material as THREE.Material).opacity = progress * 0.8
        break

      case 'phase_shift':
        effect.rotation.x += deltaTime
        effect.rotation.y += deltaTime * 0.5
        ;(effect.material as THREE.Material).opacity = Math.abs(Math.sin(Date.now() * 0.01)) * progress
        break
    }
  }

  private showEffect(
    type: AvoidancePowerUpType,
    player: THREE.Object3D | null,
    show: boolean
  ): void {
    const effect = this.visualEffects.get(type)
    if (!effect) return

    if (show && player) {
      effect.position.copy(player.position)
      effect.visible = true
    } else {
      effect.visible = false
    }
  }

  private getPowerUpConfig(type: AvoidancePowerUpType): {
    duration: number
    radius?: number
    strength?: number
  } {
    switch (type) {
      case 'shield':
        return { duration: 5000, radius: 2, strength: 1 }
      case 'ghost':
        return { duration: 3000, strength: 1 }
      case 'magnet':
        return { duration: 8000, radius: 3, strength: 1 }
      case 'shockwave':
        return { duration: 1000, radius: 5, strength: 2 }
      case 'phase_shift':
        return { duration: 4000, strength: 1 }
      default:
        return { duration: 5000, strength: 1 }
    }
  }

  getActivePowerUps(): AvoidancePowerUpType[] {
    return Array.from(this.activePowerUps.keys())
  }

  getPowerUpRemaining(type: AvoidancePowerUpType): number {
    const active = this.activePowerUps.get(type)
    return active ? Math.max(0, active.endTime - Date.now()) : 0
  }

  clear(): void {
    for (const type of this.activePowerUps.keys()) {
      this.deactivate(type)
    }
  }

  dispose(): void {
    this.clear()
    this.visualEffects.forEach(effect => {
      this.scene.remove(effect)
      if (effect.geometry) effect.geometry.dispose()
      if (effect.material) {
        if (Array.isArray(effect.material)) {
          effect.material.forEach(m => m.dispose())
        } else {
          effect.material.dispose()
        }
      }
    })
    this.visualEffects.clear()
  }
}

interface ActivePowerUp {
  type: AvoidancePowerUpType
  startTime: number
  endTime: number
  strength: number
  radius: number
}
