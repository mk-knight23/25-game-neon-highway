# Car Racing Game Upgrade

## What This Is

A portfolio-quality 2D vertical scrolling car racing game for web browsers. Players dodge incoming traffic while surviving as long as possible. The game runs on both desktop (keyboard) and mobile (touch) with responsive design and progressive difficulty.

## Core Value

The game must feel **professional and polished** — something you're proud to share as portfolio work that demonstrates strong frontend development skills.

## Requirements

### Validated

- ✓ **Basic gameplay** — Player car dodges incoming enemy cars — existing
- ✓ **Game loop** — Smooth 60fps rendering with requestAnimationFrame — existing
- ✓ **Controls** — Arrow keys (desktop) and touch buttons (mobile) — existing
- ✓ **Collision detection** — Game over on impact with visual feedback — existing
- ✓ **Scoring** — Score increases over time, high score persisted to localStorage — existing
- ✓ **Difficulty scaling** — Speed increases every 500 points — existing
- ✓ **Start/restart flow** — Clear game states (start screen → playing → game over → restart) — existing
- ✓ **Responsive layout** — Works on different screen sizes — existing

### Active

- [ ] **Code quality improvements** — Enable TypeScript strict mode, fix type safety issues
- [ ] **Remove tech debt** — Delete unused dependencies (clsx, tailwind-merge) and unused asset (car1.png)
- [ ] **Consistent naming** — Standardize function naming (all camelCase)
- [ ] **Mobile controls fix** — Fix media query logic so touch controls actually appear on mobile
- [ ] **Gameplay variety** — Power-ups, obstacles, different car types
- [ ] **Progression system** — Levels, unlockables, achievements
- [ ] **Visual polish** — Better animations, particle effects, screen shake, smooth transitions
- [ ] **Sound effects** — Engine sounds, collision sounds, power-up sounds
- [ ] **Unit tests** — Core game logic coverage (collision detection, movement, scoring)

### Out of Scope

- **Canvas/WebGL rendering** — DOM-based is sufficient and demonstrates CSS skills
- **Multiplayer** — Single-player only (keeps complexity manageable)
- **Paid features** — Free portfolio piece
- **Backend/APIs** — Fully client-side, deployable to static hosting
- **Mobile app stores** — Web-only

## Context

**Current state:** Functional but basic car racing game with identified technical debt.

**Existing tech stack:** TypeScript 5.9.3, Vite 6, Tailwind CSS v4, DOM-based rendering.

**Known issues (from codebase analysis):**
- TypeScript strict mode disabled
- No unit tests
- Unused dependencies (clsx, tailwind-merge)
- Unused asset file (car1.png, 20KB)
- Mobile controls media query bug (controls hidden at max-width: 500px)
- Mixed function naming conventions (Start vs moveLines)
- Potential memory leaks on game restart

**Portfolio goals:** Demonstrate:
- Clean, maintainable TypeScript code
- Professional visual design and animations
- Thoughtful game mechanics
- Cross-platform (desktop/mobile) consideration
- Performance optimization

## Constraints

- **No heavy game engines** — Vanilla JS/TypeScript only (shows fundamental skills)
- **Static deployment** — Must work on GitHub Pages, Vercel, or Netlify without server
- **Existing stack** — Keep TypeScript, Vite, and Tailwind CSS
- **Browser compatibility** — Modern browsers with ESNext support
- **Performance** — Must maintain 60fps on average hardware
- **Code quality** — Must pass TypeScript strict mode

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep DOM-based rendering | Demonstrates CSS skills, sufficient for 2D simple game | — Pending |
| Add gameplay variety first | Core engagement driver, demonstrates game design skills | — Pending |
| Portfolio piece priority | Polished visuals and clean code matter more than massive scope | — Pending |

---
*Last updated: 2026-01-29 after initialization*
