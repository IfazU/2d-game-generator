import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/smoke',
  timeout: 20_000,
  use: { baseURL: 'http://game.test', headless: true },
});
