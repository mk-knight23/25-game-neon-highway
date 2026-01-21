import { defineConfig } from 'vite';

export default defineConfig({
    base: '/08-car-racing-game/',
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
        open: true,
    }
});
