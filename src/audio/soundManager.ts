/**
 * Sound Manager
 * Web Audio API-based retro synth sounds
 * V3: Loads sound preference from localStorage
 */

import { STORAGE_KEYS } from '../core/constants'

class SoundManager {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private enabled = true
  private volume = 0.3

  constructor() {
    // Load sound preference from storage
    const savedSound = localStorage.getItem(STORAGE_KEYS.soundEnabled)
    if (savedSound !== null) {
      this.enabled = savedSound === 'true'
    }

    // Initialize on first user interaction
    this.init()
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  public init(): void {
    if (this.audioContext) return

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new AudioContext()

      // Create master gain node
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = this.volume
      this.masterGain.connect(this.audioContext.destination)
    } catch (e) {
      console.warn('Web Audio API not supported:', e)
      this.enabled = false
    }
  }

  /**
   * Ensure audio context is running (required after user interaction)
   */
  public resume(): void {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  /**
   * Play a tone with specified frequency and duration
   */
  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume = 1): void {
    if (!this.enabled || !this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

    gainNode.gain.setValueAtTime(volume * 0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  /**
   * Play a noise burst (for explosions)
   */
  private playNoise(duration: number, volume = 1): void {
    if (!this.enabled || !this.audioContext || !this.masterGain) return

    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    noise.buffer = buffer
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime)
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration)

    gainNode.gain.setValueAtTime(volume * 0.4, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    noise.start()
  }

  // === Sound Effects ===

  /**
   * Play engine/idle sound
   */
  public playEngine(): void {
    this.playTone(80, 0.1, 'sawtooth', 0.3)
  }

  /**
   * Play boost sound
   */
  public playBoost(): void {
    if (!this.enabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.3)

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain!)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  /**
   * Play collision/crash sound
   */
  public playCrash(): void {
    this.playNoise(0.4, 0.8)
    this.playTone(150, 0.2, 'square', 0.8)
    this.playTone(100, 0.3, 'sawtooth', 0.6)
  }

  /**
   * Play power-up collect sound
   */
  public playPowerUp(type: 'shield' | 'boost' | 'slowmo' | 'magnet'): void {
    const frequencies: Record<string, number[]> = {
      shield: [440, 554, 659], // A major chord
      boost: [330, 440, 554, 660], // Ascending
      slowmo: [660, 554, 440], // Descending
      magnet: [440, 523, 659, 784], // A major 7th
    }

    const freqs = frequencies[type] || frequencies.shield

    freqs.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'sine', 0.5)
      }, i * 40)
    })
  }

  /**
   * Play score tick sound
   */
  public playScoreTick(): void {
    this.playTone(880, 0.05, 'sine', 0.2)
  }

  /**
   * Play level up sound
   */
  public playLevelUp(): void {
    const notes = [523, 659, 784, 1047] // C major arpeggio

    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'square', 0.4)
      }, i * 80)
    })
  }

  /**
   * Play game over sound
   */
  public playGameOver(): void {
    this.playNoise(0.6, 0.6)
    this.playTone(300, 0.1, 'square', 0.6)
    this.playTone(200, 0.15, 'square', 0.5)
    this.playTone(100, 0.4, 'sawtooth', 0.4)
  }

  /**
   * Play menu select sound
   */
  public playMenuSelect(): void {
    this.playTone(880, 0.1, 'sine', 0.4)
  }

  /**
   * Play menu hover sound
   */
  public playMenuHover(): void {
    this.playTone(440, 0.05, 'sine', 0.2)
  }

  /**
   * Play shield hit sound
   */
  public playShieldHit(): void {
    this.playTone(1200, 0.1, 'sine', 0.5)
    this.playNoise(0.1, 0.3)
  }

  // === Volume Control ===

  /**
   * Set master volume
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume
    }
  }

  /**
   * Mute/unmute sounds
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (this.masterGain) {
      this.masterGain.gain.value = enabled ? this.volume : 0
    }
  }

  /**
   * Get enabled state
   */
  public isEnabled(): boolean {
    return this.enabled
  }
}

// Export singleton
export const soundManager = new SoundManager()
