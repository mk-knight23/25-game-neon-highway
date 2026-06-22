/**
 * Settings Persistence
 * Centralized load/save of user settings to localStorage, restored on load.
 * High scores are persisted separately in core/state.ts (per game mode).
 */

import { STORAGE_KEYS } from './constants'

export type ThemeName = 'dark' | 'light'

export interface GameSettings {
  soundEnabled: boolean
  theme: ThemeName
  lastMode: 'endless' | 'timetrial' | 'zen'
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  theme: 'dark',
  lastMode: 'endless',
}

const THEME_KEY = 'neon_highway_theme'

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable (private mode / quota) — fail silently */
  }
}

/**
 * Load persisted settings, falling back to defaults for missing/invalid values.
 */
export function loadSettings(): GameSettings {
  const sound = safeGet(STORAGE_KEYS.soundEnabled)
  const theme = safeGet(THEME_KEY)
  const mode = safeGet(STORAGE_KEYS.settings)

  return {
    soundEnabled: sound === null ? DEFAULT_SETTINGS.soundEnabled : sound === 'true',
    theme: theme === 'light' ? 'light' : 'dark',
    lastMode:
      mode === 'timetrial' || mode === 'zen' || mode === 'endless'
        ? mode
        : DEFAULT_SETTINGS.lastMode,
  }
}

export function saveSoundEnabled(enabled: boolean): void {
  safeSet(STORAGE_KEYS.soundEnabled, enabled.toString())
}

export function saveTheme(theme: ThemeName): void {
  safeSet(THEME_KEY, theme)
}

export function saveLastMode(mode: GameSettings['lastMode']): void {
  safeSet(STORAGE_KEYS.settings, mode)
}

/**
 * Apply persisted settings to the document on boot.
 * Currently restores the theme (sound is restored by the sound manager).
 */
export function applyPersistedSettings(): void {
  const settings = loadSettings()
  document.documentElement.setAttribute('data-theme', settings.theme)
}
