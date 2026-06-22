/**
 * Scoring
 * Pure, side-effect-free scoring helpers so they can be unit tested
 * independently of the game state singleton.
 */

// Points awarded per fixed-timestep tick while alive.
export const BASE_TICK_POINTS = 1

// Distance is awarded as speed * (deltaMs / 1000).
export const MS_PER_SECOND = 1000

// Endless mode bumps speed every this many points.
export const SPEED_THRESHOLD_STEP = 500

// Speed increment applied at each threshold.
export const SPEED_THRESHOLD_INCREMENT = 0.5

/**
 * Apply a combo multiplier to the base tick points.
 * Result is floored to keep score an integer.
 */
export function applyComboMultiplier(basePoints: number, multiplier: number): number {
  if (basePoints < 0) return 0
  const safeMultiplier = multiplier > 0 ? multiplier : 1
  return Math.floor(basePoints * safeMultiplier)
}

/**
 * Distance travelled in a single update step.
 */
export function distanceForStep(speed: number, deltaMs: number): number {
  if (speed <= 0 || deltaMs <= 0) return 0
  return (speed * deltaMs) / MS_PER_SECOND
}

/**
 * Given the current score and the last threshold already rewarded,
 * return the next threshold to cross (or null if none reached yet).
 */
export function nextSpeedThreshold(score: number, lastThreshold: number): number | null {
  const candidate = lastThreshold + SPEED_THRESHOLD_STEP
  return score >= candidate ? candidate : null
}

/**
 * Compute the player level purely from score using exponential thresholds.
 * Levels 2..6 unlock at 1000 * n^2 (matching the in-game state logic).
 */
export function levelForScore(score: number): number {
  let level = 1
  for (let i = 0; i < 5; i++) {
    if (score >= 1000 * (i + 1) * (i + 1)) {
      level = i + 2
    }
  }
  return level
}
