# 25-game-neon-highway

**A Cyber-Noir Racing Experience**

Neon Highway is a moody, pulse-pounding racer set in a rain-slicked futuristic cityscape. It's not just about speed; it's about the ghost of your past self and the unforgiving elements.

---

## 🎮 Live Demos

| Platform | URL |
|----------|-----|
| **Vercel** | [25-game-neon-highway.vercel.app](https://25-game-neon-highway.vercel.app) |
| **Render** | [two5-game-neon-highway.onrender.com](https://two5-game-neon-highway.onrender.com) |

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

## 🛠️ Tech Stack
- **Frontend**: TypeScript, Vite 6, Tailwind CSS v4
- **Backend**: Node.js, Express (Lightweight Persistence)
- **Graphics**: HTML5 Canvas API with custom Bloom FX
- **Three.js**: 3D rendering for enhanced visual effects

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Start the backend: `node server/index.js`

## 📖 Documentation
Detailed technical notes can be found in the [`/docs`](./docs) folder:
- [Architecture](./docs/architecture.md)
- [Backend Implementation](./docs/backend.md)

## 👤 Human Touch
- **Speedometer Jitter**: The UI reacts to the intensity of high-speed racing with subtle imperfections.
- **Cyber-Noir Aesthetic**: Designed with a deliberate "rough" edge to avoid looking AI-generated.

---
*Made by MK — Musharraf Kazi*
