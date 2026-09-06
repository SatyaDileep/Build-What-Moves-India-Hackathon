// Step-by-step journey capture: Passport EN + EPFO HI.
// Usage: node scripts/capture-journeys.mjs (requires dev server on :3000)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const journeys = [
  { slug: 'passport-en', route: '/passport', lang: 'en' },
  { slug: 'epfo-hi', route: '/epfo', lang: 'hi' },
];

const browser = await chromium.launch();
try {
  for (const j of journeys) {
    const OUT = `docs/journeys/${j.slug}`;
    mkdirSync(OUT, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((l) => { try { localStorage.setItem('docbridge-lang', l); } catch {} }, j.lang);
    const page = await ctx.newPage();
    const shot = async (n, name) => {
      await page.screenshot({ path: `${OUT}/${n}-${name}.png`, fullPage: true });
      console.log(`ok ${OUT}/${n}-${name}.png`);
    };
    const safeClick = async (loc, wait = 900) => {
      try { await loc.first().click({ timeout: 5000 }); await page.waitForTimeout(wait); return true; }
      catch { return false; }
    };

    await page.goto(BASE + j.route, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1200);
    await shot('01', 'login');

    await safeClick(page.getByRole('button', { name: /Login|लॉगिन|साइन इन|Sign in/i }));
    await shot('02', 'dashboard-nudge');

    await safeClick(page.locator('[role="status"] button'));
    await page.waitForTimeout(600);
    await shot('03', 'upload-requirements');

    const digiBtn = page.getByRole('button', { name: /From DigiLocker|DigiLocker से/ });
    await digiBtn.first().scrollIntoViewIfNeeded().catch(() => {});
    await safeClick(digiBtn, 800);
    await shot('04', 'digilocker-aadhaar');

    await safeClick(page.locator('[role="dialog"] button.w-full'), 800);
    await shot('05', 'digilocker-otp');

    await safeClick(page.locator('[role="dialog"] button.w-full'), 1200);
    await page.waitForTimeout(800);
    await shot('06', 'digilocker-select');

    const asset = page.locator('[role="dialog"] button:has-text("KB"), [role="dialog"] button:has-text("MB")');
    const hasAsset = (await asset.count()) > 0;
    if (hasAsset) await safeClick(asset, 1500);
    await shot('07', 'processing');
    try {
      await page.getByText(/Ready to submit|जमा करने के लिए तैयार|Before \(Original\)|पहले \(मूल\)/).first().waitFor({ timeout: 20000 });
    } catch {}
    await page.waitForTimeout(800);
    try { await page.getByText(/Ready to submit|जमा करने के लिए तैयार|Before \(Original\)|पहले \(मूल\)/).first().scrollIntoViewIfNeeded(); } catch {}
    await page.waitForTimeout(400);
    await shot('08', 'preview-compare');

    await safeClick(page.getByRole('button', { name: /Submit to|जमा करें/ }), 2500);
    await shot('09', 'widget-success');
    await page.waitForTimeout(1200);
    await shot('10', 'portal-done');

    await ctx.close();
  }
} finally {
  await browser.close();
}
