# Neon Highway Architecture

## Overview
Neon Highway is a high-performance 2D racing game built with TypeScript and the HTML5 Canvas API. It follows a modular architecture designed for low latency and high extensibility.

## Components

### Core
- **GameLoop**: Managed via `requestAnimationFrame` for smooth 60fps rendering.
- **State**: A centralized reactive store for game variables (score, speed, entities).
- **Input**: Handles keyboard and touch events with minimal debounce.

### Game Logic
- **Collision**: Spatial grid-based collision detection for performance.
- **Ghost System**: (V3) Records player position data and replays it in subsequent runs.
- **Weather**: (V3) Procedural rain/fog generation that affects road physics.

### Renderer
- **Canvas Renderer**: Optimized batch rendering for neon silhouettes and particle FX.
- **UI Overlay**: Glassmorphic DOM-based UI for menus and HUD.

## Data Flow
1. Input Capture
2. State Update
3. Physics Simulation
4. Render Refresh
