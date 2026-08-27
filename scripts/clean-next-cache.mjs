import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const nextCachePath = join(process.cwd(), '.next');

if (existsSync(nextCachePath)) {
  rmSync(nextCachePath, { recursive: true, force: true });
  console.log('Cleared stale Next.js build cache.');
}
