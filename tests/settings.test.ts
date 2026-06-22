import { describe, test, expect, beforeEach } from 'vitest'
import {
  loadSettings,
  saveSoundEnabled,
  saveTheme,
  saveLastMode,
} from '../src/core/settings'

describe('settings persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('returns defaults when nothing is stored', () => {
    const settings = loadSettings()
    expect(settings.soundEnabled).toBe(true)
    expect(settings.theme).toBe('dark')
    expect(settings.lastMode).toBe('endless')
  })

  test('round-trips a saved sound preference', () => {
    saveSoundEnabled(false)
    expect(loadSettings().soundEnabled).toBe(false)

    saveSoundEnabled(true)
    expect(loadSettings().soundEnabled).toBe(true)
  })

  test('round-trips a saved theme', () => {
    saveTheme('light')
    expect(loadSettings().theme).toBe('light')

    saveTheme('dark')
    expect(loadSettings().theme).toBe('dark')
  })

  test('round-trips the last selected mode', () => {
    saveLastMode('zen')
    expect(loadSettings().lastMode).toBe('zen')
  })

  test('falls back to defaults for invalid stored values', () => {
    localStorage.setItem('neon_highway_theme', 'rainbow')
    localStorage.setItem('neon_racing_settings', 'bogus')
    const settings = loadSettings()
    expect(settings.theme).toBe('dark')
    expect(settings.lastMode).toBe('endless')
  })
})
