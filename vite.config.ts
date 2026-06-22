import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
// Use root-relative paths everywhere. './' keeps the build portable across
// Vercel, Netlify, and any static host regardless of the deploy path.
export default defineConfig({
  plugins: [tailwindcss()],
  base: './',
})
