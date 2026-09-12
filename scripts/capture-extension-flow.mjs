// Captures the extension working on a portal page, headlessly, using REAL files:
// mock-portal (Passport-like upload page) + actual content scripts + content.css,
// with only chrome.* APIs stubbed. Screenshots: nudge -> panel -> result -> handoff.
// Usage: node scripts/capture-extension-flow.mjs
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(new URL('./capture-extension-flow.mjs', import.meta.url))), '..');
const OUT = ROOT + '/docs/extension';
mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    let p = path.normalize(ROOT + decodeURIComponent(u.pathname));
    if (!p.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(readFileSync(p));
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;

const STUB = `window.__dbdl = [];
window.chrome = {
  runtime: { lastError: null,
    onMessage: { addListener: function(){} },
    sendMessage: function(){ try { var cb = arguments[arguments.length-1]; if (typeof cb === 'function') setTimeout(function(){cb({ok:true})},0); } catch(e){} },
    getURL: function(p){ return p; } },
  storage: { local: { _d: {},
    get: function(k, cb){ var o={}; (Array.isArray(k)?k:[k]).forEach(function(x){ o[x]=window.chrome.storage.local._d[x]; }); setTimeout(function(){cb(o)},0); },
    set: function(o, cb){ Object.assign(window.chrome.storage.local._d, o); if(cb) setTimeout(cb,0); } } },
  downloads: { download: function(o, cb){ window.__dbdl.push(o.filename); setTimeout(function(){cb(1)},0); } },
  permissions: { request: function(o, cb){ setTimeout(function(){cb(true)},0); } }
};`;
const SCRIPTS = [
  '/chrome-extension/shared/portals.js',
  '/chrome-extension/shared/utils.js',
  '/chrome-extension/content/processor.js',
  '/chrome-extension/content/share.js',
  '/chrome-extension/content/feedback.js',
  '/chrome-extension/content/nudge.js',
  '/chrome-extension/content/panel.js',
  '/chrome-extension/content/detector.js',
];

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });

  await page.goto(base + '/chrome-extension/mock-portal/index.html', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ content: STUB });
  await page.addStyleTag({ path: ROOT + '/chrome-extension/styles/content.css' });
  for (const s of SCRIPTS) await page.addScriptTag({ url: base + s });
  await page.waitForSelector('#docbridge-nudge', { timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: OUT + '/flow-01-nudge.png' });
  console.log('ok docs/extension/flow-01-nudge.png');

  await page.click('#db-nudge-open');
  await page.waitForSelector('#docbridge-panel', { timeout: 15000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + '/flow-02-panel.png' });
  console.log('ok docs/extension/flow-02-panel.png');

  await page.evaluate(async () => {
    const c = document.createElement('canvas');
    c.width = 1600; c.height = 2000;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 1600, 2000);
    g.addColorStop(0, '#dfe8f2'); g.addColorStop(1, '#8fa5bd');
    x.fillStyle = g; x.fillRect(0, 0, 1600, 2000);
    const id = x.getImageData(0, 0, 1600, 2000);
    for (let i = 0; i < id.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 140;
      id.data[i] += n; id.data[i+1] += n; id.data[i+2] += n;
    }
    x.putImageData(id, 0, 0);
    x.fillStyle = '#caa06a';
    x.beginPath(); x.arc(800, 720, 260, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#1e3a8a'; x.fillRect(480, 1040, 640, 560);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.92));
    const file = new File([blob], 'phone-camera-photo.jpg', { type: 'image/jpeg' });
    const input = document.getElementById('db-file-input');
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(3000);
  console.log('DIAG: ' + await page.evaluate(() => JSON.stringify({
    result: document.getElementById('db-panel-result').innerText.slice(0, 300),
    drop: document.getElementById('db-panel-drop').style.display,
  })));
  try {
    await page.waitForSelector('#db-result-download', { timeout: 90000 });
  } catch (e) {
    console.log('RESULT DUMP: ' + await page.evaluate(() => document.getElementById('db-panel-result').innerText.slice(0, 500)));
    throw e;
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: OUT + '/flow-03-result.png' });
  console.log('ok docs/extension/flow-03-result.png');
  console.log('--- panel result ---\n' + await page.evaluate(() => document.querySelector('.db-result-status').innerText));

  await page.click('#db-result-download');
  await page.waitForSelector('#db-handoff', { timeout: 15000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + '/flow-04-handoff.png' });
  console.log('ok docs/extension/flow-04-handoff.png');
  console.log('downloaded as:', await page.evaluate(() => window.__dbdl.join(',')));

  // Multi-type panel (e.g. SSC photo + signature tabs) on demand.
  await page.evaluate(() => {
    document.querySelectorAll('#docbridge-panel,#docbridge-nudge').forEach(e => e.remove());
    const ssc = DOCBRIDGE_PORTALS.find(p => p.id === 'ssc');
    window.dispatchEvent(new CustomEvent('docbridge-panel-init', { detail: { portal: ssc, uploads: ssc.uploads } }));
  });
  await page.waitForSelector('#docbridge-panel', { timeout: 15000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + '/flow-05-multitype.png' });
  console.log('ok docs/extension/flow-05-multitype.png');

  const realErrors = errors.filter(e => !/favicon/i.test(e));
  if (realErrors.length) { console.log('PAGE ERRORS:\n' + realErrors.join('\n')); process.exitCode = 2; }
  else console.log('no page errors');
} finally {
  await browser.close();
  server.close();
}
