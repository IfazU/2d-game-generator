import { expect, test, type Page } from '@playwright/test';
import { serveBuiltGame, waitForPlayableGame } from './support/builtGame';

async function action(page: Page, name: string): Promise<void> {
  await page.evaluate((actionName) => {
    window.__GAME_DEBUG__!.runAction(actionName);
  }, name);
  await page.waitForTimeout(120);
}

test.beforeEach(async ({ page }) => {
  await serveBuiltGame(page);
});

test('Sunny Springs covers movement, progression, danger, win, loss, and restart', async ({
  page,
}) => {
  const fatalErrors: string[] = [];
  page.on('pageerror', (error) => fatalErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') fatalErrors.push(message.text());
  });

  await page.goto('/?game=sunny-springs');
  await expect(page.locator('canvas')).toBeVisible();
  await waitForPlayableGame(page);
  expect(
    await page.evaluate(() => window.__GAME_DEBUG__!.getActiveScene()),
  ).toBe('sunny-springs');

  const start = await page.evaluate(() =>
    window.__GAME_DEBUG__!.getPlayerPosition()!,
  );
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(360);
  await page.keyboard.up('ArrowRight');
  await page.waitForTimeout(400);
  const moved = await page.evaluate(() =>
    window.__GAME_DEBUG__!.getPlayerPosition()!,
  );
  expect(moved.x).toBeGreaterThan(start.x + 40);

  await page.keyboard.down('Space');
  await page.waitForFunction(
    (groundY) => window.__GAME_DEBUG__!.getPlayerPosition()!.y < groundY - 10,
    moved.y,
  );
  await page.keyboard.up('Space');
  const jumped = await page.evaluate(() =>
    window.__GAME_DEBUG__!.getPlayerPosition()!,
  );
  expect(jumped.y).toBeLessThan(moved.y - 10);

  await action(page, 'visitCollectible');
  expect(await page.evaluate(() => window.__GAME_DEBUG__!.getScore())).toBe(
    100,
  );
  expect(
    await page.evaluate(
      () => window.__GAME_DEBUG__!.getCustomState().collected,
    ),
  ).toBe(1);

  const healthBeforeEnemy = await page.evaluate(() =>
    window.__GAME_DEBUG__!.getHealth(),
  );
  await action(page, 'visitEnemy');
  expect(
    await page.evaluate(() => window.__GAME_DEBUG__!.getHealth()),
  ).toBeLessThan(healthBeforeEnemy);

  await page.waitForTimeout(950);
  const healthBeforeHazard = await page.evaluate(() =>
    window.__GAME_DEBUG__!.getHealth(),
  );
  await action(page, 'visitHazard');
  expect(
    await page.evaluate(() => window.__GAME_DEBUG__!.getHealth()),
  ).toBeLessThan(healthBeforeHazard);

  await page.evaluate(() => window.__GAME_DEBUG__!.restart());
  await waitForPlayableGame(page);
  expect(await page.evaluate(() => window.__GAME_DEBUG__!.getScore())).toBe(0);
  expect(await page.evaluate(() => window.__GAME_DEBUG__!.getHealth())).toBe(3);

  const enemiesBeforeStomp = await page.evaluate(
    () => window.__GAME_DEBUG__!.getCustomState().enemiesRemaining,
  );
  await action(page, 'stompEnemy');
  await page.waitForFunction(
    (expected) =>
      window.__GAME_DEBUG__!.getCustomState().enemiesRemaining === expected,
    (enemiesBeforeStomp as number) - 1,
  );
  expect(
    await page.evaluate(
      () => window.__GAME_DEBUG__!.getCustomState().enemiesRemaining,
    ),
  ).toBe((enemiesBeforeStomp as number) - 1);
  expect(await page.evaluate(() => window.__GAME_DEBUG__!.getScore())).toBe(
    250,
  );

  for (let item = 0; item < 6; item += 1) {
    await action(page, 'visitCollectible');
  }
  expect(
    await page.evaluate(
      () => window.__GAME_DEBUG__!.getCustomState().collected,
    ),
  ).toBe(6);
  await action(page, 'visitFinish');
  expect(await page.evaluate(() => window.__GAME_DEBUG__!.isWon())).toBe(true);

  await page.evaluate(() => window.__GAME_DEBUG__!.restart());
  await waitForPlayableGame(page);
  for (let hit = 0; hit < 3; hit += 1) {
    await action(page, 'loseLife');
    await page.waitForTimeout(950);
  }
  expect(await page.evaluate(() => window.__GAME_DEBUG__!.isLost())).toBe(true);

  await page.keyboard.press('KeyR');
  await waitForPlayableGame(page);
  expect(await page.evaluate(() => window.__GAME_DEBUG__!.getHealth())).toBe(3);
  expect(fatalErrors).toEqual([]);
});
