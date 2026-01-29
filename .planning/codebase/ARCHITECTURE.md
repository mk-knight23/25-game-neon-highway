# Architecture

**Analysis Date:** 2026-01-29

## Pattern Overview

**Overall:** Component-based Game Architecture

**Key Characteristics:**
- Single-page application with modular game components
- Event-driven input handling with keyboard and mobile support
- Game state management through a centralized player object
- Collision detection for game mechanics
- Progressive difficulty scaling

## Layers

**Presentation Layer:**
- Purpose: Render game elements and UI
- Location: `/Users/mkazi/60 Projects/25-game-js-car-racing/index.html` and `/Users/mkazi/60 Projects/25-game-js-car-racing/src/style.css`
- Contains: HTML structure, CSS styling, visual game elements
- Depends on: DOM manipulation, Tailwind CSS
- Used by: JavaScript game logic

**Game Logic Layer:**
- Purpose: Core game mechanics and state management
- Location: `/Users/mkazi/60 Projects/25-game-js-car-racing/src/main.ts`
- Contains: Game loop, collision detection, enemy AI, scoring system
- Depends on: DOM API, requestAnimationFrame, localStorage
- Used by: Presentation layer

**Input Handling Layer:**
- Purpose: Process user input and controls
- Location: `/Users/mkazi/60 Projects/25-game-js-car-racing/src/main.ts` (lines 32-76)
- Contains: Keyboard event listeners, mobile touch controls
- Depends on: DOM event system
- Used by: Game Logic layer

## Data Flow

**Game Initialization Flow:**

1. Start button click triggers `Start()` function
2. Game area is cleared and game state is reset
3. Road lines are created and positioned
4. Player car is created and positioned
5. Enemy cars are created with random positions and colors
6. Game loop starts via `requestAnimationFrame`

**Game Loop Flow:**

1. Check if game is active (`player.Start`)
2. Update road lines position
3. Move enemy cars and check collisions
4. Process player input and update player position
5. Update score and difficulty
6. Request next animation frame
7. Repeat until collision or game end

**State Management:**
- Centralized player state object containing position, score, speed, and game status
- Input state stored in keys object
- High score persisted in localStorage

## Key Abstractions

**Game State Interface:**
```typescript
interface PlayerState {
    Start: boolean;
    Score: number;
    speed: number;
    x: number;
    y: number;
}
```
- Purpose: Represents current game state
- Examples: `[src/main.ts:15-21]`
- Pattern: TypeScript interface with clear state properties

**Game Element Interface:**
```typescript
interface GameElement extends HTMLElement {
    y?: number;
}
```
- Purpose: Extends HTMLElement with custom game properties
- Examples: `[src/main.ts:10-12]`
- Pattern: Interface inheritance to add game-specific attributes

## Entry Points

**HTML Entry Point:**
- Location: `/Users/mkazi/60 Projects/25-game-js-car-racing/index.html`
- Triggers: Page load initializes DOM elements
- Responsibilities: Load game interface and scripts

**Game Initialization:**
- Location: `/Users/mkazi/60 Projects/25-game-js-car-racing/src/main.ts` (line 189)
- Triggers: Start screen click
- Responsibilities: Set up game world, create elements, start game loop

## Error Handling

**Strategy:** Defensive programming with collision detection

**Patterns:**
- Collision detection function `isCollide()` for game-over logic
- Boundary checking for player movement
- Event validation to prevent default browser behaviors

## Cross-Cutting Concerns

**Logging:** Not implemented - game uses visual feedback only

**Validation:** Input validation ensures only arrow keys affect movement

**Authentication:** Not applicable - single-player game

---

*Architecture analysis: 2026-01-29*