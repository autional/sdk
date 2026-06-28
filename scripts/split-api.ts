/**
 * SDK API Package Splitter
 *
 * Reads the monolithic web/packages/shared/src/generated/api.ts
 * and splits by service into sdk/packages/api-{service}/src/index.ts
 *
 * Uses function name prefix heuristics to determine service ownership.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const API_FILE = path.resolve(__dirname, '../../web/packages/shared/src/generated/api.ts');
const TYPES_FILE = path.resolve(__dirname, '../../web/packages/shared/src/generated/types.ts');
const SDK_PACKAGES_DIR = path.resolve(__dirname, '../packages');

const SKIP_SERVICES = ['tsconfig'];

/** Function prefix → SDK package mapping */
const PREFIX_MAP: Record<string, string> = {
  auth: 'api-identity',
  adminRoles: 'api-identity',
  adminUsers: 'api-identity',
  adminPermissions: 'api-identity',
  adminAgents: 'api-identity',
  adminRobots: 'api-identity',
  adminIots: 'api-identity',
  adminAbacPolicies: 'api-identity',
  adminDelegationGrants: 'api-identity',
  adminApprovalRequests: 'api-identity',
  adminRoleActivations: 'api-identity',
  adminImpersonate: 'api-identity',
  adminDevices: 'api-identity',
  adminIdentityProviders: 'api-identity',
  adminAuth: 'api-identity',
  adminLdap: 'api-identity',
  authMe: 'api-identity',
  authApiKeys: 'api-identity',
  adminTokens: 'api-identity',
  adminPolicies: 'api-identity',
  adminCaptcha: 'api-identity',
  adminSecurityPassword: 'api-identity',
  adminSecurityAuth: 'api-identity',
  adminSecurityRisk: 'api-identity',
  adminSessions: 'api-identity',
  adminRelationships: 'api-identity',
  adminMakerChecker: 'api-identity',
  Public: 'api-identity',
  iots: 'api-identity',
  devices: 'api-identity',
  push: 'api-identity',
  scim: 'api-identity',
  saml: 'api-saml',
  adminSaml: 'api-saml',
  oauth: 'api-oauth',
  adminOauth: 'api-oauth',
  mfa: 'api-mfa',
  adminMfa: 'api-mfa',
  adminTotp: 'api-mfa',
  adminWebauthn: 'api-mfa',
  adminBackupCodes: 'api-mfa',
  profiles: 'api-profile',
  adminProfiles: 'api-profile',
  profile: 'api-profile',
  sessions: 'api-session',
  adminSessions: 'api-session',
  tenant: 'api-tenant',
  adminTenants: 'api-tenant',
  invitations: 'api-tenant',
  notifications: 'api-notification',
  adminNotifications: 'api-notification',
  announcements: 'api-notification',
  adminAnnouncements: 'api-notification',
  communications: 'api-communication',
  communication: 'api-communication',
  adminCommunication: 'api-communication',
  billing: 'api-billing',
  adminBilling: 'api-billing',
  wallets: 'api-wallet',
  adminWallets: 'api-wallet',
  adminWallet: 'api-wallet',
  points: 'api-point',
  adminPoints: 'api-point',
  adminPoint: 'api-point',
  adminPointRules: 'api-point',
  adminPayments: 'api-pay',
  payments: 'api-pay',
  refunds: 'api-pay',
  pay: 'api-pay',
  adminPay: 'api-pay',
  adminPayIntegrity: 'api-pay',
  files: 'api-storage',
  storage: 'api-storage',
  adminStorage: 'api-storage',
  folders: 'api-storage',
  adminFolders: 'api-storage',
  adminTrash: 'api-storage',
  adminAudit: 'api-audit',
  audit: 'api-audit',
  adminCompliance: 'api-compliance',
  compliance: 'api-compliance',
  verification: 'api-verification',
  adminVerification: 'api-verification',
  adminVerifications: 'api-verification',
  status: 'api-status',
  adminStatus: 'api-status',
  adminSecrets: 'api-secret',
  secret: 'api-secret',
  adminSecret: 'api-secret',
  adminOauthClients: 'api-oauth',
  adminOauthDevices: 'api-oauth',
  adminOauthTokens: 'api-oauth',
  adminOauthProviders: 'api-oauth',
  adminRelationships: 'api-rbac',
  adminRelation: 'api-rbac',
};

function classifyFn(name: string): string | null {
  // Direct prefix match (longest first)
  const sorted = Object.entries(PREFIX_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [prefix, pkg] of sorted) {
    if (name.startsWith(prefix)) return pkg;
  }

  // Heuristic: extract first camelCase word
  const firstWord = name.replace(/^([a-z]+).*$/, '$1');
  const known = PREFIX_MAP[firstWord];
  if (known) return known;

  // Try with 'admin' prefix removed
  if (name.startsWith('admin')) {
    const rest = name.replace(/^admin/, '');
    const restFirst = rest.replace(/^([A-Z][a-z]*).*$/, '$1').toLowerCase();
    if (restFirst && PREFIX_MAP[restFirst]) return PREFIX_MAP[restFirst];
  }

  return null;
}

function getApiContent(): string {
  return fs.readFileSync(API_FILE, 'utf-8');
}

function extractFunctions(content: string): Array<{ name: string; code: string }> {
  const regex = /^export async function (\w+)\(([^)]*)\) \{$[\s\S]*?^\}/gm;
  const functions: Array<{ name: string; code: string }> = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    functions.push({ name: match[1], code: match[0] });
  }
  return functions;
}

function main() {
  console.log('Loading api.ts...');
  const content = getApiContent();
  const functions = extractFunctions(content);
  console.log(`Found ${functions.length} functions`);

  // Group by package
  const grouped = new Map<string, Array<{ name: string; code: string }>>();
  const unmatched: string[] = [];

  for (const fn of functions) {
    const pkg = classifyFn(fn.name);
    if (pkg) {
      if (!grouped.has(pkg)) grouped.set(pkg, []);
      grouped.get(pkg)!.push(fn);
    } else {
      unmatched.push(fn.name);
    }
  }

  console.log(`Grouped: ${[...grouped.entries()].map(([k, v]) => `${k}(${v.length})`).join(', ')}`);
  if (unmatched.length > 0) {
    console.log(`Unmatched (${unmatched.length}): ${unmatched.slice(0, 10).join(', ')}...`);
  }

  // Generate for each package
  for (const [pkgName, fns] of grouped) {
    const pkgDir = path.join(SDK_PACKAGES_DIR, pkgName);
    if (!fs.existsSync(pkgDir)) {
      console.log(`  SKIP ${pkgName} — package directory does not exist`);
      continue;
    }
    if (SKIP_SERVICES.includes(pkgName)) continue;

    const indexFile = path.join(pkgDir, 'src', 'index.ts');
    const existing = fs.existsSync(indexFile) ? fs.readFileSync(indexFile, 'utf-8') : '';
    const existingFns = (existing.match(/^export function (\w+)/gm) || []).map(s => s.replace('export function ', ''));

    const newFns = fns.filter(f => !existingFns.includes(f.name));
    if (newFns.length === 0) {
      console.log(`  ${pkgName}: all ${fns.length} functions already exist, skipping`);
      continue;
    }

    // Convert to SDK format
    const converted = newFns.map(f => {
      // Change: import { apiClient as api } from '../api/client' → use client param
      let code = f.code
        .replace(/export async function (\w+)/, 'export function $1(client: ApiClient')
        .replace(/\(params\?\??:?[^)]*\)/, (match) => {
          // Add client param if it doesn't already have it
          if (match.includes('client:')) return match;
          return `(client: ApiClient${match === '()' ? '' : ', ' + match.slice(1)}`;
        })
        .replace(/api\.(get|post|put|delete)\(/g, 'client.$1(')
        .replace(/const res = /g, 'return ');

      // Remove res =, return directly
      code = code.replace(/\n\s+const res = client\./g, '\n  return client.');
      code = code.replace(/\n\s+return res\.data/g, '');

      return code;
    });

    // Append to existing file
    const appendContent = '\n' + converted.join('\n\n') + '\n';
    fs.appendFileSync(indexFile, appendContent);
    console.log(`  ${pkgName}: appended ${newFns.length} new functions (${fns.length} total)`);
  }

  console.log('Done.');
}

main();
