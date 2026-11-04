import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const site = JSON.parse(fs.readFileSync('src/data/site.json', 'utf8'));
for (const item of site.pages) {
  const route = item.slug ? `/${item.slug}/` : '/';
  test(`${route}: content, keyboard, links and accessibility`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.title);
    await expect(page.locator('html')).toHaveAttribute('lang', item.lang || site.lang);
    expect(await page.title()).toContain(site.name);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press('Tab');
    await expect(page.getByText(item.lang === 'es' ? 'Saltar al contenido' : 'Skip to content', { exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#content')).toBeFocused();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await expect(page.locator('.language-selector a')).toHaveText(['English', 'Español']);
    await expect(page.locator('.language-selector a[aria-current="true"]')).toHaveAttribute('hreflang', item.lang);
    await expect(page.locator('.language-selector a[aria-current="true"]')).toHaveCount(1);
    const currentLanguageLink = page.locator(`.language-selector a[hreflang="${item.lang}"]`);
    await currentLanguageLink.focus();
    await expect(currentLanguageLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    for (const p of site.pages) {
      if (await page.locator('html').getAttribute('lang') !== p.lang) {
        const sourcePages = site.pages.filter(entry => entry.lang !== p.lang);
        const targetPages = site.pages.filter(entry => entry.lang === p.lang);
        const sourceIndex = sourcePages.findIndex(entry => new URL(page.url()).pathname === (entry.slug ? `/${entry.slug}/` : '/'));
        await page.locator(`a.language[hreflang="${p.lang}"]`).focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('html')).toHaveAttribute('lang', p.lang);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(targetPages[sourceIndex].title);
        await expect(page.locator('.language-selector a[aria-current="true"]')).toHaveAttribute('hreflang', p.lang);
      }
      const href = p.slug ? `/${p.slug}/` : '/';
      await page.locator(`nav a[href="${href}"]`).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(p.title);
    }
    expect(errors).toEqual([]);
    await page.goto(route);
    await page.screenshot({ path: `evidence/${test.info().project.name}-${item.slug || 'home'}.png`, fullPage: true });
  });
}
test('404 returns the correct status and allows return', async ({ page }) => {
  const response = await page.goto('/does-not-exist/');
  expect(response.status()).toBe(404);
  await page.getByRole('link', { name: 'Return home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.pages.find(p => !p.slug).title);
});
