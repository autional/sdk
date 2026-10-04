#!/usr/bin/env node
/**
 * build-skills.mjs — generate region × language skill files from the _core single source.
 *
 * Source of truth:  skills/_core/PROCEDURE.md + skills/_core/references/*.md
 * Inputs:           skills/_gen/config.<region>.json
 *                   (config.mirror.overrides[<repoFile>] may override {label, rawBase} per output
 *                    file — e.g. the .cn English skill is mirrored on jsDelivr, not Gitee)
 * Outputs:          skills/autional-<region>/SKILL[.<lang>].md + references/ (primary language)
 *
 * Usage:
 *   node build-skills.mjs           generate + validate (fail-closed: writes only when every check passes)
 *   node build-skills.mjs --check   validate only; exit 1 when any output is stale or any gate fails
 *
 * Marker syntax inside _core sources (line-based, on their own lines):
 *   <!-- lang:en -->   ... <!-- /lang:en -->      emit only for the matching language
 *   <!-- region:cn --> ... <!-- /region:cn -->     emit only for the matching region
 *   Markers nest (a region block may contain lang blocks). Content outside markers is shared.
 *   <!-- meta:description:<lang> --> ... <!-- /meta:description:<lang> -->   frontmatter text.
 *
 * Placeholders: {{NAME}} — resolved from config + computed vars; any leftover fails the build.
 *
 * Anti-drift gates (fail-closed):
 *   - all outputs:   /authms/i, /tianv/i, /linmes/i, /auth\.iam/i
 *   - .com outputs:  /gitee/i, /autional\.cn/i
 *   - .cn outputs:   /github/i, /autional\.com/i
 *   - no leftover {{...}} placeholders or lang/region/meta markers
 *
 *   The region scan anchors on our own domains (autional.com / autional.cn), not on the
 *   bare substrings ".com"/".cn" — the .cn build legitimately references
 *   registry.npmmirror.com. Add new regional domains here explicitly instead of loosening.
 *
 * Determinism: no timestamps anywhere; identical inputs → byte-identical outputs (idempotent).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_ROOT = resolve(__dirname, '..');
const CORE_DIR = join(SKILLS_ROOT, '_core');
const CHECK_ONLY = process.argv.includes('--check');

const MARKER_RE = /^<!--\s*(\/?)(lang|region):([a-z-]+)\s*-->$/;
const META_OPEN_RE = /^<!--\s*meta:description:(en|zh)\s*-->$/;
const META_CLOSE_RE = /^<!--\s*\/meta:description:(en|zh)\s*-->$/;
const PLACEHOLDER_RE = /\{\{([A-Z0-9_]+)\}\}/g;

const BANNED_ALL = [
  ['authms', /authms/i],
  ['tianv', /tianv/i],
  ['linmes', /linmes/i],
  ['auth.iam', /auth\.iam/i],
];
const BANNED_BY_REGION = {
  com: [['gitee', /gitee/i], ['autional.cn', /autional\.cn/i]],
  cn: [['github', /github/i], ['autional.com', /autional\.com/i]],
};

function fail(msg) {
  console.error(`[gen] ERROR ${msg}`);
  process.exitCode = 1;
  throw new Error(msg);
}

function coreHash() {
  const refs = readdirSync(join(CORE_DIR, 'references')).sort().map((f) => `references/${f}`);
  const files = [...refs, 'PROCEDURE.md'];
  const h = createHash('sha256');
  for (const rel of files) {
    h.update(`--- ${rel} ---\n`);
    h.update(readFileSync(join(CORE_DIR, rel)));
    h.update('\n');
  }
  return h.digest('hex').slice(0, 12);
}

/** Strip lang/region conditional blocks for one (region, lang) target; extract meta descriptions. */
function render(template, { region, lang }) {
  const out = [];
  const stack = [];
  const meta = {};
  let inMeta = null;
  let metaBuf = [];

  for (const line of template.split('\n')) {
    const t = line.trim();

    if (inMeta) {
      const close = t.match(META_CLOSE_RE);
      if (close && close[1] === inMeta) {
        meta[inMeta] = metaBuf.join('\n').trim();
        inMeta = null;
        metaBuf = [];
      } else {
        metaBuf.push(line);
      }
      continue;
    }
    const open = t.match(META_OPEN_RE);
    if (open) {
      inMeta = open[1];
      metaBuf = [];
      continue;
    }

    const mk = t.match(MARKER_RE);
    if (mk) {
      const [, closing, kind, value] = mk;
      if (!closing) {
        stack.push({ kind, value });
      } else {
        const top = stack.pop();
        if (!top || top.kind !== kind || top.value !== value) {
          fail(`unbalanced marker "${t}"`);
        }
      }
      continue;
    }

    const pass = stack.every((c) => (c.kind === 'lang' ? c.value === lang : c.value === region));
    if (pass) out.push(line);
  }

  if (stack.length) fail(`unclosed conditional block (${stack.length} left open)`);
  if (inMeta) fail(`unclosed meta block "${inMeta}"`);
  return { text: out.join('\n'), meta };
}

/** Normalize spacing outside code fences: collapse blank runs, ensure a blank line before headings. */
function tidy(text) {
  const lines = text.split('\n');
  const res = [];
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const isFence = trimmed.startsWith('```');

    if (!inFence) {
      const prev = res.length ? res[res.length - 1] : '';
      if (trimmed === '' && prev.trim() === '') continue; // collapse blank runs
      const isHeading = trimmed.startsWith('#');
      if (isHeading && res.length && prev.trim() !== '') res.push(''); // blank line before headings
    }
    res.push(line);
    if (isFence) inFence = !inFence;
  }

  while (res.length && res[0].trim() === '') res.shift();
  while (res.length && res[res.length - 1].trim() === '') res.pop();
  return res.join('\n') + '\n';
}

function makeVars(config, lang) {
  const primary = config.primaryLang;
  const siteFile = lang === primary ? 'skill.md' : `skill.${lang}.md`;
  const repoFile = lang === primary ? 'SKILL.md' : `SKILL.${lang}.md`;
  const host = config.siteHost;
  return {
    REGION: config.region,
    SITE_HOST: host,
    ISSUER: config.issuer,
    API_URL: config.apiUrl,
    NPM_SCOPE: config.npmScope,
    NPM_REGISTRY: config.npmRegistry,
    ONBOARD_CMD: config.onboardCmd,
    PORTAL_ADMIN: config.portals.admin,
    PORTAL_USER: config.portals.user,
    PORTAL_SECURITY: config.portals.security,
    PORTAL_DEVELOPER: config.portals.developer,
    PORTAL_STATUS: config.portals.status,
    REPO_URL: config.repo,
    TUTORIAL_URL: `https://${host}/ai`,
    REFS_BASE: `https://${host}/ai/references`,
    MIRROR_LABEL: config.mirror.overrides?.[repoFile]?.label ?? config.mirror.label,
    MIRROR_SKILL_URL: `${config.mirror.overrides?.[repoFile]?.rawBase ?? config.mirror.rawBase}/${repoFile}`,
    SKILL_SELF_URL: `https://${host}/ai/${siteFile}`,
    SKILL_SHA_URL: `https://${host}/ai/${siteFile}.sha256`,
  };
}

function substitute(text, vars, label) {
  const missing = new Set();
  const result = text.replace(PLACEHOLDER_RE, (m, key) => {
    if (key in vars) return vars[key];
    missing.add(key);
    return m;
  });
  if (missing.size) fail(`${label}: unresolved placeholders: ${[...missing].join(', ')}`);
  if (result.includes('{{')) fail(`${label}: leftover "{{" in output`);
  if (/<!--\s*\/?(?:lang|region|meta):/.test(result)) fail(`${label}: leftover conditional marker`);
  return result;
}

function scanGates(region, label, text) {
  const hits = [];
  for (const [name, re] of BANNED_ALL) if (re.test(text)) hits.push(name);
  for (const [name, re] of BANNED_BY_REGION[region]) if (re.test(text)) hits.push(name);
  if (hits.length) {
    fail(`gate violation in ${label}: [${hits.join(', ')}]`);
  }
}

function buildSkillDoc(config, lang, rendered, vars, hash) {
  const description = rendered.meta[lang];
  if (!description) fail(`config.${config.region}: missing meta:description:${lang}`);
  const frontmatter = [
    '---',
    `name: autional-${config.region}-onboarding`,
    `description: ${JSON.stringify(description)}`,
    `region: ${config.region}`,
    `lang: ${lang}`,
    `canonical: ${vars.SKILL_SELF_URL}`,
    `generated: core@${hash}`,
    '---',
    '',
    '<!-- Generated by skills/_gen/build-skills.mjs from skills/_core — do not edit directly. -->',
    '',
  ].join('\n');
  return frontmatter + substitute(tidy(rendered.text), vars, `skill ${config.region}/${lang}`);
}

function buildReferenceDoc(config, rel, template, vars, hash, lang) {
  const rendered = render(template, { region: config.region, lang });
  const body = substitute(tidy(rendered.text), vars, `ref ${config.region}/${rel}`);
  const header = `<!-- generated: core@${hash} · region: ${config.region} · lang: ${lang} — do not edit directly -->\n\n`;
  return header + body;
}

// ---- main ----

const hash = coreHash();
const procedureTemplate = readFileSync(join(CORE_DIR, 'PROCEDURE.md'), 'utf8');
const refNames = readdirSync(join(CORE_DIR, 'references')).sort();
const refTemplates = refNames.map((f) => [f, readFileSync(join(CORE_DIR, 'references', f), 'utf8')]);

const configs = readdirSync(__dirname)
  .filter((f) => /^config\.[a-z]+\.json$/.test(f))
  .sort()
  .map((f) => JSON.parse(readFileSync(join(__dirname, f), 'utf8')));
if (configs.length === 0) fail('no config.<region>.json found in _gen/');

const planned = []; // { path, content, label }

for (const config of configs) {
  const regionDir = join(SKILLS_ROOT, `autional-${config.region}`);
  for (const lang of config.langs) {
    const vars = makeVars(config, lang);
    const rendered = render(procedureTemplate, { region: config.region, lang });
    const content = buildSkillDoc(config, lang, rendered, vars, hash);
    const fileName = lang === config.primaryLang ? 'SKILL.md' : `SKILL.${lang}.md`;
    const relPath = join(regionDir, fileName);
    scanGates(config.region, `autional-${config.region}/${fileName}`, content);
    planned.push({ path: relPath, content, label: `autional-${config.region}/${fileName}` });
  }
  // references are one language per region: the region's primary language
  const vars = makeVars(config, config.primaryLang);
  for (const [name, template] of refTemplates) {
    const content = buildReferenceDoc(config, name, template, vars, hash, config.primaryLang);
    const relPath = join(regionDir, 'references', name);
    scanGates(config.region, `autional-${config.region}/references/${name}`, content);
    planned.push({ path: relPath, content, label: `autional-${config.region}/references/${name}` });
  }
}

// fail-closed: nothing above writes; now compare / write
let stale = 0;
let written = 0;

for (const item of planned) {
  const disk = existsSync(item.path) ? readFileSync(item.path, 'utf8') : null;
  const same = disk === item.content;
  if (!same) stale += 1;
  if (CHECK_ONLY) {
    console.log(`[check] ${same ? 'ok       ' : 'STALE    '} ${item.label}`);
    continue;
  }
  if (same) {
    console.log(`[gen]   unchanged  ${item.label}`);
  } else {
    mkdirSync(dirname(item.path), { recursive: true });
    writeFileSync(item.path, item.content);
    written += 1;
    console.log(`[gen]   written    ${item.label}`);
  }
}

console.log(`[gen] core@${hash} · ${planned.length} files · ${CHECK_ONLY ? `${stale} stale` : `${written} written`} · gates PASS`);

if (CHECK_ONLY && stale > 0) {
  console.error(`[check] FAIL — ${stale} file(s) out of date; run: node build-skills.mjs`);
  process.exitCode = 1;
}
