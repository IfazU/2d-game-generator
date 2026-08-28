import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const contentTypes: Record<string, string> = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

test.beforeEach(async ({ page }) => {
  await page.route('http://game.test/**', async (route) => {
    const url = new URL(route.request().url());
    const requestPath = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const filePath = resolve(process.cwd(), 'dist', requestPath);
    try { await route.fulfill({ body: await readFile(filePath), contentType: contentTypes[extname(filePath)] ?? 'application/octet-stream' }); }
    catch { await route.fulfill({ status: 404, body: 'Not found' }); }
  });
});

const cases = [
  { id: 'platformer', route: '?archetype=platformer', key: 'ArrowRight', axis: 'x' as const },
  { id: 'top-down', route: '?archetype=top-down', key: 'ArrowDown', axis: 'y' as const },
  { id: 'runner', route: '?archetype=runner', key: null, axis: 'x' as const },
  { id: 'forest-platformer example', route: '?example=forest-platformer', key: 'ArrowRight', axis: 'x' as const },
  { id: 'robot-top-down example', route: '?example=robot-top-down', key: 'ArrowDown', axis: 'y' as const },
  { id: 'space-runner example', route: '?example=space-runner', key: null, axis: 'x' as const },
];

for (const archetype of cases) {
  test(`${archetype.id} boots, plays, and restarts`, async ({ page }) => {
    const fatalErrors: string[] = [];
    page.on('pageerror', (error) => fatalErrors.push(error.message));
    await page.goto(`/${archetype.route}`);
    await expect(page.locator('canvas')).toBeVisible();
    await page.waitForFunction(() => window.__GAME_DEBUG__?.getState().phase === 'playing');
    const before = await page.evaluate(() => window.__GAME_DEBUG__!.getPlayerPosition()!);
    if (archetype.key) { await page.keyboard.down(archetype.key); await page.waitForTimeout(350); await page.keyboard.up(archetype.key); } else await page.waitForTimeout(450);
    const after = await page.evaluate(() => window.__GAME_DEBUG__!.getPlayerPosition()!);
    expect(after[archetype.axis]).toBeGreaterThan(before[archetype.axis]);
    await page.evaluate(() => window.__GAME_DEBUG__!.restart());
    await page.waitForFunction(() => window.__GAME_DEBUG__?.getState().phase === 'playing');
    expect(await page.evaluate(() => window.__GAME_DEBUG__!.getEntityCount())).toBeGreaterThan(3);
    expect(fatalErrors).toEqual([]);
  });
}
