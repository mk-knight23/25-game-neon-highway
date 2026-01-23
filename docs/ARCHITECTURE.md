# Architecture: 08-car-racing-game

## Overview
A high-performance interstellar racing game built with Vanilla TypeScript and HTML5 Canvas. The architecture prioritizes a tight game loop and efficient collision detection for a smooth 60FPS experience.

## Tech Stack
-   **Engine**: HTML5 Canvas API
-   **Logic**: Vanilla TypeScript
-   **Build Tool**: Vite 6
-   **Styling**: Tailwind CSS v4 (HUD & UI)
-   **State Management**: Local object-based state (`Player`, `keys`)

## Game Logic
-   **Game Loop**: `requestAnimationFrame` driven loop for physics and rendering.
-   **Collision System**: Axis-Aligned Bounding Box (AABB) detection for vehicle interactions.
-   **Dynamic Difficulty**: Speed increments based on player score thresholds.
-   **Input Handling**: Event-driven keyboard and touch listeners.

## Performance
-   Canvas-based rendering to minimize DOM thrashing during gameplay.
-   Efficient object pooling for road lines and enemy vehicles.
-   Vite-optimized production bundling.
