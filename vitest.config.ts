import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // jsdom provides localStorage / window used by the game state singleton.
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
})
