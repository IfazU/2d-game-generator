import { expect, test } from '@playwright/test';
import { serveBuiltGame, waitForPlayableGame } from './support/builtGame';

test.beforeEach(async ({ page }) => {
  await serveBuiltGame(page);
});

test('game shell fills and follows the browser viewport', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1000 });
  await page.goto('/?archetype=platformer');
  await waitForPlayableGame(page);

  await expectFullscreenLayout(page, 820, 1000);

  await page.setViewportSize({ width: 1280, height: 720 });
  await expectFullscreenLayout(page, 1280, 720);
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

async function expectFullscreenLayout(
  page: import('@playwright/test').Page,
  viewportWidth: number,
  viewportHeight: number,
): Promise<void> {
  await page.waitForFunction(
    ({ width, height }) => {
      const container = document.querySelector('#game-container');
      if (!container) return false;
      const bounds = container.getBoundingClientRect();
      return bounds.width === width && bounds.height === height;
    },
    { width: viewportWidth, height: viewportHeight },
  );

  const layout = await page.evaluate(() => {
    const container = document.querySelector('#game-container')!;
    const canvas = document.querySelector('canvas')!;
    const containerBounds = container.getBoundingClientRect();
    const canvasBounds = canvas.getBoundingClientRect();
    return {
      container: {
        x: containerBounds.x,
        y: containerBounds.y,
        width: containerBounds.width,
        height: containerBounds.height,
      },
      canvas: { width: canvasBounds.width, height: canvasBounds.height },
      viewport: { width: innerWidth, height: innerHeight },
      scroll: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
    };
  });

  expect(layout.container).toEqual({
    x: 0,
    y: 0,
    width: viewportWidth,
    height: viewportHeight,
  });
  expect(layout.viewport).toEqual({
    width: viewportWidth,
    height: viewportHeight,
  });
  expect(layout.scroll).toEqual({
    width: viewportWidth,
    height: viewportHeight,
  });
  expect(layout.canvas.width / layout.canvas.height).toBeCloseTo(16 / 9, 2);
  expect(
    Math.abs(layout.canvas.width - viewportWidth) < 1 ||
      Math.abs(layout.canvas.height - viewportHeight) < 1,
  ).toBe(true);
}
