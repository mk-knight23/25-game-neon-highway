# Car Racing Game

A fast-paced 2D vertical scrolling car racing game built with vanilla JavaScript and CSS.

## 🎮 How to Play

- **Start**: Click or tap the start screen
- **Controls**: Arrow keys (Up/Down/Left/Right) or touch buttons on mobile
- **Objective**: Avoid incoming cars and survive as long as possible
- **Score**: Points increase with each frame survived
- **Difficulty**: Speed increases every 500 points

## ✨ Features

- Smooth 60fps gameplay with requestAnimationFrame
- 4-directional movement
- Touch controls for mobile devices
- High score persistence (localStorage)
- Increasing difficulty curve
- Responsive design

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 + Custom CSS
- **Renderer**: DOM-based (no canvas)
- **Platform**: Web browser

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
├── index.html          # Main HTML entry
├── src/
│   ├── main.ts         # Game logic
│   └── style.css       # Game styling
├── package.json
└── vite.config.ts
```

## 🎯 Game Mechanics

- **Player Car**: Red sports car, fully controllable
- **Enemy Cars**: Random colors, spawn from top
- **Road**: Center divider with animated dashed lines
- **Collision**: Instant game over on impact
- **Progression**: Speed increases every 500 points

## 📱 Mobile Support

Touch controls appear at the bottom of the screen on mobile devices:
- Up/Down/Left/Right directional buttons
- Optimized for thumb input

## 🌍 Deployment

Deploy to any static hosting service:

```bash
# Build first
npm run build

# Deploy dist/ folder
```

**Recommended Platforms**:
- GitHub Pages (free)
- Vercel (free)
- Netlify (free)

---

Built with vanilla JavaScript - no frameworks required.
