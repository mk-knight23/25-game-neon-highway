# Codebase Structure

**Analysis Date:** 2026-01-29

## Directory Layout

```
/Users/mkazi/60 Projects/25-game-js-car-racing/
├── .git/                 # Git version control
├── .planning/           # Planning documents
│   └── codebase/        # Architecture and structure analysis
├── .vercel/             # Vercel deployment configuration
├── dist/                # Build output directory
├── node_modules/        # Dependencies
├── 25-game-js-car-racing/ # Main game directory (currently empty)
├── car1.png             # Game asset image
├── index.html           # Main entry point
├── package.json         # Project dependencies and scripts
├── README.md            # Project documentation
├── src/                 # Source code
│   ├── main.ts          # Game logic and main script
│   └── style.css        # Game styling with Tailwind CSS
├── tsconfig.json        # TypeScript configuration
└── vercel.json          # Vercel deployment settings
```

## Directory Purposes

**src/:**
- Purpose: Main source code directory
- Contains: TypeScript game logic and CSS styles
- Key files: `main.ts`, `style.css`

**dist/:**
- Purpose: Build output directory
- Contains: Compiled and bundled assets
- Generated: By Vite build process

**node_modules/:**
- Purpose: External dependencies
- Contains: All npm packages

**.planning/codebase/:**
- Purpose: Architecture documentation
- Contains: Analysis documents for future reference

## Key File Locations

**Entry Points:**
- `/Users/mkazi/60 Projects/25-game-js-car-racing/index.html`: Main HTML entry point
- `/Users/mkazi/60 Projects/25-game-js-car-racing/src/main.ts`: Game logic entry point

**Configuration:**
- `/Users/mkazi/60 Projects/25-game-js-car-racing/package.json`: Project dependencies and scripts
- `/Users/mkazi/60 Projects/25-game-js-car-racing/tsconfig.json`: TypeScript configuration
- `/Users/mkazi/60 Projects/25-game-js-car-racing/vite.config.ts`: Build tool configuration

**Core Logic:**
- `/Users/mkazi/60 Projects/25-game-js-car-racing/src/main.ts`: Complete game implementation
- `/Users/mkazi/60 Projects/25-game-js-car-racing/src/style.css`: Game styling

**Testing:**
- Not applicable - no test files present

## Naming Conventions

**Files:**
- kebab-case for HTML and configuration files
- PascalCase for TypeScript main files
- lowercase for asset files

**Functions:**
- PascalCase for main functions (Start, gameLoop, endGame)
- camelCase for utility functions (moveLines, moveEnemies, isCollide)
- snake_case for CSS classes

**Variables:**
- camelCase for most variables (player, keys, animationId)
- PascalCase for DOM elements with type assertion (ScoreEl, HighScoreEl)

**CSS Classes:**
- kebab-case for most classes (.GameArea, .car, .enemy)
- BEM-style for complex elements (.btn-ctrl.up, .btn-ctrl.down)

## Where to Add New Code

**New Game Feature:**
- Primary code: `/Users/mkazi/60 Projects/25-game-js-car-racing/src/main.ts`
- Testing: Not applicable

**New Visual Element:**
- Styling: `/Users/mkazi/60 Projects/25-game-js-car-racing/src/style.css`
- Implementation: Add to main.ts with corresponding CSS

**New Game Mode:**
- Logic: Add to main.ts with new state properties
- UI: Modify index.html and style.css as needed

**New Assets:**
- Images: Place in project root
- Reference: Use in style.css or main.ts

## Special Directories

**dist/:**
- Purpose: Contains built application files
- Generated: Yes - by Vite build process
- Committed: No - should be in .gitignore

**node_modules/:**
- Purpose: Third-party dependencies
- Generated: Yes - by npm install
- Committed: No - should be in .gitignore

---

*Structure analysis: 2026-01-29*