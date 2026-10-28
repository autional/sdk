#!/usr/bin/env node
/**
 * SDK 生成物一致性守卫（CI 门）。只看已提交的包，不需要 swagger / 服务仓。
 *
 * 守三类历史缺陷（2026-10-28 波次根因，全部在 npm 上真实发生过）：
 *   1. README / description 身份串复制——20 个包的 README 逐字节相同，
 *      标题、包名、函数表全指向 @autional/api-identity。
 *   2. @autional/core 下限写死 ">=0.1.0"——生成代码调用 patch（core 0.3.6 才有），
 *      消费者装到 0.3.5 会在运行期 TypeError。
 *   3. README 函数表与 src/index.ts 的 export function 数量不符——
 *      formData 端点被生成器跳过，计数却按 public_endpoints 报。
 *
 * 方法表单源：scripts/client-methods.json（生成器 generate-api-packages.py 同读）。
 * 退出码：0 = 一致；1 = 有漂移；2 = 环境错误（表缺失 / 扫描面为空）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PKGS = path.join(ROOT, 'packages');

function envErr(msg) {
  console.error(`[ENVERR] ${msg}`);
  process.exit(2);
}

let methodTable;
try {
  methodTable = JSON.parse(fs.readFileSync(path.join(HERE, 'client-methods.json'), 'utf8')).methods;
} catch (e) {
  envErr(`读不到 scripts/client-methods.json：${e.message}`);
}
if (!methodTable || Object.keys(methodTable).length === 0) {
  envErr('client-methods.json 缺 methods 表（生成器与守卫的单一源）');
}

const cmpVersion = (a, b) => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d;
  }
  return 0;
};

// 与生成器 core_floor 同语义：已登记方法取最高版本；一个都没用到则 0.1.0。
function coreFloor(methods) {
  const unknown = [...new Set(methods)].filter((m) => !(m in methodTable)).sort();
  if (unknown.length) {
    throw new Error(`未登记的 ApiClient 方法 ${unknown.join(',')}：请在 scripts/client-methods.json 补上`);
  }
  if (methods.length === 0) return '0.1.0';
  return methods.reduce((hi, m) => (cmpVersion(methodTable[m], hi) > 0 ? methodTable[m] : hi), '0.1.0');
}

// 与生成器 generate_description 的 cap 规则一致：首字母大写 + 连字符后大写。
const capPrefix = (p) => p.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());

const dirs = fs.existsSync(PKGS)
  ? fs.readdirSync(PKGS).filter((d) => d.startsWith('api-')).sort()
  : [];
if (dirs.length === 0) envErr(`扫描面为空：${PKGS} 下没有 api-* 包`);

const failures = [];
const check = (pkg, condition, message) => {
  if (!condition) failures.push(`${pkg}: ${message}`);
};

for (const dir of dirs) {
  const prefix = dir.slice('api-'.length);
  const pkgDir = path.join(PKGS, dir);
  const read = (rel) => {
    const p = path.join(pkgDir, rel);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n') : null;
  };

  const rawPkg = read('package.json');
  const index = read('src/index.ts');
  const readme = read('README.md');
  if (rawPkg === null || index === null || readme === null) {
    failures.push(`${dir}: 缺 package.json / src/index.ts / README.md`);
    continue;
  }

  let pkg;
  try {
    pkg = JSON.parse(rawPkg);
  } catch (e) {
    failures.push(`${dir}: package.json 非法 JSON（${e.message}）`);
    continue;
  }

  check(dir, pkg.name === `@autional/api-${prefix}`, `package.json name 应为 @autional/api-${prefix}，实为 ${pkg.name}`);

  const wantDescHead = `Autional ${capPrefix(prefix)} API`;
  check(
    dir,
    typeof pkg.description === 'string' && pkg.description.startsWith(wantDescHead),
    `description 应以 "${wantDescHead}" 开头（身份串复制），实为 ${JSON.stringify(pkg.description)}`,
  );

  // 取**任意** client.<ident>( 或 client.<ident>< 调用：未知标识交给 coreFloor 报错（fail-closed），
  // 而不是用白名单正则把它们静默漏掉（漏掉 ⇒ floor 退回 0.1.0 ⇒ peer 下限悄悄放宽）。
  const used = [...index.matchAll(/\bclient\.([A-Za-z_$][\w$]*)\s*[<(]/g)].map((m) => m[1].toUpperCase());
  let floor;
  try {
    floor = coreFloor(used);
  } catch (e) {
    failures.push(`${dir}: ${e.message}`);
    continue;
  }
  const wantPeer = `>=${floor}`;
  for (const field of ['peerDependencies', 'devDependencies']) {
    const got = (pkg[field] || {})['@autional/core'];
    check(dir, got === wantPeer, `${field}["@autional/core"] 应为 ${wantPeer}（实际用到 ${[...new Set(used)].sort().join(',')}），实为 ${got}`);
  }

  const firstLine = readme.split('\n')[0].trim();
  check(dir, firstLine === `# @autional/api-${prefix}`, `README 首行应为 "# @autional/api-${prefix}"，实为 ${JSON.stringify(firstLine)}`);

  const exported = (index.match(/^export function /gm) || []).length;
  const tableRows = (readme.match(/^\| `/gm) || []).length;
  check(dir, exported > 0, 'src/index.ts 没有 export function（生成物为空）');
  check(dir, exported === tableRows, `README 函数表 ${tableRows} 行 ≠ src/index.ts ${exported} 个导出函数`);

  check(dir, !index.includes('RegisteredApis'), 'src/index.ts 残留已废弃的 RegisteredApis 模块增强');
}

if (failures.length) {
  console.error(`[FAIL] SDK 生成物漂移 ${failures.length} 项：`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error('修复：在工作区根跑 `python sdk/scripts/generate-api-packages.py` 后重新提交。');
  process.exit(1);
}

console.log(`[OK] ${dirs.length} 个 api-* 包一致（描述/README/peer 下限/函数计数）。`);
