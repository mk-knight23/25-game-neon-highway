import { describe, test, expect, vi } from 'vitest'

// jsdom lacks canvas 2d context; stub it so renderer construction doesn't throw.
beforeAllStubs()

function beforeAllStubs(): void {
  if (typeof HTMLCanvasElement !== 'undefined') {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      rotate: vi.fn(),
      setLineDash: vi.fn(),
      strokeRect: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      fillText: vi.fn(),
      closePath: vi.fn(),
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext
  }
}

describe('smoke: core modules initialize', () => {
  test('game state singleton constructs with sane defaults', async () => {
    const { gameState } = await import('../src/core/state')
    expect(gameState.getCurrentState()).toBe('menu')
    expect(gameState.getPlayer().boostEnergy).toBeGreaterThan(0)
    expect(gameState.getPlayer().boostCooldown).toBe(false)
  })

  test('day/night cycle produces a phase in range', async () => {
    const { dayNightCycle } = await import('../src/game/dayNight')
    const phase = dayNightCycle.getPhase()
    expect(phase).toBeGreaterThanOrEqual(0)
    expect(phase).toBeLessThan(1)
  })
})
