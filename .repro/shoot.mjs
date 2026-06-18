import { chromium, firefox, webkit } from 'playwright';
import { pathToFileURL, fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(__dirname, 'harness.html')).href;

for (const [engineName, engine] of [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]]) {
  const browser = await engine.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 760 } });
  await page.goto(url);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(__dirname, `engine-${engineName}.png`), fullPage: true });
  console.log('shot', engineName);
  await browser.close();
}
console.log('done');
