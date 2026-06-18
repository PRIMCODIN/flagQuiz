import { chromium, firefox, webkit } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'http://localhost:3000';

for (const [eng, engine] of [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]]) {
  const browser = await engine.launch();
  for (const [name, width] of [['desktop', 1280], ['mobile', 390]]) {
    const ctx = await browser.newContext({ viewport: { width, height: 844 } });
    const page = await ctx.newPage();
    page.on('pageerror', e => console.log(`[pageerror:${eng}:${name}]`, e.message));
    await page.goto(BASE + '/');
    await page.getByRole('button', { name: 'Invitado' }).click();
    await page.locator('input[type="text"]').fill('Repro');
    await page.getByRole('button', { name: /Jugar como invitado/i }).click();
    await page.waitForSelector('.modes-grid', { timeout: 12000 });
    await page.getByRole('button', { name: /Clásico/i }).click();
    await page.waitForSelector('.flag-container', { timeout: 12000 });
    // frame inicial
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(__dirname, `real-${eng}-${name}-start.png`) });
    // frame con el tiempo ya consumido (~9s)
    await page.waitForTimeout(9000);
    await page.screenshot({ path: path.join(__dirname, `real-${eng}-${name}-mid.png`) });
    console.log('shot', eng, name);
    await ctx.close();
  }
  await browser.close();
}
console.log('done');
