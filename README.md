# 25-game-neon-highway

**A Cyber-Noir Racing Experience**

Neon Highway is a moody, pulse-pounding racer set in a rain-slicked futuristic cityscape. It's not just about speed; it's about the ghost of your past self and the unforgiving elements.

Built with TypeScript, Canvas API, React 19, and Zustand for a hybrid high-performance game architecture.

---

## 🎮 Live Demos

| Platform | URL |
|----------|-----|
| **Vercel** | [25-game-neon-highway.vercel.app](https://25-game-neon-highway.vercel.app) |
| **Render** | [two5-game-neon-highway.onrender.com](https://two5-game-neon-highway.onrender.com) |

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Presentation Layer                           │
│  React 19 Components (UI Overlay) + Tailwind CSS v4          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   State Management                             │
│  Zustand Store (gameStore) + Canvas Game State                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Game Engine Layer                           │
│  Canvas Renderer + Game Loop + Physics + Collision System      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Visual Effects                               │
│  Bloom FX + Particle Systems + Weather + Day/Night Cycle        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Services                             │
│  Express + Ghost System + Achievement System + Leaderboard      │
└─────────────────────────────────────────────────────────────────┘
```

### Hybrid Architecture

```typescript
{
  architecture: {
    type: "Hybrid (Canvas + React)",
    description: "Canvas for game rendering + React for UI overlay",
    benefits: [
      "High-performance game rendering via Canvas API",
      "Modern React UI for menus, HUD, and overlays",
      "Reactive state management with Zustand",
      "Component-based UI architecture",
      "60fps game loop with React concurrent rendering"
    ]
  }
}
```

### Project Structure

```
25-game-neon-highway/
├── src/
│   ├── audio/                          # Audio system
│   │   ├── audioManager.ts
│   │   └── soundEffects.ts
│   │
│   ├── core/                           # Game core systems
│   │   ├── gameLoop.ts                 # Game loop (requestAnimationFrame)
│   │   ├── state.ts                    # Game state management
│   │   ├── input.ts                    # Input handling
│   │   ├── physics.ts                  # Physics simulation
│   │   └── collision.ts                # Collision detection
│   │
│   ├── game/                           # Game logic
│   │   ├── player.ts                   # Player controller
│   │   ├── enemy.ts                    # Enemy logic
│   │   ├── powerup.ts                  # Power-up system
│   │   ├── weather.ts                  # Weather system
│   │   └── ghost.ts                    # Ghost system
│   │
│   ├── renderer/                       # Rendering system
│   │   ├── canvas.ts                   # Canvas renderer
│   │   ├── bloom.ts                    # Bloom post-processing
│   │   ├── particles.ts               # Particle effects
│   │   └── visualEffects.ts            # Visual effects
│   │
│   ├── stores/                         # Zustand stores
│   │   └── gameStore.ts                # Game state store
│   │
│   ├── pages/                          # React pages
│   │   ├── Game.tsx                    # Game page
│   │   ├── Achievements.tsx            # Achievements page
│   │   └── Stats.tsx                   # Stats page
│   │
│   ├── router/                         # React Router
│   │   └── index.tsx                   # Router configuration
│   │
│   ├── ui/                             # UI overlay
│   │   └── overlay.ts                  # Canvas UI overlay
│   │
│   ├── visual/                         # Visual effects
│   │   ├── dayNight.ts                 # Day/night cycle
│   │   └── weather.ts                  # Weather effects
│   │
│   ├── utils/                          # Utilities
│   │   └── helpers.ts                  # Helper functions
│   │
│   ├── types/                          # TypeScript types
│   │   └── game.ts                     # Game interfaces
│   │
│   ├── main.ts                         # Canvas game entry point
│   ├── main.tsx                        # React entry point
│   ├── style.css                       # Global styles
│   └── index.css                       # Tailwind CSS
│
├── docs/                               # Documentation
│   ├── architecture.md                 # Architecture details
│   └── backend.md                      # Backend implementation
│
├── server/                             # Backend server
│   └── index.js                        # Express server
│
├── .github/workflows/                  # CI/CD pipelines
│
├── public/                             # Static assets
│
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── vercel.json                         # Vercel deployment
└── package.json                        # Dependencies & scripts
```

### Tech Stack

```typescript
{
  frontend: {
    framework: {
      name: "React",
      version: "19.2.3",
      features: [
        "Concurrent rendering",
        "Server components ready",
        "Automatic batching",
        "Suspense",
        "TypeScript support"
      ]
    },
    router: {
      name: "React Router",
      version: "7.13.0",
      features: [
        "Nested routes",
        "Lazy loading",
        "Data routing",
        "Type-safe navigation"
      ]
    },
    buildTool: {
      name: "Vite",
      version: "6.4.1",
      features: [
        "HMR (Hot Module Replacement)",
        "ESBuild-based",
        "Fast development",
        "Optimized production builds"
      ]
    },
    styling: {
      name: "Tailwind CSS",
      version: "4.0.0",
      features: [
        "Dark mode (class strategy)",
        "Responsive utilities",
        "Custom animations",
        "Neon color palette"
      ]
    }
  },
  stateManagement: {
    library: "Zustand",
    version: "5.0.11",
    stores: [
      {
        name: "gameStore",
        purpose: "Game state persistence",
        state: [
          "scores: number[]",
          "gamesPlayed: number",
          "highScore: number"
        ],
        actions: [
          "addScore(score: number): void",
          "resetStats(): void"
        ],
        persistence: "LocalStorage (via zustand/middleware/persist)"
      }
    ]
  },
  gameEngine: {
    platform: {
      name: "HTML5 Canvas API",
      features: [
        "Hardware-accelerated rendering",
        "60fps game loop",
        "Batch rendering",
        "Particle systems",
        "Post-processing effects (Bloom)"
      ]
    },
    language: {
      name: "TypeScript",
      version: "5.9.3",
      features: [
        "Type-safe game logic",
        "Interface definitions",
        "Null safety",
        "Enum support"
      ]
    }
  },
  backend: {
    framework: {
      name: "Express",
      version: "5.2.1",
      features: [
        "REST API",
        "Ghost data storage",
        "Leaderboard",
        "Achievement system"
      ]
    }
  }
}
```

### Game Loop Architecture

```typescript
{
  gameLoop: {
    target: "60 FPS",
    implementation: "requestAnimationFrame",
    pipeline: [
      "Input Processing",
      "State Update",
      "Physics Simulation",
      "Collision Detection",
      "Rendering",
      "Post-Processing"
    ]
  }
}
```

### State Management

```typescript
{
  gameStore: {
    purpose: "Game state persistence and statistics",
    state: {
      scores: "number[] - Array of game scores",
      gamesPlayed: "number - Total games played",
      highScore: "number - Highest score achieved"
    },
    actions: [
      "addScore(score: number): void - Add score to history",
      "resetStats(): void - Reset all statistics"
    ],
    persistence: "LocalStorage (via zustand/middleware/persist)",
    storageKey: "25-game-neon-highway-game"
  },
  gameState: {
    purpose: "Runtime game state",
    states: [
      "menu - Main menu",
      "playing - Game active",
      "paused - Game paused",
      "gameOver - Game over screen"
    ],
    monitoring: "State monitor interval (100ms)"
  }
}
```

### Input System

```typescript
{
  inputSystem: {
    types: [
      "Keyboard (Arrow keys, WASD)",
      "Touch (Mobile)",
      "Gamepad (Future support)"
    ],
    features: [
      "Minimal debounce",
      "Multi-key support",
      "Touch gesture recognition"
    ],
    handlers: {
      "ArrowUp/W": "Accelerate",
      "ArrowDown/S": "Brake/Reverse",
      "ArrowLeft/A": "Steer Left",
      "ArrowRight/D": "Steer Right",
      "Space": "Nitro Boost",
      "Escape": "Pause"
    }
  }
}
```

### Physics System

```typescript
{
  physics: {
    features: [
      "Vehicle dynamics",
      "Friction simulation",
      "Acceleration curves",
      "Collision detection",
      "Boundary constraints"
    ],
    upgradeable: {
      friction: "Vehicle friction coefficient",
      acceleration: "Acceleration rate"
    }
  }
}
```

### Collision Detection

```typescript
{
  collisionSystem: {
    type: "Spatial Grid-based",
    features: [
      "O(n) complexity",
      "Grid-based optimization",
      "Continuous collision detection (future)",
      "Multiple collision types"
    ],
    collisionTypes: [
      "Player vs Enemy",
      "Player vs Power-up",
      "Player vs Obstacle",
      "Ghost vs Ghost"
    ]
  }
}
```

### Rendering System

```typescript
{
  renderer: {
    platform: "HTML5 Canvas 2D",
    features: [
      "Batch rendering",
      "Layer-based rendering",
      "Post-processing (Bloom)",
      "Particle systems",
      "Visual effects"
    ],
    layers: [
      "Background (Sky, Stars)",
      "Far Background (City skyline)",
      "Road surface",
      "Game entities (Player, enemies, power-ups)",
      "Weather effects (Rain, fog)",
      "Particle effects",
      "UI overlay (Speedometer, score)",
      "Post-processing (Bloom, vignette)"
    ]
  }
}
```

### Visual Effects

```typescript
{
  visualEffects: {
    bloom: {
      purpose: "Neon glow effect",
      implementation: "Post-processing pass",
      parameters: {
        threshold: "Brightness threshold",
        intensity: "Glow intensity",
        radius: "Blur radius"
      }
    },
    particles: {
      types: [
        "Rain particles",
        "Exhaust smoke",
        "Nitro trail",
        "Speed lines",
        "Collision sparks"
      ],
      features: [
        "Life span",
        "Velocity",
        "Acceleration",
        "Fading",
        "Scale"
      ]
    },
    weather: {
      types: [
        "Clear",
        "Rain",
        "Fog",
        "Storm"
      ],
      effects: [
        "Road friction changes",
        "Visibility reduction",
        "Particle rendering",
        "Lighting adjustment"
      ]
    },
    dayNightCycle: {
      duration: "5 minutes",
      phases: [
        "Dawn (orange)",
        "Day (blue)",
        "Dusk (red-orange)",
        "Night (deep blue)"
      ],
      effects: [
        "Sky color transition",
        "Light intensity change",
        "Neon visibility adjustment"
      ]
    }
  }
}
```

### Power-up System

```typescript
{
  powerupSystem: {
    types: [
      {
        name: "Shield",
        icon: "🛡️",
        effect: "Temporary invincibility bubble"
      },
      {
        name: "Ghost",
        icon: "👻",
        effect: "Phase through all obstacles"
      },
      {
        name: "Magnet",
        icon: "🧲",
        effect: "Attract and collect nearby items"
      },
      {
        name: "Shockwave",
        icon: "💥",
        effect: "Destroy obstacles in a radius"
      },
      {
        name: "Phase Shift",
        icon: "✨",
        effect: "Temporary invulnerability with visual distortion"
      }
    ],
    features: [
      "Random spawn",
      "Limited duration",
      "Visual indicators",
      "Cooldown system"
    ]
  },
  nitroSystem: {
    speedMultiplier: 2.5,
    visualEffects: [
      "Particle trails",
      "Screen shake",
      "Speed lines"
    ],
    cooldown: 5,
    recharge: "25% per use"
  }
}
```

### Ghost System

```typescript
{
  ghostSystem: {
    version: "V3",
    purpose: "Race against recorded performances",
    features: [
      "Record player position data",
      "Replay ghost runs",
      "Persistent ghost storage",
      "Ghost sharing (export/import)",
      "Leaderboard ghosts"
    ],
    dataStructure: {
      positions: "Array of position data",
      timestamps: "Array of timestamps",
      meta: "Metadata (score, date)"
    },
    exportFormat: "JSON",
    storage: "Backend + LocalStorage"
  }
}
```

### Achievement System

```typescript
{
  achievementSystem: {
    totalAchievements: "15+",
    rarityTiers: [
      "Common",
      "Rare",
      "Epic",
      "Legendary"
    ],
    categories: [
      "Speed",
      "Distance",
      "Score",
      "Combo",
      "Survival",
      "Special"
    ],
    storage: "LocalStorage",
    tracking: "Progress tracking for each achievement"
  },
  sampleAchievements: [
    {
      name: "Speed Demon",
      description: "Reach 200 km/h",
      tier: "Common"
    },
    {
      name: "Hypersonic",
      description: "Reach 400 km/h with nitro",
      tier: "Epic"
    },
    {
      name: "High Score",
      description: "Score 10,000 points",
      tier: "Common"
    },
    {
      name: "Millionaire",
      description: "Score 1,000,000 points",
      tier: "Legendary"
    },
    {
      name: "Combo Master",
      description: "Achieve a 10x combo",
      tier: "Rare"
    },
    {
      name: "Endurance King",
      description: "Play for 30 minutes",
      tier: "Epic"
    },
    {
      name: "World Traveler",
      description: "Travel 100 km total",
      tier: "Rare"
    }
  ]
}
```

### Component Architecture

```typescript
{
  reactComponents: {
    pages: [
      {
        name: "Game",
        purpose: "Main game page",
        features: [
          "Canvas container",
          "Game overlay UI",
          "Score display",
          "Speedometer"
        ]
      },
      {
        name: "Achievements",
        purpose: "Achievement tracking page",
        features: [
          "Achievement list",
          "Progress indicators",
          "Rarity badges"
        ]
      },
      {
        name: "Stats",
        purpose: "Statistics page",
        features: [
          "Game statistics",
          "High scores",
          "Performance graphs"
        ]
      }
    ],
    router: {
      configuration: "React Router 7",
      routes: [
        "/ - Game",
        "/achievements - Achievements",
        "/stats - Statistics"
      ]
    }
  }
}
```

### Audio System

```typescript
{
  audio: {
    types: [
      "Music",
      "Sound Effects",
      "Ambient"
    ],
    features: [
      "Audio manager",
      "Volume control",
      "Background music",
      "Sound effect triggers"
    ]
  }
}
```

### TypeScript Interfaces

```typescript
{
  types: {
    game: {
      player: {
        position: "{ x: number, y: number }",
        velocity: "{ x: number, y: number }",
        speed: "number",
        health: "number",
        score: "number"
      },
      enemy: {
        position: "{ x: number, y: number }",
        velocity: "{ x: number, y: number }",
        type: "string"
      },
      powerup: {
        position: "{ x: number, y: number }",
        type: "'shield' | 'ghost' | 'magnet' | 'shockwave' | 'phase'",
        duration: "number"
      },
      ghost: {
        positions: "{ x: number, y: number }[]",
        timestamps: "number[]",
        meta: {
          score: "number",
          date: "string"
        }
      },
      achievement: {
        id: "string",
        name: "string",
        description: "string",
        tier: "'Common' | 'Rare' | 'Epic' | 'Legendary'",
        unlocked: "boolean",
        progress: "number"
      }
    }
  }
}
```

### UI/UX Design

```typescript
{
  design: {
    aesthetic: "Cyber-Noir",
    features: [
      "Neon silhouettes",
      "Glassmorphic UI",
      "Dark mode focus",
      "Atmospheric lighting",
      "Speedometer jitter (reactive UI)",
      "Rough edge aesthetic"
    ],
    themes: [
      {
        name: "Dark",
        description: "Cyber-noir aesthetic with neon glow",
        colors: ["#00f", "#f0f", "#0ff"]
      },
      {
        name: "Light",
        description: "Bright, clean aesthetic",
        colors: ["#fff", "#333", "#666"]
      }
    ]
  }
}
```

### Performance Optimization

```typescript
{
  performance: {
    targetFPS: 60,
    optimizations: [
      "Spatial grid collision detection",
      "Batch rendering",
      "Object pooling",
      "Lazy loading",
      "Code splitting",
      "Asset optimization"
    ]
  }
}
```

### Error Handling

```typescript
{
  errorHandling: {
    game: {
      type: "Runtime error handling",
      features: [
        "Try-catch blocks",
        "Error logging",
        "Graceful degradation",
        "User-friendly error messages"
      ]
    },
    input: {
      validation: "Input sanitization",
      features: [
        "Type checking",
        "Range validation",
        "Null checks"
      ]
    }
  }
}
```

### Accessibility

```typescript
{
  accessibility: {
    features: [
      "Keyboard navigation",
      "Touch support",
      "Responsive design",
      "Screen reader support (UI)",
      "Color contrast"
    ]
  }
}
```

### Backend Architecture

```typescript
{
  backend: {
    framework: "Express 5.2.1",
    features: [
      "Ghost data storage",
      "Leaderboard",
      "Achievement tracking",
      "REST API",
      "CORS support"
    ],
    endpoints: {
      "/api/ghosts": "Ghost data CRUD",
      "/api/leaderboard": "Leaderboard queries",
      "/api/achievements": "Achievement synchronization"
    },
    middleware: [
      "cors",
      "express.json()",
      "express.static('public')",
      "Error handling"
    ]
  }
}
```

### Build Pipeline

```typescript
{
  build: {
    dev: "npm run dev (Vite dev server)",
    build: "npm run build (tsc && vite build)",
    output: "dist/ directory",
    features: [
      "TypeScript compilation",
      "Code splitting",
      "Tree-shaking",
      "Minification",
      "Optimized bundles"
    ]
  }
}
```

### Environment Variables

```typescript
{
  envVariables: {
    PORT: "Optional - Express server port (default: 3000)"
  }
}
```

### CI/CD Pipeline

```yaml
Push to main → Build → Test → Deploy
     ↓          ↓        ↓        ↓
  Trigger    Vite      Vitest   Multiple
             Build     Tests    Platforms
```

- **Build**: Vite production build
- **Test**: Vitest unit tests
- **Deploy**: Multi-platform deployment

### Multi-Platform Deployment

| Platform | URL | Type |
|----------|-----|------|
| Vercel | https://25-game-neon-highway.vercel.app | Edge Functions |
| Render | https://two5-game-neon-highway.onrender.com | Serverless |

### Extension Points

```typescript
{
  extensions: [
    "Multiplayer support",
    "Additional power-ups",
    "New track themes",
    "Vehicle customization",
    "Achievement leaderboards",
    "Social sharing",
    "Cloud save sync",
    "Gamepad support",
    "VR mode"
  ]
}
```

### Key Architectural Decisions

**Why Hybrid Architecture (Canvas + React)?**
- Canvas provides high-performance game rendering at 60fps
- React provides modern, component-based UI for menus and overlays
- Separation of concerns between game logic and UI
- React concurrent features for smooth UI updates
- Zustand for shared state management

**Why Zustand?**
- Simpler than Redux
- No providers needed
- Excellent TypeScript support
- Built-in persistence middleware
- Easy to test and debug
- Perfect for game state management

**Why TypeScript?**
- Type-safe game logic
- Interface definitions for game entities
- Null safety
- Better IDE support
- Catch errors at compile time

**Why React Router 7?**
- Latest version with data routing
- Type-safe navigation
- Lazy loading support
- Nested routes
- Built-in error boundaries

**Why Canvas API?**
- Hardware-accelerated rendering
- Low-level control over rendering
- Perfect for game loops
- Well-supported across browsers
- Post-processing capabilities

**Why Express Backend?**
- Simple and lightweight
- Easy deployment options
- Ghost data persistence
- Leaderboard functionality
- REST API for future expansion

**Why Vite?**
- Fast development with HMR
- ESBuild-based for speed
- Optimized production builds
- Native ESM support
- Good React/TypeScript integration

### Design Philosophy

```typescript
{
  design: {
    principles: [
      "High performance (60fps)",
      "Cyber-noir aesthetic",
      "Atmospheric visuals",
      "Smooth animations",
      "Responsive design",
      "Accessible gameplay"
    ],
    gameplay: {
      focus: "Racing and skill",
      elements: [
        "Ghost mode",
        "Dynamic weather",
        "Power-ups",
        "Achievements",
        "Nitro system",
        "Day/night cycle"
      ]
    }
  }
}
```

---

## 🌟 Features

### Core Gameplay
- **Ghost Mode**: Race against your previous best performances.
- **Dynamic Weather**: Rain and fog systems that affect car handling.
- **Neon Silhouettes**: A distinct, minimalist visual identity.
- **Upgrade Shop**: Modify your vehicle's friction and acceleration.
- **Persistent Backend**: High scores and ghosts are saved across sessions.
- **Dual Themes**: Fully supported Light and Dark modes.

### 🆕 New Features (V2)

#### 1. Nitro Boost System
- **Adrenaline rush**: Activate nitro for 2.5x speed multiplier
- **Visual effects**: Particle trails, screen shake, and speed lines
- **Strategic gameplay**: Manage nitro charge (25% per use, recharges over time)
- **Cooldown system**: 5 second cooldown between uses
- **Icon**: ⚡

#### 2. Day/Night Cycle
- **Dynamic lighting**: Sun and moon move across the sky
- **Color transitions**: Dawn (orange) → Day (blue) → Dusk (red-orange) → Night (deep blue)
- **Ambient changes**: Lighting intensity adapts to time of day
- **5-minute cycle**: Full day/night cycle every 5 minutes
- **Performance**: Night time reveals neon aesthetics at their best

#### 3. Obstacle Avoidance Power-ups
Five new power-up types to help you navigate traffic:

- **Shield** (🛡️): Temporary invincibility bubble
- **Ghost** (👻): Phase through all obstacles
- **Magnet** (🧲): Attract and collect nearby items
- **Shockwave** (💥): Destroy obstacles in a radius
- **Phase Shift** (✨): Temporary invulnerability with visual distortion

#### 4. Enhanced Multiplayer Ghost Racing
- **Compete against friends**: Download and race against ghost recordings
- **Leaderboard ghosts**: Race against top players' best runs
- **Ghost sharing**: Export/import ghost data via JSON
- **Visual distinction**: Different colors for different ghosts
- **Split-screen comparison**: See your performance vs ghost in real-time

#### 5. Achievement System
- **15+ achievements**: Track your accomplishments
- **Rarity tiers**: Common, Rare, Epic, and Legendary achievements
- **Progress tracking**: See how close you are to unlocking
- **Persistent storage**: Achievements saved to localStorage
- **Categories**: Speed, Distance, Score, Combo, Survival, and Special

**Sample Achievements:**
- ⚡ Speed Demon: Reach 200 km/h
- 🚀 Hypersonic: Reach 400 km/h with nitro
- 🏆 High Score: Score 10,000 points
- 💎 Millionaire: Score 1,000,000 points
- 🔥 Combo Master: Achieve a 10x combo
- 👑 Endurance King: Play for 30 minutes
- 🌍 World Traveler: Travel 100 km total

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start backend server
node server/index.js
```

## 📦 Deployment

### Vercel
1. Import project to [vercel.com](https://vercel.com)
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

### Render
1. Connect repository to Render Dashboard
2. Configure build settings
3. Deploy automatically on push

### Manual Deployment
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

## 📖 Documentation

Detailed technical notes can be found in the [`/docs`](./docs) folder:
- [Architecture](./docs/architecture.md)
- [Backend Implementation](./docs/backend.md)

## 👤 Human Touch

- **Speedometer Jitter**: The UI reacts to the intensity of high-speed racing with subtle imperfections.
- **Cyber-Noir Aesthetic**: Designed with a deliberate "rough" edge to avoid looking AI-generated.

---

*Made by MK — Musharraf Kazi*

## 📝 License

MIT

---

*Last updated: 2026-03-01*
