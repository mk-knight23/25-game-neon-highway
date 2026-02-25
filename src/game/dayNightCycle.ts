/**
 * Day/Night Cycle System
 * Dynamic lighting that changes over time
 */

import * as THREE from 'three'

export interface TimeOfDay {
  hour: number // 0-24
  minute: number
  dayProgress: number // 0-1
}

export interface CycleConfig {
  enabled: boolean
  cycleDuration: number // Real seconds for full day
  sunIntensity: number
  moonIntensity: number
  ambientIntensity: number
}

export class DayNightCycle {
  private scene: THREE.Scene
  private config: CycleConfig
  private currentTime: TimeOfDay
  private elapsedTime = 0

  // Lights
  private sunLight: THREE.DirectionalLight
  private moonLight: THREE.DirectionalLight
  private ambientLight: THREE.AmbientLight
  private hemisphereLight: THREE.HemisphereLight

  // Sky colors
  private skyColors = {
    dawn: new THREE.Color(0xff7e47), // Orange
    day: new THREE.Color(0x87ceeb), // Sky blue
    dusk: new THREE.Color(0xff6b35), // Red-orange
    night: new THREE.Color(0x0a0a20) // Deep blue-black
  }

  constructor(scene: THREE.Scene, config: Partial<CycleConfig> = {}) {
    this.scene = scene
    this.config = {
      enabled: true,
      cycleDuration: 300, // 5 minutes for full day
      sunIntensity: 1.2,
      moonIntensity: 0.3,
      ambientIntensity: 0.4,
      ...config
    }

    this.currentTime = {
      hour: 6,
      minute: 0,
      dayProgress: 0.25 // Start at 6 AM
    }

    this.setupLights()
  }

  private setupLights(): void {
    // Sun light
    this.sunLight = new THREE.DirectionalLight(0xffffee, this.config.sunIntensity)
    this.sunLight.position.set(50, 100, 50)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.width = 2048
    this.sunLight.shadow.mapSize.height = 2048
    this.sunLight.shadow.camera.near = 0.5
    this.sunLight.shadow.camera.far = 500
    this.scene.add(this.sunLight)

    // Moon light
    this.moonLight = new THREE.DirectionalLight(0x8888ff, this.config.moonIntensity)
    this.moonLight.position.set(-50, 100, -50)
    this.moonLight.visible = false
    this.scene.add(this.moonLight)

    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0x404040, this.config.ambientIntensity)
    this.scene.add(this.ambientLight)

    // Hemisphere light for sky/ground color
    this.hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x444444, 0.6)
    this.scene.add(this.hemisphereLight)
  }

  update(deltaTime: number): void {
    if (!this.config.enabled) return

    this.elapsedTime += deltaTime

    // Calculate time progress
    const dayFraction = deltaTime / this.config.cycleDuration
    this.currentTime.dayProgress = (this.currentTime.dayProgress + dayFraction) % 1

    // Convert to hour (0-24)
    const totalHours = this.currentTime.dayProgress * 24
    this.currentTime.hour = Math.floor(totalHours)
    this.currentTime.minute = Math.floor((totalHours % 1) * 60)

    this.updateLighting()
  }

  private updateLighting(): void {
    const hour = this.currentTime.hour + this.currentTime.minute / 60

    // Sun position (arc across sky)
    const sunAngle = ((hour - 6) / 12) * Math.PI // 6 AM to 6 PM
    const sunHeight = Math.sin(sunAngle)
    const sunHorizontal = Math.cos(sunAngle)

    this.sunLight.position.set(
      sunHorizontal * 100,
      Math.max(0, sunHeight * 100),
      50
    )

    // Moon position (opposite to sun)
    this.moonLight.position.set(
      -sunHorizontal * 100,
      Math.max(0, -sunHeight * 100),
      -50
    )

    // Light intensities based on time
    let sunIntensity = 0
    let moonIntensity = 0
    let ambientIntensity = 0.2
    let skyColor: THREE.Color

    if (hour >= 5 && hour < 7) {
      // Dawn
      const t = (hour - 5) / 2
      sunIntensity = t * this.config.sunIntensity * 0.5
      moonIntensity = (1 - t) * this.config.moonIntensity
      ambientIntensity = 0.2 + t * 0.3
      skyColor = this.skyColors.dawn.clone().lerp(this.skyColors.day, t)
    } else if (hour >= 7 && hour < 17) {
      // Day
      sunIntensity = this.config.sunIntensity
      moonIntensity = 0
      ambientIntensity = this.config.ambientIntensity
      skyColor = this.skyColors.day
    } else if (hour >= 17 && hour < 19) {
      // Dusk
      const t = (hour - 17) / 2
      sunIntensity = (1 - t) * this.config.sunIntensity * 0.5
      moonIntensity = t * this.config.moonIntensity
      ambientIntensity = 0.5 - t * 0.3
      skyColor = this.skyColors.day.clone().lerp(this.skyColors.dusk, t)
    } else {
      // Night
      sunIntensity = 0
      moonIntensity = this.config.moonIntensity
      ambientIntensity = 0.2
      skyColor = this.skyColors.night
    }

    this.sunLight.intensity = sunIntensity
    this.sunLight.visible = sunIntensity > 0

    this.moonLight.intensity = moonIntensity
    this.moonLight.visible = moonIntensity > 0

    this.ambientLight.intensity = ambientIntensity

    // Update hemisphere light colors
    this.hemisphereLight.color.copy(skyColor)
    this.hemisphereLight.groundColor.setHex(
      hour >= 6 && hour < 18 ? 0x444444 : 0x111122
    )
  }

  getCurrentTime(): TimeOfDay {
    return { ...this.currentTime }
  }

  setTime(hour: number, minute: number = 0): void {
    this.currentTime.hour = hour % 24
    this.currentTime.minute = minute % 60
    this.currentTime.dayProgress = (this.currentTime.hour + this.currentTime.minute / 60) / 24
    this.updateLighting()
  }

  getSkyColor(): THREE.Color {
    const hour = this.currentTime.hour + this.currentTime.minute / 60

    if (hour >= 5 && hour < 7) {
      return this.skyColors.dawn.clone().lerp(
        this.skyColors.day,
        (hour - 5) / 2
      )
    } else if (hour >= 7 && hour < 17) {
      return this.skyColors.day.clone()
    } else if (hour >= 17 && hour < 19) {
      return this.skyColors.day.clone().lerp(
        this.skyColors.dusk,
        (hour - 17) / 2
      )
    } else {
      return this.skyColors.night.clone()
    }
  }

  isNight(): boolean {
    const hour = this.currentTime.hour + this.currentTime.minute / 60
    return hour < 6 || hour >= 19
  }

  dispose(): void {
    this.scene.remove(this.sunLight)
    this.scene.remove(this.moonLight)
    this.scene.remove(this.ambientLight)
    this.scene.remove(this.hemisphereLight)

    this.sunLight.dispose()
    this.moonLight.dispose()
    this.ambientLight.dispose()
    this.hemisphereLight.dispose()
  }
}
