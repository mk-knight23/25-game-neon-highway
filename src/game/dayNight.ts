/**
 * Day/Night Tint Cycle
 * Purely visual: gradually shifts an ambient colour overlay over time to
 * suggest a passing day/night cycle on a cyber-noir highway. 2D canvas only.
 */

// Full cycle length in milliseconds (one dusk -> night -> dawn -> day loop).
const CYCLE_DURATION_MS = 90_000

// Tint stops across the cycle phase (0..1). Each is an RGBA overlay painted
// over the whole frame. Alpha is kept low so neon elements stay readable.
interface TintStop {
  at: number // phase position 0..1
  r: number
  g: number
  b: number
  a: number
}

const TINT_STOPS: TintStop[] = [
  { at: 0.0, r: 255, g: 120, b: 40, a: 0.12 }, // dawn — warm amber
  { at: 0.25, r: 80, g: 140, b: 255, a: 0.05 }, // day — cool, faint blue
  { at: 0.5, r: 120, g: 40, b: 160, a: 0.16 }, // dusk — magenta/purple
  { at: 0.75, r: 10, g: 10, b: 40, a: 0.34 }, // night — deep blue, darkest
  { at: 1.0, r: 255, g: 120, b: 40, a: 0.12 }, // back to dawn (loop)
]

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Interpolate the tint for a given cycle phase (0..1).
 * Exported for testing / reuse.
 */
export function tintForPhase(phase: number): { r: number; g: number; b: number; a: number } {
  const p = ((phase % 1) + 1) % 1 // normalise into [0,1)

  for (let i = 0; i < TINT_STOPS.length - 1; i++) {
    const current = TINT_STOPS[i]
    const next = TINT_STOPS[i + 1]
    if (p >= current.at && p <= next.at) {
      const span = next.at - current.at
      const t = span === 0 ? 0 : (p - current.at) / span
      return {
        r: Math.round(lerp(current.r, next.r, t)),
        g: Math.round(lerp(current.g, next.g, t)),
        b: Math.round(lerp(current.b, next.b, t)),
        a: lerp(current.a, next.a, t),
      }
    }
  }

  const last = TINT_STOPS[TINT_STOPS.length - 1]
  return { r: last.r, g: last.g, b: last.b, a: last.a }
}

export class DayNightCycle {
  private startTime: number = Date.now()

  /** Reset the cycle to the start (called on new game). */
  public reset(): void {
    this.startTime = Date.now()
  }

  /** Current phase of the cycle, 0..1. */
  public getPhase(now: number = Date.now()): number {
    return ((now - this.startTime) % CYCLE_DURATION_MS) / CYCLE_DURATION_MS
  }

  /** Paint the ambient tint overlay across the whole canvas. */
  public draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const { r, g, b, a } = tintForPhase(this.getPhase())
    if (a <= 0) return
    ctx.save()
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}

export const dayNightCycle = new DayNightCycle()
