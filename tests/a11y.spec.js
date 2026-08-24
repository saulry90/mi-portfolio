import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

const scan = async (page) => {
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
};

test('no hay violaciones de accesibilidad en tema claro', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await scan(page);
});

test('no hay violaciones de accesibilidad en tema oscuro', async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('theme', 'dark');
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForSelector('html.is-dark');
    await scan(page);
});
