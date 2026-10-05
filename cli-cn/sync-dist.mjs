import { rmSync, cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', 'cli', 'dist');
const dst = join(here, 'dist');
if (!existsSync(src)) { console.error('[cli-cn] missing ../cli/dist — build cli first'); process.exit(1); }
rmSync(dst, { recursive: true, force: true });
cpSync(src, dst, { recursive: true });
console.log('[cli-cn] synced dist from ../cli/dist');
