import { expect, test } from '@playwright/test';

test('project images stay within their cards at narrow widths', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 1000 });
  await page.goto('/projects/', { waitUntil: 'networkidle' });

  const measurements = await page.locator('main > ul > li').evaluateAll((items) =>
    items.map((item) => {
      const card = item.querySelector<HTMLElement>('[class*="aspect-square"]');
      const image = item.querySelector('img');
      if (!card || !image) return null;

      const cardBox = card.getBoundingClientRect();
      const imageBox = image.getBoundingClientRect();
      return {
        cardWidth: cardBox.width,
        imageWidth: imageBox.width,
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      };
    }),
  );

  const validMeasurements = measurements.filter(
    (measurement): measurement is NonNullable<typeof measurement> => measurement !== null,
  );
  expect(validMeasurements.length).toBeGreaterThan(0);

  for (const measurement of validMeasurements) {
    expect(measurement.imageWidth).toBeLessThanOrEqual(measurement.cardWidth + 1);
    expect(measurement.scrollWidth).toBeLessThanOrEqual(measurement.viewportWidth + 1);
  }
});
