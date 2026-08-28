import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: true, port: 4173 },
  preview: { host: true, port: 4173 },
  build: {
    // Phaser is intentionally large; keep it cacheable and separate from game code.
    chunkSizeWarningLimit: 1300,
    rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } },
  },
});
