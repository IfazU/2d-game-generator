import { expect, test } from '@playwright/test';
import { serveBuiltGame, waitForPlayableGame } from './support/builtGame';

test.beforeEach(async ({ page }) => {
  await serveBuiltGame(page);
});

const cases = [
  {
    id: 'platformer',
    route: '?archetype=platformer',
    key: 'ArrowRight',
    axis: 'x' as const,
  },
  {
    id: 'top-down',
    route: '?archetype=top-down',
    key: 'ArrowDown',
    axis: 'y' as const,
  },
  { id: 'runner', route: '?archetype=runner', key: null, axis: 'x' as const },
  {
    id: 'forest-platformer example',
    route: '?example=forest-platformer',
    key: 'ArrowRight',
    axis: 'x' as const,
  },
  {
    id: 'robot-top-down example',
    route: '?example=robot-top-down',
    key: 'ArrowDown',
    axis: 'y' as const,
  },
  {
    id: 'space-runner example',
    route: '?example=space-runner',
    key: null,
    axis: 'x' as const,
  },
];

for (const archetype of cases) {
  test(`${archetype.id} boots, plays, and restarts`, async ({ page }) => {
    const fatalErrors: string[] = [];
    page.on('pageerror', (error) => fatalErrors.push(error.message));
    await page.goto(`/${archetype.route}`);
    await expect(page.locator('canvas')).toBeVisible();
    await waitForPlayableGame(page);
    const before = await page.evaluate(() =>
      window.__GAME_DEBUG__!.getPlayerPosition()!,
    );
    if (archetype.key) {
      await page.keyboard.down(archetype.key);
      await page.waitForTimeout(350);
      await page.keyboard.up(archetype.key);
    } else await page.waitForTimeout(450);
    const after = await page.evaluate(() =>
      window.__GAME_DEBUG__!.getPlayerPosition()!,
    );
    expect(after[archetype.axis]).toBeGreaterThan(before[archetype.axis]);
    await page.evaluate(() => window.__GAME_DEBUG__!.restart());
    await waitForPlayableGame(page);
    expect(
      await page.evaluate(() => window.__GAME_DEBUG__!.getEntityCount()),
    ).toBeGreaterThan(3);
    expect(fatalErrors).toEqual([]);
  });
}

for (const archetype of ['platformer', 'runner']) {
  test(`${archetype} jump rises and lands`, async ({ page }) => {
    await page.goto(`/?archetype=${archetype}`);
    await waitForPlayableGame(page);
    await page.waitForFunction(
      () => window.__GAME_DEBUG__?.getCustomState().grounded === true,
    );
    const groundY = await page.evaluate(
      () => window.__GAME_DEBUG__!.getPlayerPosition()!.y,
    );

    await page.keyboard.down('Space');
    await page.waitForFunction(
      (startY) =>
        (window.__GAME_DEBUG__?.getPlayerPosition()?.y ?? startY) < startY - 20,
      groundY,
    );
    await page.keyboard.up('Space');
    await page.waitForFunction(
      (startY) =>
        Math.abs(
          (window.__GAME_DEBUG__?.getPlayerPosition()?.y ?? startY) - startY,
        ) < 2,
      groundY,
    );
  });
}
