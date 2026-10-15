// 构建产物契约断言（C7/C3N 修复的防回归守卫）。
// package.json 声明：
//   bundleDirectives:        { "<dist文件>": "use client" | null }  —— 必须带 / 必须不带该指令
//   bundleForbiddenImports:  { "<dist文件>": ["react", ...] }       —— 引号串精确匹配，禁引用
// 运行时机：各包 build 脚本末尾（postbuild）；发布链 pnpm build 先行，故亦覆盖发布前检查。
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const dir = process.cwd();
const fail = (msg) => { console.error(`[bundle-directives] FAIL ${dir}: ${msg}`); process.exit(1); };

const pkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
const directives = pkg.bundleDirectives ?? {};
const forbidden = pkg.bundleForbiddenImports ?? {};
if (Object.keys(directives).length === 0 && Object.keys(forbidden).length === 0) {
  process.exit(0);
}

/** 文件头指令序言：连续语句中的字符串字面量（跳过空行与 // 注释） */
function directivePrologue(src) {
  const found = [];
  for (const line of src.split('\n')) {
    const t = line.trim();
    if (t === '' || t.startsWith('//')) continue;
    const m = t.match(/^['"]([^'"]+)['"];?$/);
    if (!m) break;
    found.push(m[1]);
  }
  return found;
}

let checked = 0;
for (const [rel, want] of Object.entries(directives)) {
  const file = path.join(dir, rel);
  if (!existsSync(file)) fail(`declared bundle missing (build first): ${rel}`);
  const prologue = directivePrologue(readFileSync(file, 'utf8'));
  if (want === null) {
    // CJS 产物天然带 "use strict" 序言；null 仅表示不得携带 "use client"
    if (prologue.includes('use client')) fail(`${rel} must not carry "use client"`);
  } else if (!prologue.includes(want)) {
    fail(`${rel} must start with "${want}" (prologue: [${prologue.join(', ')}])`);
  }
  checked++;
}
for (const [rel, names] of Object.entries(forbidden)) {
  const file = path.join(dir, rel);
  if (!existsSync(file)) fail(`declared bundle missing (build first): ${rel}`);
  const src = readFileSync(file, 'utf8');
  const specifiers = [...src.matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
  for (const name of names) {
    if (specifiers.includes(name)) fail(`${rel} must not reference "${name}"`);
  }
  checked++;
}
console.log(`[bundle-directives] OK ${pkg.name} (${checked} files verified)`);
