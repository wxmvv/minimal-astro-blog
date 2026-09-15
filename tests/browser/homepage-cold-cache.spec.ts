import { expect, test } from '@playwright/test';

test('slow animation bundle still enters and initializes previews and borders', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const states: string[] = [];
    Object.assign(window, { coldLoadStates: states });
    new MutationObserver(() => {
      states.push(document.documentElement.dataset.pageMotion ?? '');
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-page-motion'],
    });
  });
  // Routing disables the browser cache. Exercise both dev and built module URLs.
  await page.route(/page-transitions\.ts|PageTransitions\.astro_.*\.js/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3200));
    await route.continue();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'coldLoadStates') as string[]))
    .toContain('entering');
  await expect(page.locator('html')).toHaveAttribute('data-page-motion', 'idle');

  const preview = page
    .locator('[data-preview-index]')
    .filter({ has: page.locator('img') })
    .first();
  const index = await preview.getAttribute('data-preview-index');
  const link = page.locator(`[data-post-index="${index}"]`);
  await link.hover();
  await expect(preview).toHaveClass(/is-active/);
  await expect(preview).toBeVisible();
  await expect(page.locator('body > .previews')).toHaveCSS('opacity', '1');
  await expect
    .poll(async () => {
      const a = await link.boundingBox();
      const b = await page.locator('.hover-background').boundingBox();
      return a && b ? Math.max(Math.abs(a.width - b.width), Math.abs(a.y - b.y)) : Infinity;
    })
    .toBeLessThan(2);
  await expect(page.locator('.hover-background')).toHaveClass(/is-backdrop-ready/);
});
