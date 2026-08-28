import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: true, port: 4173 },
  preview: { host: true, port: 4173 },
  build: {
    chunkSizeWarningLimit: 1300,
    rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } },
  },
});
