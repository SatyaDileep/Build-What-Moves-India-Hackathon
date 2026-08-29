import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const nextPath = join(process.cwd(), '.next');
const cachePath = join(nextPath, 'cache');

function isDevRunning() {
  try {
    const out = execSync('netstat -ano', { encoding: 'utf8', timeout: 2000 });
    // dev server listens on 3000 (or 3001) — if LISTENING, .next/server is live
    return /:3000.*LISTENING/.test(out) || /:3001.*LISTENING/.test(out);
  } catch { return false; }
}

if (isDevRunning()) {
  console.log('Dev server detected on :3000/:3001 — skipping .next cache clear to avoid Cannot find module ./948.js. Stop dev first, then build.');
} else {
  const target = existsSync(cachePath) ? cachePath : nextPath;
  if (existsSync(target)) {
    try {
      rmSync(target, { recursive: true, force: true });
      console.log(`Cleared stale Next.js cache: ${target}`);
    } catch (e) {
      console.warn(`Could not clear ${target}: ${e.message}`);
    }
  }
}
