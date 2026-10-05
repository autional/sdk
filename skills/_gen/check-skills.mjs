#!/usr/bin/env node
/**
 * check-skills.mjs — fail-closed consistency gate for the region × language skill distribution.
 *
 * The distribution has ONE logical source (skills/_core) rendered through
 * skills/_gen/config.<region>.json into committed artifacts:
 *   skills/autional-com/SKILL.md + SKILL.zh.md   (primary=en)
 *   skills/autional-cn/SKILL.md + SKILL.en.md    (primary=zh)
 *   … plus each region's references/ mirror.
 *
 * This script asserts the committed artifacts stay consistent, region-pure,
 * brand-clean and canonically addressable. It is a CI gate, not a generator:
 * it never writes. Fix failures by editing skills/_core and re-running
 * `node skills/_gen/build-skills.mjs`.
 *
 * Gates (all fail-closed — any issue → exit 1):
 *   G1 single source  every product frontmatter `generated: core@<hash>` is identical.
 *   G2 region purity  com artifacts contain 0 hits of /gitee/i or /autional\.cn/i;
 *                     cn artifacts contain 0 hits of /github/i or /autional\.com/i.
 *   G3 core freshness the shared hash equals the CURRENT skills/_core hash.
 *   G4 brand clean    no /authms/i, /tianv/i, /linmes/i or /auth\.iam/i anywhere.
 *   G5 canonical      each product's `canonical` is the unique, region-correct skill URL;
 *                     any committed `<artifact>.sha256` matches the artifact bytes.
 *
 * Reuse: G3 delegates to `build-skills.mjs --check`, which is the single source of
 * truth for the core-hash algorithm and the anti-drift scan. We only parse its
 * `core@<hash>` summary; we never duplicate the hashing logic.
 *
 * Exit codes: 0 = all gates pass; 1 = at least one gate failed; 2 = fatal setup error.
 * No external dependencies (Node builtins only). Read-only and idempotent.
 *
 * Usage (from sdk/, or repo root with the full path):
 *   node skills/_gen/check-skills.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_ROOT = resolve(__dirname, '..');
const GEN_DIR = __dirname;

// ---------------------------------------------------------------------------
// Anti-drift vocabulary — MUST stay in sync with build-skills.mjs.
// (build-skills.mjs remains authoritative: it re-scans regenerated content; the
// checks below independently re-scan the *committed* bytes.)
// ---------------------------------------------------------------------------
const BANNED_ALL = [
  ['authms', /authms/i],
  ['tianv', /tianv/i],
  ['linmes', /linmes/i],
  ['auth.iam', /auth\.iam/i],
];
// Mirror platform that must never leak into the "other" region.
const PLATFORM_BY_REGION = { com: ['gitee'], cn: ['github'] };

const rel = (p) => relative(SKILLS_ROOT, p).split(sep).join('/');

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile()) out.push(p);
  }
  return out;
}

/** Parse a leading `---\n…\n---` frontmatter block into a flat {key: value} map. */
function readFrontmatter(path) {
  if (!existsSync(path)) return null;
  const text = readFileSync(path, 'utf8');
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const fm = {};
  if (block) {
    for (const line of block[1].split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (m) fm[m[1]] = m[2].trim().replace(/^"(.*)"$/, '$1');
    }
  }
  return { fm, text };
}

// ---------------------------------------------------------------------------
// Load the generator's region matrix (single source: config.<region>.json).
// ---------------------------------------------------------------------------
const configFiles = readdirSync(GEN_DIR)
  .filter((f) => /^config\.[a-z]+\.json$/.test(f))
  .sort();
if (configFiles.length === 0) {
  console.error('[gate] FATAL no config.<region>.json found in skills/_gen/');
  process.exit(2);
}
const configs = configFiles.map((f) => JSON.parse(readFileSync(join(GEN_DIR, f), 'utf8')));

/** Domain suffix of a config's public site (www.autional.com → autional.com). */
const domainOf = (cfg) => cfg.siteHost.replace(/^www\./, '');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Per-region banned tokens: every other region's domain + the mirror platform. */
const bannedByRegion = {};
for (const cfg of configs) {
  const pats = [];
  for (const other of configs) {
    if (other.region === cfg.region) continue;
    const d = domainOf(other);
    pats.push([d, new RegExp(escapeRe(d), 'i')]);
  }
  for (const token of PLATFORM_BY_REGION[cfg.region] ?? []) {
    pats.push([token, new RegExp(escapeRe(token), 'i')]);
  }
  bannedByRegion[cfg.region] = pats;
}

/** Expected product files (the SKILL[.lang].md artifacts) and their canonical URL. */
const products = [];
for (const cfg of configs) {
  const dir = join(SKILLS_ROOT, `autional-${cfg.region}`);
  for (const lang of cfg.langs) {
    const primary = lang === cfg.primaryLang;
    const fileName = primary ? 'SKILL.md' : `SKILL.${lang}.md`;
    const siteFile = primary ? 'skill.md' : `skill.${lang}.md`;
    products.push({
      region: cfg.region,
      lang,
      path: join(dir, fileName),
      label: `autional-${cfg.region}/${fileName}`,
      expectedCanonical: `https://${cfg.siteHost}/ai/${siteFile}`,
    });
  }
}

// ---------------------------------------------------------------------------
// Reuse the generator's own checker for G3 (freshness under build-skills.mjs口径).
// ---------------------------------------------------------------------------
const buildCheck = spawnSync(
  process.execPath,
  [join(GEN_DIR, 'build-skills.mjs'), '--check'],
  { cwd: GEN_DIR, encoding: 'utf8' },
);
const buildOutput = `${buildCheck.stdout ?? ''}${buildCheck.stderr ?? ''}`;
const buildHash = (buildOutput.match(/core@([0-9a-f]{12})/) ?? [])[1] ?? null;

// Shared hash across committed products (computed once; consumed by G1 and G3).
const productFiles = products.map((p) => ({ ...p, doc: readFrontmatter(p.path) }));
const sharedGenerated = (() => {
  const values = productFiles
    .map((p) => p.doc?.fm?.generated)
    .filter((v) => typeof v === 'string');
  return values.length && new Set(values).size === 1 ? values[0] : null;
})();

// ---------------------------------------------------------------------------
// Gates — each returns a list of issue strings (empty = pass).
// ---------------------------------------------------------------------------
const GATES = [
  {
    id: 'G1',
    name: 'single source (_core)',
    run() {
      const issues = [];
      const seen = new Map();
      for (const p of productFiles) {
        if (!p.doc) {
          issues.push(`${p.label}: missing (run node skills/_gen/build-skills.mjs)`);
          continue;
        }
        const g = p.doc.fm.generated;
        if (!g) {
          issues.push(`${p.label}: frontmatter has no \`generated:\``);
          continue;
        }
        seen.set(p.label, g);
      }
      const uniq = new Set(seen.values());
      if (uniq.size > 1) {
        issues.push(`products disagree on source hash: ${[...uniq].join(', ')}`);
        for (const [label, g] of seen) issues.push(`  ${label} → ${g}`);
      } else if (seen.size !== products.length) {
        issues.push(`${products.length - seen.size}/${products.length} product(s) carry no source hash`);
      }
      return issues;
    },
  },
  {
    id: 'G2',
    name: 'region purity',
    run() {
      const issues = [];
      for (const cfg of configs) {
        const dir = join(SKILLS_ROOT, `autional-${cfg.region}`);
        const patterns = bannedByRegion[cfg.region] ?? [];
        for (const file of walk(dir)) {
          if (!file.toLowerCase().endsWith('.md')) continue;
          const text = readFileSync(file, 'utf8');
          for (const [name, re] of patterns) {
            if (re.test(text)) issues.push(`${rel(file)}: region "${cfg.region}" contains "${name}"`);
          }
        }
      }
      return issues;
    },
  },
  {
    id: 'G3',
    name: 'core freshness',
    run() {
      const issues = [];
      if (buildCheck.status !== 0) {
        issues.push('build-skills.mjs --check exited non-zero (stale outputs or anti-drift gate)');
        for (const line of buildOutput.split('\n')) {
          if (/STALE|ERROR|FAIL/.test(line) && line.trim()) issues.push(`  ${line.trim()}`);
        }
      }
      if (!buildHash) {
        issues.push('could not read current _core hash from build-skills.mjs --check');
      } else if (sharedGenerated && sharedGenerated !== `core@${buildHash}`) {
        issues.push(
          `stale: artifacts are ${sharedGenerated} but current _core is core@${buildHash}` +
            ' — run: node skills/_gen/build-skills.mjs',
        );
      } else if (!sharedGenerated) {
        issues.push('no common `generated:` hash among products (see G1)');
      }
      return issues;
    },
  },
  {
    id: 'G4',
    name: 'brand clean',
    run() {
      const issues = [];
      for (const cfg of configs) {
        const dir = join(SKILLS_ROOT, `autional-${cfg.region}`);
        for (const file of walk(dir)) {
          if (!file.toLowerCase().endsWith('.md')) continue;
          const text = readFileSync(file, 'utf8');
          for (const [name, re] of BANNED_ALL) {
            if (re.test(text)) issues.push(`${rel(file)}: banned brand "${name}"`);
          }
        }
      }
      return issues;
    },
  },
  {
    id: 'G5',
    name: 'canonical + sha256',
    run() {
      const issues = [];
      const owners = new Map(); // canonical → label
      for (const p of productFiles) {
        if (!p.doc) continue;
        const canonical = p.doc.fm.canonical;
        if (!canonical) {
          issues.push(`${p.label}: frontmatter has no \`canonical:\``);
          continue;
        }
        if (canonical !== p.expectedCanonical) {
          issues.push(`${p.label}: canonical "${canonical}" ≠ expected "${p.expectedCanonical}"`);
        }
        if (owners.has(canonical)) {
          issues.push(`${p.label}: canonical duplicated by ${owners.get(canonical)}`);
        } else {
          owners.set(canonical, p.label);
        }
      }

      // Optional committed checksums: <artifact>.sha256 beside the artifact.
      for (const cfg of configs) {
        const dir = join(SKILLS_ROOT, `autional-${cfg.region}`);
        for (const file of walk(dir)) {
          if (!file.toLowerCase().endsWith('.sha256')) continue;
          const target = file.slice(0, -'.sha256'.length);
          if (!existsSync(target)) {
            issues.push(`${rel(file)}: checksum target is missing`);
            continue;
          }
          const digest = (readFileSync(file, 'utf8').match(/[0-9a-fA-F]{64}/) ?? [])[0];
          if (!digest) {
            issues.push(`${rel(file)}: no SHA-256 digest found`);
            continue;
          }
          const actual = createHash('sha256').update(readFileSync(target)).digest('hex');
          if (digest.toLowerCase() !== actual) {
            issues.push(`${rel(file)}: sha256 mismatch (file is ${actual})`);
          }
        }
      }
      return issues;
    },
  },
];

// ---------------------------------------------------------------------------
// Run and report.
// ---------------------------------------------------------------------------
let failed = 0;
console.log('skills consistency gate (fail-closed) — skills/_gen/check-skills.mjs');
console.log(
  `source: ${configs.length} region(s) [${configs.map((c) => c.region).join(', ')}] · ` +
    `${products.length} product(s) · core@${buildHash ?? '?'}`,
);
for (const gate of GATES) {
  let issues = [];
  try {
    issues = gate.run();
  } catch (err) {
    issues = [`unexpected error: ${err.message}`];
  }
  if (issues.length) {
    failed += 1;
    console.log(`\n[FAIL] ${gate.id} ${gate.name}`);
    for (const issue of issues) console.log(`       - ${issue}`);
  } else {
    console.log(`[PASS] ${gate.id} ${gate.name}`);
  }
}

console.log(failed === 0 ? '\nAll 5 gates passed.' : `\n${failed} gate(s) FAILED.`);
process.exitCode = failed === 0 ? 0 : 1;
