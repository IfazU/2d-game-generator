import { expect, test } from '@playwright/test';

test('boots a Phaser canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
});
