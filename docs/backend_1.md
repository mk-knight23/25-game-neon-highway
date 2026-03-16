# Neon Highway Backend

## Overview
A lightweight Node.js/Express backend provides persistence for high scores and "Ghost" data.

## API Endpoints

### `GET /api/scores`
Returns the top 10 high scores.

### `POST /api/scores`
Submits a new score.
- Body: `{ player: string, score: number, data: string }`

### `GET /api/ghost/:id`
Retrieves a specific ghost recording.

## Storage
Data is stored in `server/data/scores.json` for simplicity and portability.
