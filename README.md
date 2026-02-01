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
- **Shooter** (red): Fires energy bolt projectiles at the player

### Projectile System
Shooter enemies fire glowing energy bolts that travel down the screen:
- **2-second cooldown** between shots per shooter
- **Warning indicator** (red glow) appears 800ms before firing
- **Shield power-up** protects from projectile damage
- Projectiles feature **diagonal stripe pattern** for colorblind accessibility
- **Muzzle flash** and screen shake provide visual/audio feedback

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
│   │   ├── projectiles.ts # Projectile system (NEW in V6)
│   │   ├── collision.ts   # Collision detection
│   │   ├── difficulty.ts  # Difficulty scaling
│   │   └── comboSystem.ts # Combo multiplier system
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

---

## 🎉 Recent Updates (V3-V5)

### V3: Boost Energy Economy System
**Why added**: Boost was previously unlimited—players could spam it constantly. This removed strategic depth and made high-score runs feel same-y.

**What changed**: Boost now consumes energy (0-100). Energy regenerates slowly when not boosting. You need at least 20 energy to activate boost. The energy bar is visible in the HUD with color coding (green/orange/pink). This creates resource management decisions—boost becomes a strategic tool rather than a spam button.

### V3: Organic Movement Imperfections
**Why added**: The game felt too "robotic" with perfectly precise movement and instant enemy reactions. This made it feel AI-generated rather than handcrafted.

**What changed**:
- **Enemy hesitation**: New enemies have a random 200-500ms "reaction time" before reaching full speed
- **Player wobble**: Subtle 0.3px jitter during movement creates organic, human-like feel
- These intentional imperfections give the game character without affecting gameplay significantly

### V4: Accessibility Improvements
**Why added**: Games should be playable by everyone, including users with motion sensitivity or those who rely on keyboard navigation.

**What changed**:
- **Reduced motion support**: `prefers-reduced-motion` media query disables animations for sensitive users
- **Focus indicators**: All interactive elements have visible focus states for keyboard navigation
- **Canvas focus**: The game canvas is now focusable with proper `tabindex` and `aria-label`
- **High contrast mode**: Support for `forced-colors: active` to improve visibility

### V6: Shooter Projectile System
**Why added**: The "shooter" enemy type existed but had no unique behavior—it was just a reskin of normal enemies. This made the 5 enemy types feel shallow.

**What changed**:
- **Projectile system**: Shooter enemies now fire glowing energy bolt projectiles at the player
- **Warning indicators**: 800ms before firing, a red glow appears above the shooter (fair warning)
- **Cooldown system**: Each shooter has a 2-second cooldown between shots
- **Visual feedback**: Muzzle flash sparkles and screen shake when projectiles fire
- **Near-miss effects**: Sparkle effects when projectiles barely miss the player
- **Colorblind accessibility**: Projectiles have diagonal white stripe patterns (visible beyond color)
- **Shield protection**: Shield power-up blocks projectiles (maintains power-up value)

### What We Chose NOT to Add (V3-V6)
- **Combo multiplier cap**: Combo system can reach 10x but no hard cap was added. Let skilled players exploit it—the fun is in finding broken strategies.
- **More enemy types**: Considered adding boss enemies or special obstacles. Rejected to keep the game focused. The 5 existing types provide enough variety without bloating the design.
- **Mobile swipe controls**: Virtual D-pad works well. Swipe gestures would be faster to implement but less precise—precision matters in a racing game.

## 🔧 Remaining Improvements

Areas identified for future enhancement:

- **Touch Controls**: Virtual D-pad exists but could be improved with haptic feedback
- **High Score Names**: High scores stored locally without player name tracking
- **Background Music**: Sound effects exist but no background music track
- **Mobile Performance**: Canvas could be optimized for lower-end mobile devices

---

## 📋 Version History

| Version | Date | Changes |
|---------|------|---------|
| V1 | Initial | Core racing game with 3 enemy types |
| V2 | - | Combo system, near-miss bonuses, 5 enemy types |
| V3 | 2025-01-31 | Boost energy economy, organic movement imperfections |
| V4 | 2025-01-31 | Reduced motion support, focus indicators, accessibility |
| V5 | 2025-01-31 | Documentation update, verification complete |
| V6 | 2025-02-01 | **Projectile system**: Shooter enemies fire energy bolts, warning indicators, visual feedback, ARIA accessibility improvements |

