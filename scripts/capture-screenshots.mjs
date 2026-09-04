// Captures EN + HI screenshots of every site for README reference.
// Usage: npm run screenshots  (requires dev server on localhost:3000)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUT = path.dirname(fileURLToPath(new URL('./capture-screenshots.mjs', import.meta.url))) + '/../docs/screenshots';
mkdirSync(OUT, { recursive: true });

const routes = [
  ['home', '/'],
  ['epfo', '/epfo'],
  ['upsc', '/upsc'],
  ['vahan', '/vahan'],
  ['passport', '/passport'],
  ['ssc', '/ssc'],
  ['nsp', '/nsp'],
];

const browser = await chromium.launch();
try {
  for (const lang of ['en', 'hi']) {
    for (const [name, path] of routes) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      await ctx.addInitScript((l) => {
        try { localStorage.setItem('docbridge-lang', l); } catch {}
      }, lang);
      const page = await ctx.newPage();
      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(1200);
      const file = `${OUT}/${name}-${lang}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(`ok docs/screenshots/${name}-${lang}.png`);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
