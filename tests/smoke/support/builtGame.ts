import type { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const contentTypes: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
};

export async function serveBuiltGame(page: Page): Promise<void> {
  await page.route('http://game.test/**', async (route) => {
    const url = new URL(route.request().url());
    const requestPath =
      url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const filePath = resolve(process.cwd(), 'dist', requestPath);
    try {
      await route.fulfill({
        body: await readFile(filePath),
        contentType:
          contentTypes[extname(filePath)] ?? 'application/octet-stream',
      });
    } catch {
      await route.fulfill({ status: 404, body: 'Not found' });
    }
  });
}

export async function waitForPlayableGame(page: Page): Promise<void> {
  await page.waitForFunction(
    () => window.__GAME_DEBUG__?.getState().phase === 'playing',
  );
}
