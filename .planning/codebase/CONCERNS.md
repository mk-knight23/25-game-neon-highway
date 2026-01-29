# Concerns

**Analysis Date:** 2026-01-29

## Technical Debt

**TypeScript Strict Mode Disabled:**
- Location: `tsconfig.json:11`
- Impact: Missing type safety, potential runtime errors
- Priority: Medium
- Fix: Enable `"strict": true` and fix resulting type errors

**Magic Numbers:**
- Location: Throughout `src/main.ts`
- Examples: Road width (400), car dimensions (50, 90), speed increments (500)
- Impact: Hardcoded values difficult to tune
- Priority: Low
- Fix: Extract to named constants

**No Unit Tests:**
- Impact: No regression safety for refactoring
- Priority: High
- Fix: Add tests for collision detection, movement logic

## Bugs

**None detected** - Game appears functional during analysis

## Security

**localStorage Key Collision:**
- Location: `src/main.ts:26`, `src/main.ts:166`
- Issue: Generic key `car_racing_highscore` could conflict with other apps on same domain
- Impact: Low - only affects co-hosted apps
- Priority: Low
- Fix: Use namespaced key like `25-game-js-car-racing_highscore`

**No Input Sanitization:**
- Location: `src/main.ts` - HTML string in `endGame()`
- Issue: Template literal with user-controlled score inserted directly
- Impact: Low - score is numeric, but pattern is fragile
- Priority: Low
- Fix: Use textContent instead of innerHTML where possible

## Performance

**DOM Manipulation in Game Loop:**
- Location: `src/main.ts:126-154` (gameLoop function)
- Issue: QuerySelector calls and style updates every frame
- Impact: Minor - may cause jank on low-end devices
- Priority: Low
- Fix: Cache DOM elements, consider Canvas API

**No Throttling/Debouncing:**
- Location: Input handlers
- Impact: Minimal - keyboard events are well-behaved
- Priority: Not applicable

**Large Asset File:**
- Location: `car1.png` (20KB)
- Issue: File exists but not used (CSS-only cars)
- Impact: Unnecessary bloat
- Priority: Low
- Fix: Delete unused asset

## Fragile Areas

**Mobile Controls Hidden on Small Screens:**
- Location: `src/style.css:228-230`
- Issue: Controls hidden at max-width: 500px, but need at wider sizes
- Impact: Mobile users may not have touch controls
- Priority: High
- Fix: Review media query logic

**Game Loop Cleanup:**
- Location: `src/main.ts:159`
- Issue: `cancelAnimationFrame` called but no cleanup of DOM elements
- Impact: Memory leaks on repeated game starts
- Priority: Medium
- Fix: Clear GameArea before creating new elements

**Global State:**
- Location: `src/main.ts:23-26`
- Issue: `player`, `keys`, `animationId` are module-level globals
- Impact: Difficult to reset, test, or have multiple game instances
- Priority: Low (acceptable for simple game)

## Code Quality Issues

**Mixed Function Naming:**
- Location: Throughout `src/main.ts`
- Issue: Inconsistent use of PascalCase vs camelCase
- Examples: `Start()` vs `moveLines()` vs `getRandomColor()`
- Impact: Code confusion
- Priority: Low
- Fix: Standardize on camelCase for all functions

**ESLint Configured but No Config File:**
- Location: `package.json:8`
- Issue: `"lint": "eslint ."` script but no `.eslintrc.*` file
- Impact: Linting may use inconsistent rules
- Priority: Low
- Fix: Add explicit ESLint configuration

**Unused Dependencies:**
- Location: `package.json:31-32`
- Issue: `clsx` and `tailwind-merge` imported but not used
- Impact: Unnecessary bundle size
- Priority: Low
- Fix: Remove unused dependencies

---

*Concerns analysis: 2026-01-29*
