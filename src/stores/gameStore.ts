import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStore {
  scores: number[];
  gamesPlayed: number;
  highScore: number;
  addScore: (score: number) => void;
  resetStats: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      scores: [],
      gamesPlayed: 0,
      highScore: 0,
      addScore: (score) => set((state: any) => ({
        scores: [...state.scores, score],
        gamesPlayed: state.gamesPlayed + 1,
        highScore: Math.max(state.highScore, score),
      })),
      resetStats: () => set({ scores: [], gamesPlayed: 0, highScore: 0 }),
    }),
    { name: '${REPO}-game' }
  )
);
