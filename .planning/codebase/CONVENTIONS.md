# Coding Conventions

**Analysis Date:** 2026-01-29

## Naming Patterns

**Files:**
- Lowercase with hyphens: `main.ts`, `style.css`
- Descriptive names based on purpose
- No specific naming convention for test files (not detected)

**Functions:**
- PascalCase for constructor functions and class names: `setupMobileControls`
- camelCase for regular functions: `isCollide`, `moveLines`, `gameLoop`
- Clear, descriptive names that indicate purpose

**Variables:**
- camelCase for all variables: `playerState`, `highScore`, `keys`
- Meaningful names that describe state/purpose
- Constants use uppercase with underscores: not detected

**Types:**
- PascalCase for interfaces: `GameElement`, `PlayerState`
- Descriptive names that indicate data structure purpose

## Code Style

**Formatting:**
- EditorConfig or formatter: Not detected
- Indentation: Uses 4 spaces (consistent in code)
- Semicolons: Present (uses TypeScript)

**Linting:**
- ESLint: Configured in package.json
  - Script: `"lint": "eslint ."`
- Rules: Not explicitly defined in config

**TypeScript:**
- Target: ESNext
- Strict mode: Disabled
- No unused locals/parameters: Disabled
- Source maps enabled

## Import Organization

**Order:**
- No strict ordering detected
- Relative imports with `./` prefix
- Third-party imports without aliases

**Path Aliases:**
- Not configured in tsconfig.json

## Error Handling

**Patterns:**
- Type assertions used: `as HTMLElement`
- Optional chaining: Not used
- Null checks: Basic property checks (`keys.hasOwnProperty(e.key)`)
- try/catch blocks: Not detected in main game code
- Error boundaries: Not implemented

## Logging

**Framework:** Console logging
- No logging framework detected
- Debug logging: Not present
- Error handling primarily through game state updates

## Comments

**When to Comment:**
- Section comments for game features:
  ```typescript
  // Collision Detection
  function isCollide(a: HTMLElement, b: HTMLElement): boolean { ... }

  // Animate Road Lines
  function moveLines(): void { ... }
  ```
- Inline comments for complex logic
- Clear separation of game sections

**JSDoc/TSDoc:**
- Not used in the codebase
- Function signatures include type annotations but no documentation

## Function Design

**Size:**
- Functions vary in length (from 3 lines to 30+ lines)
- Single responsibility principle followed in most cases
- Some functions handle multiple concerns (e.g., `endGame` handles UI updates and state)

**Parameters:**
- Limited parameters (typically 0-2)
- Optional parameters: Not used
- Object parameters: Not used

**Return Values:**
- Explicit return types: `void`, `boolean`, `string`
- Consistent return patterns

## Module Design

**Exports:**
- No explicit exports from main.ts
- Single module pattern with global state
- Vite configuration exports default config

**Barrel Files:**
- Not used

---

*Convention analysis: 2026-01-29*
```