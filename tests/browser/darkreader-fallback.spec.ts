import { expect, test } from '@playwright/test';

test('locked pages remove Dark Reader fallback after system theme changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('meta[name="darkreader-lock"]')).toHaveCount(1);
  for (const colorScheme of ['dark', 'light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.className = 'darkreader darkreader--fallback';
      style.media = 'screen';
      style.textContent =
        'html, body, body :not(iframe) { background-color: #181a1b !important; border-color: #776e62 !important; color: #e8e6e3 !important; }';
      document.head.append(style);
    });
    await expect(page.locator('style.darkreader--fallback')).toHaveCount(0);
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      colorScheme === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
    );
    await expect(page.locator('body')).toHaveCSS(
      'color',
      colorScheme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
    );
  }
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.className = 'darkreader darkreader--custom';
    document.head.append(style);
  });
  await expect(page.locator('style.darkreader--custom')).toHaveCount(1);
});
