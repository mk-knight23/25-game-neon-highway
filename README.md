# Neon Highway Racing

> **A futuristic cyberpunk racing experience with neon-soaked visuals and synthwave aesthetics**

An action-packed 2D vertical scrolling racing game built with TypeScript, Canvas API, and Web Audio API. Dodge enemy vehicles, collect power-ups, and survive as long as possible in this neon-drenched cyberpunk world.

## 🌟 Theme: Futuristic Cyberpunk (Neon Glow)

Immerse yourself in a dystopian future where highways pulse with neon energy. The game features:
- **Neon cyan & magenta color palette** with glowing effects
- **Scanline overlay** for retro-futuristic CRT aesthetic
- **Particle explosions** and visual feedback on every action
- **Synthesized sound effects** using Web Audio API
- **Screen shake & flash effects** for impactful moments

## 🎮 How to Play

### Controls
| Key | Action |
|-----|--------|
| ↑ ↓ ← → | Move player car |
| SPACE | Activate boost |
| ESC | Pause game |

### Objective
- **Endless Mode**: Race forever, go for high score
- **Time Trial**: 2 minutes to score maximum points
- **Zen Mode**: No enemies, just drive and relax

### Power-Ups
| Icon | Power-Up | Effect |
|------|----------|--------|
| 🛡️ | Shield | Invincibility for 5 seconds |
| ⚡ | Boost | Double speed for 3 seconds |
| ⏱️ | Slow-Mo | Slow down enemies for 4 seconds |
| 🧲 | Magnet | Attract power-ups and clear nearby enemies |

### Enemy Types
- **Normal** (cyan): Standard speed, straight movement
- **Fast** (yellow): 2x speed, harder to dodge
- **Tank** (magenta): Larger, slower but worth more points
- **Zigzag** (green): Unpredictable side-to-side movement
- **Shooter** (red): Advanced enemies with special behavior

## ✨ Features

### Core Gameplay
- Smooth 60fps gameplay with fixed timestep game loop
- Canvas-based hardware-accelerated rendering
- Progressive difficulty scaling
- Level-up system (5 levels)
- High score persistence (localStorage)

### Visual Effects
- Particle system with 5+ effect types
- Screen shake on collisions and power-ups
- Flash effects for level-ups and events
- Player trail effect during boost
- Shield glow effect
- Speed lines at high velocity
- Scanline overlay for retro aesthetic

### Audio System
- Web Audio API sound synthesizer
- Retro synth sound effects
- Menu hover/click sounds
- Game over, crash, power-up sounds
- Level-up fanfare
- No external audio files required

### Game Modes
- **Endless**: Race forever with increasing difficulty
- **Time Trial**: 2-minute sprint for maximum score
- **Zen**: Relaxing mode with no enemies

### Mobile Support
- Virtual D-pad controls
- Touch-optimized interface
- Responsive canvas sizing

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Language | TypeScript |
| Build Tool | Vite 6 |
| Renderer | Canvas API (hardware-accelerated 2D) |
| Styling | Tailwind CSS v4 + Custom CSS |
| Audio | Web Audio API (synthesized sounds) |
| State Management | Singleton pattern |
| Architecture | Modular (separation of concerns) |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
25-game-js-car-racing/
├── src/
│   ├── core/
│   │   ├── state.ts       # Centralized game state
│   │   ├── input.ts       # Input handling
│   │   ├── constants.ts   # Game config & colors
│   │   └── gameLoop.ts    # Main game loop
│   ├── renderer/
│   │   └── canvas.ts      # Canvas rendering
│   ├── game/
│   │   ├── player.ts      # Player logic
│   │   ├── enemies.ts     # Enemy spawning & AI
│   │   ├── road.ts        # Road animation
│   │   ├── particles.ts   # Particle system
│   │   ├── powerups.ts    # Power-up spawning
│   │   ├── collision.ts   # Collision detection
│   │   └── difficulty.ts  # Difficulty scaling
│   ├── audio/
│   │   └── soundManager.ts # Sound synthesis
│   ├── visual/
│   │   └── effects.ts     # Screen effects
│   ├── ui/
│   │   └── overlay.ts     # UI overlays
│   ├── types/
│   │   └── game.ts        # Type definitions
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
└── vite.config.ts
```

## 🎯 Game Mechanics

### Scoring
- +1 point per frame survived
- Bonus points for power-ups
- Level multiplier at higher levels

### Difficulty
- Speed increases every 500 points (endless mode)
- New enemy types unlock at higher levels
- Spawn rate increases over time

### Collision
- AABB collision detection
- Shield provides one-hit protection
- Explosion particles on death

## 🌍 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

## 🏆 Credits

**Made by MK — Built by Musharraf Kazi**

---

*A futuristic racing experience that pushes the boundaries of web gaming.*

---

### Live Demo
- GitHub Pages: <https://mk-knight23.github.io/25-Car-Racing/>
- Vercel: [Deploy your own](https://vercel.com/new)
- Netlify: [Deploy your own](https://app.netlify.com/start)

---

## 📝 Design Notes (V2)

### Intentional Quirk: The Rubber-Band AI
V2 refines the AI so opponent cars subtly adjust speed based on player position. Fall behind, and they slow slightly. Get ahead, and they speed up. Not enough to notice consciously, but enough to keep races feeling "close." The quirk: it's not fair, but it feels exciting. Real fair AI would leave struggling players in the dust.

### Tradeoff: No Progress Saving
High scores are local only. No cloud save, no account system. The tradeoff: portability vs. permanence. Your scores live on your device. When you get a new phone, your records reset. Like arcade cabinets—you don't carry your initials to a new machine. Each device is a fresh start.

### What I Chose NOT to Build
No car customization. Every player drives the same red car. Modern racing games have liveries, upgrades, tuning. I didn't build any of that. The decision: equality over expression. Everyone races on identical terms. The only difference is skill.

## 🎉 Additional Features (V3)

Three focused additions to improve quality of life without disrupting the core experience:

### Per-Mode High Scores
**Why added**: Previously, all game modes shared a single high score. This felt unfair—Time Trial scores couldn't compete with endless runs, and Zen mode scores were meaningless comparisons.

**What changed**: Each mode (Endless, Time Trial, Zen) now tracks its own high score separately. The menu displays all three scores side-by-side, giving players clear goals for each mode.

### Sound Toggle
**Why added**: Sometimes you want to play in quiet environments. Previously, sounds were always on after the first interaction.

**What changed**: Added a sound toggle button in the main menu footer. Your preference is saved to localStorage, so the game remembers your choice between sessions.

### Enhanced Pause Menu
**Why added**: Pressing ESC previously just showed a "PAUSED" text with no options. You had to press ESC again to resume.

**What changed**: The pause menu now shows three buttons: Resume (continue playing), Restart (start the run over), and Quit (return to main menu). It also displays your current score and level for quick reference.

### Intentionally Rejected: Volume Slider
I considered adding a volume slider instead of a simple on/off toggle. Rejected because it adds UI complexity for minimal gain. In a fast-paced arcade game, you either want sound or you don't—fine-tuning volume during gameplay is unnecessary friction.

## 🔧 Remaining Improvements

Areas identified for future enhancement:

- **Touch Controls**: Virtual D-pad exists but could be improved with swipe gestures
- **High Score Names**: High scores stored locally without player name tracking
- **Background Music**: Sound effects exist but no background music track
- **Mobile Performance**: Canvas could be optimized for lower-end mobile devices

