import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    base: process.env.VERCEL || process.env.NETLIFY ? './' : '/08-car-racing-game/',
})
