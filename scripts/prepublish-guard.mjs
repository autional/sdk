// Prepublish guard (N-06): block publishing a half-renamed package.
// Asserts: (1) manifest name under @autional scope, (2) no legacy @authms specifier
// in src/, (3) no legacy specifier in dist/ (catches stale dist — the 0.2.x bug),
// (4) every declared entry file exists.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const dir = process.cwd();
const fail = (msg) => { console.error(`[prepublish-guard] FAIL ${dir}: ${msg}`); process.exit(1); };

const pkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
if (!/^@autional\//.test(pkg.name || '')) fail(`name "${pkg.name}" is not under @autional scope`);

const LEGACY = /@authms\//;
const walk = (d, out = []) => {
  if (!existsSync(d)) return out;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};
for (const area of ['src', 'dist']) {
  for (const f of walk(path.join(dir, area))) {
    if (!/\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/.test(f)) continue;
    if (LEGACY.test(readFileSync(f, 'utf8'))) {
      fail(`legacy @authms reference in ${path.relative(dir, f)}`);
    }
  }
}

const entries = [];
for (const k of ['main', 'module', 'types']) if (pkg[k]) entries.push(pkg[k]);
if (pkg.exports) {
  for (const v of Object.values(pkg.exports)) {
    if (typeof v === 'string') entries.push(v);
    else for (const vv of Object.values(v)) if (typeof vv === 'string') entries.push(vv);
  }
}
for (const e of entries) {
  if (!existsSync(path.join(dir, e))) fail(`declared entry missing (build first): ${e}`);
}

console.log(`[prepublish-guard] OK ${pkg.name} (${entries.length} entries verified)`);
