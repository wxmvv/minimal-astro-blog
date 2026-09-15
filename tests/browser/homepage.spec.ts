import { expect, test } from '@playwright/test';

test('entrance starts before media finishes and does not replay on window load', async ({ page }) => {
  await page.addInitScript(() => {
    const states: string[] = [];
    Object.assign(window, { motionStates: states });
    new MutationObserver(() => {
      const state = document.documentElement?.dataset.pageMotion;
      if (state && states.at(-1) !== state) states.push(state);
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-page-motion'],
    });
  });
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route(/\.(?:mp4|webm|ogg)(?:\?|$)/, async (route) => {
    await pending;
    await route.abort();
  });
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const states = () => page.evaluate(() =>
      (window as Window & { motionStates: string[] }).motionStates,
    );
    await expect.poll(states, { timeout: 4000 }).toContain('entering');
    await expect(page.locator('html')).toHaveAttribute('data-page-motion', 'idle');
    release();
    await page.waitForLoadState('load');
    await page.waitForTimeout(300);
    expect((await states()).filter((state) => state === 'entering')).toHaveLength(1);

    await page.locator('[data-post-index]').first().click();
    await expect(page.locator('home-post-list')).toHaveCount(0);
    await page.goBack();
    await expect(page.locator('home-post-list')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('data-page-motion', 'idle');
    expect((await states()).filter((state) => state === 'entering').length).toBeGreaterThan(1);
  } finally {
    release();
  }
});
