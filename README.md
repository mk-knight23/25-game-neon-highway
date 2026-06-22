# Neon Highway

A cyber-noir, top-down arcade racing game. Dodge traffic, chain close-call
combos, grab power-ups, and trigger nitro bursts through a neon-lit highway
that cycles from day to night. Runs entirely in the browser on an HTML5
canvas — no backend required to play.

## Gameplay

- **Endless** — survive as long as possible; difficulty and speed ramp up.
- **Time Trial** — score as much as you can in 2 minutes.
- **Zen** — no enemies, just drive.

High scores (per mode) and your settings (sound, theme) are saved to
`localStorage` and restored on the next visit.

## Controls

### Keyboard

| Key | Action |
| --- | --- |
| `←` `→` / `A` `D` | Steer left / right |
| `↑` `↓` / `W` `S` | Accelerate / brake |
| `Space` / `Shift` | Nitro boost |
| `Esc` | Pause / resume |

Nitro drains an energy gauge; if you fully deplete it the nitro enters a
cooldown lockout (shown in red on the HUD) until it recharges.

### Touch

On touch devices, on-screen controls appear automatically: steering buttons
and a pause button on the left, accelerate / brake / nitro on the right.
Multiple buttons can be held at once. The canvas scales to fit the viewport
while preserving its aspect ratio.

## Tech stack

- **Vanilla TypeScript** — no UI framework
- **HTML5 Canvas 2D** for all rendering
- **Vite 6** for dev server and bundling
- **Vitest** + jsdom for unit tests

The game uses a fixed-timestep `requestAnimationFrame` loop. Source is
organized into `core/` (loop, state, input, settings), `game/` (player,
enemies, collision, difficulty, scoring, day/night, weather, combo, etc.),
`renderer/` (canvas drawing) and `ui/` (HTML overlays).

## Run, build, test

```bash
npm install      # install dependencies

npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build locally

npm test         # run the unit tests (Vitest)
npm run test:watch   # tests in watch mode
npm run type-check   # TypeScript type checking, no emit
```

### Tests

Unit tests live in `tests/` and cover the pure game logic:

- `collision.test.ts` — AABB collision detection
- `difficulty.test.ts` — difficulty / level progression
- `scoring.test.ts` — scoring, multipliers, speed thresholds, levels
- `dayNight.test.ts` — day/night tint interpolation
- `settings.test.ts` — settings persistence round-trips

## Deploy

The project builds to a static `dist/` directory and is configured for
Vercel via `vercel.json` (framework: `vite`, output: `dist`, SPA rewrite).
Any static host works — the Vite `base` is `./`, so the build is portable
regardless of the deploy path.

```bash
npm run build    # outputs to dist/
```

## License

MIT
