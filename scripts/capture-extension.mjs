// Tests extension standalone mode headlessly using the REAL popup files.
// Serves the repo over local HTTP, injects a chrome-API stub, loads the actual
// popup.html markup + shared/portals.js + shared/utils.js + content/processor.js
// + popup/popup.js, drives a large generated image through the pipeline.
// Usage: node scripts/capture-extension.mjs
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(new URL('./capture-extension.mjs', import.meta.url))), '..');
const OUT = ROOT + '/docs/extension';
mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };

function buildHarness() {
  let html = readFileSync(ROOT + '/chrome-extension/popup/popup.html', 'utf8');
  html = html.replace('href="popup.css"', 'href="/chrome-extension/popup/popup.css"');
  html = html.replace('<script src="../shared/portals.js"></script>', '<script src="/chrome-extension/shared/portals.js"></script>');
  html = html.replace('<script src="../shared/utils.js"></script>', '<script src="/chrome-extension/shared/utils.js"></script>');
  html = html.replace('<script src="../content/processor.js"></script>', '<script src="/chrome-extension/content/processor.js"></script>');
  html = html.replace('<script src="popup.js"></script>', '<script src="/chrome-extension/popup/popup.js"></script>');
  const stub = `<script>
window.__dl = [];
window.chrome = {
  runtime: { lastError: null },
  storage: { local: {
    _d: {},
    get: function(k, cb){ var o={}; var ks=Array.isArray(k)?k:[k]; ks.forEach(function(x){ o[x]=window.chrome.storage.local._d[x]; }); setTimeout(function(){cb(o)},0); },
    set: function(o, cb){ Object.assign(window.chrome.storage.local._d, o); if(cb) setTimeout(cb,0); }
  }},
  tabs: { query: function(q, cb){ setTimeout(function(){cb([])},0); }, sendMessage: function(id, m, cb){ setTimeout(function(){cb({ok:false})},0); } },
  downloads: { download: function(o, cb){ window.__dl.push(o.filename); setTimeout(function(){cb(1)},0); } },
  permissions: { request: function(o, cb){ setTimeout(function(){cb(true)},0); } }
};
</script>`;
  return html.replace('<script src="/chrome-extension/shared/portals.js">', stub + '\n<script src="/chrome-extension/shared/portals.js">');
}

const server = http.createServer((req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/__harness.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(buildHarness());
      return;
    }
    let p = path.normalize(ROOT + decodeURIComponent(u.pathname));
    if (!p.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    const data = readFileSync(p);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('nf');
  }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1/${server.address().port}`.replace('//', '//').replace('http:/', 'http://');
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 420, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(base + '/__harness.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: OUT + '/standalone-01-initial.png' });
  console.log('ok docs/extension/standalone-01-initial.png');

  await page.evaluate(() => {
    const tags = [...document.querySelectorAll('#portal-list button')];
    const t = tags.find(b => /passport/i.test(b.textContent));
    if (t) t.click();
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + '/standalone-02-passport.png' });
  console.log('ok docs/extension/standalone-02-passport.png');

  await page.evaluate(async () => {
    const c = document.createElement('canvas');
    c.width = 1600; c.height = 2000;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 1600, 2000);
    g.addColorStop(0, '#dfe8f2'); g.addColorStop(1, '#8fa5bd');
    x.fillStyle = g; x.fillRect(0, 0, 1600, 2000);
    const id = x.getImageData(0, 0, 1600, 2000);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 140;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    x.putImageData(id, 0, 0);
    x.fillStyle = '#caa06a';
    x.beginPath(); x.arc(800, 720, 260, 0, Math.PI * 2); x.fill();
    x.fillStyle = 'rgba(120,60,20,0.55)';
    for (let s = 0; s < 900; s++) {
      x.fillRect(Math.random() * 1600, Math.random() * 2000, 3 + Math.random() * 22, 3 + Math.random() * 22);
    }
    x.fillStyle = '#1e3a8a'; x.fillRect(480, 1040, 640, 560);
    x.fillStyle = '#fff'; x.font = 'bold 52px sans-serif'; x.textAlign = 'center';
    x.fillText('TEST PHOTO 1600x2000', 800, 760);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.92));
    const file = new File([blob], 'test-large-photo.jpg', { type: 'image/jpeg' });
    const input = document.getElementById('standalone-file');
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(3000);
  console.log('DIAG: ' + await page.evaluate(() => JSON.stringify({
    fns: [typeof processStandaloneFile, typeof DocBridgeProcessor, typeof activeConstraint],
    files: document.getElementById('standalone-file').files.length,
    onchange: typeof document.getElementById('standalone-file').onchange,
    box: document.getElementById('standalone-result').innerText.slice(0, 200),
    chips: document.getElementById('preset-chips').textContent.slice(0, 120)
  })));
  try {
    await page.waitForSelector('#sa-download', { timeout: 90000 });
  } catch (e) {
    console.log('RESULT DUMP: ' + await page.evaluate(() => document.getElementById('standalone-result').innerText.slice(0, 500)));
    throw e;
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: OUT + '/standalone-03-result.png', fullPage: true });
  console.log('ok docs/extension/standalone-03-result.png');
  console.log('--- result card ---\n' + (await page.evaluate(() => {
    const card = document.querySelector('#standalone-result');
    return card ? card.innerText.slice(0, 600) : '(no result)';
  })));

  await page.evaluate(() => {
    const d = document.querySelector('#custom-section');
    if (d && !d.open) d.open = true;
    document.getElementById('custom-maxkb').value = '20';
    document.getElementById('custom-minkb').value = '50';
    document.getElementById('custom-maxkb').dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + '/standalone-04-validation.png', fullPage: true });
  console.log('ok docs/extension/standalone-04-validation.png');

  const realErrors = errors.filter(e => !/favicon/i.test(e));
  if (realErrors.length) { console.log('PAGE ERRORS:\n' + realErrors.join('\n')); process.exitCode = 2; }
  else console.log('no page errors');
} finally {
  await browser.close();
  server.close();
}
