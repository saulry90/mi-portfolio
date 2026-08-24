import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
    { name: 'extremo pequeño', width: 320, height: 568 },
    { name: 'móvil (480)', width: 480, height: 800 },
    { name: 'justo antes de tablet (767)', width: 767, height: 1024 },
    { name: 'tablet (768)', width: 768, height: 1024 },
    { name: 'justo antes de desktop (1023)', width: 1023, height: 768 },
    { name: 'desktop (1024)', width: 1024, height: 768 },
    { name: 'extremo ancho (1440)', width: 1440, height: 900 },
];

for (const vp of BREAKPOINTS) {
    test.describe(`viewport ${vp.width}x${vp.height}px — ${vp.name}`, () => {
        test.use({ viewport: { width: vp.width, height: vp.height } });

        test('no hay desbordamiento horizontal', async ({ page }) => {
            await page.goto('/');
            const overflow = await page.evaluate(
                () => document.documentElement.scrollWidth - window.innerWidth,
            );
            expect(overflow, `desbordamiento horizontal de ${overflow}px`).toBeLessThanOrEqual(0);
        });

        test('la navegación se comporta según el breakpoint', async ({ page }) => {
            await page.goto('/');
            const isDesktop = vp.width >= 1024;
            const toggleVisible = await page.locator('.menu-toggle').evaluate((el) => {
                const s = getComputedStyle(el);
                return s.display !== 'none' && el.offsetParent !== null;
            });
            expect(toggleVisible, 'el toggle debe ser visible solo en móvil').toBe(!isDesktop);

            const nav = page.locator('.nav');
            const navClass = () => nav.getAttribute('class');

            if (isDesktop) {
                const navVisible = await nav.evaluate((el) => el.offsetHeight > 0);
                expect(navVisible, 'la nav debe estar visible en desktop').toBe(true);
            } else {
                expect(await navClass(), 'la nav debe empezar colapsada').not.toContain(
                    'nav--visible',
                );

                await page.locator('.menu-toggle').click();
                expect(await navClass(), 'la nav debe abrirse').toContain('nav--visible');
                await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'true');

                await page.keyboard.press('Escape');
                expect(await navClass(), 'Escape debe cerrar la nav').not.toContain('nav--visible');
                await expect(page.locator('.menu-toggle')).toHaveAttribute(
                    'aria-expanded',
                    'false',
                );

                await page.locator('.menu-toggle').click();
                await page.locator('.nav__link').first().click();
                expect(await navClass(), 'un click en un enlace debe cerrar la nav').not.toContain(
                    'nav--visible',
                );
            }
        });
    });
}
