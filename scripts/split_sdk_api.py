#!/usr/bin/env python3
"""Post-process generated api.ts into per-service SDK API packages."""
import os, re, shutil, json

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
API_TS = os.path.join(ROOT, "web", "packages", "shared", "src", "generated", "api.ts")
SDK_DIR = os.path.join(ROOT, "sdk", "packages")
TEMPLATE = os.path.join(SDK_DIR, "api-identity")

SERVICE_MAP = {
    "Audit Service": "api-audit", "Billing Service": "api-billing",
    "Communication Service": "api-communication", "Compliance Service": "api-compliance",
    "Gateway Service": None, "Identity Service": "api-identity",
    "Mfa Service": "api-mfa", "Notification Service": "api-notification",
    "Oauth Service": "api-oauth", "Pay Service": "api-pay",
    "Point Service": "api-point", "Profile Service": "api-profile",
    "Rbac Service": "api-rbac", "Saml Service": "api-saml",
    "Secret Service": "api-secret", "Session Service": "api-session",
    "Status Service": "api-status", "Storage Service": "api-storage",
    "Tenant Service": "api-tenant", "Thirdparty Service": "api-thirdparty",
    "Verification Service": "api-verification", "Wallet Service": "api-wallet",
}
SKIP = {"api-identity", "api-tenant", "api-mfa", "api-billing"}

def parse_blocks(lines):
    """Scan for 3-line separator pattern: // ====, // Service Name, // ===="""
    blocks = {}
    i = 0
    while i < len(lines) - 2:
        if (lines[i].strip().startswith("// ===") and
            "Service" in lines[i+1] and
            lines[i+2].strip().startswith("// ===")):
            title = lines[i+1].strip().lstrip("// ").strip()
            pkg = SERVICE_MAP.get(title)
            i += 3
            # Collect all lines until next separator pattern or end
            block_lines = []
            while i < len(lines) - 2:
                if (lines[i].strip().startswith("// ===") and
                    "Service" in lines[i+1] and
                    lines[i+2].strip().startswith("// ===")):
                    break
                block_lines.append(lines[i])
                i += 1
            if pkg and pkg not in SKIP and block_lines:
                blocks[pkg] = block_lines
            continue
        i += 1
    return blocks


def extract_fns(lines):
    """Extract exported functions from block lines using brace counting."""
    fns = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip().startswith("export async function "):
            i += 1
            continue
        # Collect function body with brace counting
        body = [line]
        i += 1
        depth = 0
        started = False
        while i < len(lines):
            l = lines[i]
            body.append(l)
            depth += l.count("{") - l.count("}")
            started = True
            i += 1
            if started and depth <= 0:
                break
        fns.append(body)
    return fns


def convert(fn_lines):
    """Convert api.ts function to SDK tree-shakeable format."""
    sig = fn_lines[0]
    m = re.match(r"export async function (\w+)\((.+)\) \{", sig)
    if not m:
        return None
    name = m.group(1)

    out = []
    out.append(f"export function {name}(client: ApiClient, data?: Record<string, unknown>) {{")

    for line in fn_lines[1:-1]:
        line = re.sub(r'\bapi\.(get|post|put|delete|patch)\s*\(', r'client.\1(', line)
        # Replace path params like `${id}` with data reference
        line = re.sub(r'\$\{(\w+)\}', lambda m: f'${{data?.{m.group(1)}}}', line)
        line = re.sub(r'const res\s*=\s*client\.', 'return client.', line)
        if 'return res.data' in line:
            continue
        out.append(line)

    out.append("}")
    return "\n".join(out)


def main():
    with open(API_TS, encoding="utf-8") as f:
        lines = f.readlines()

    blocks = parse_blocks(lines)
    print(f"Parsed {len(blocks)} service blocks")

    for pkg, blk in sorted(blocks.items()):
        fns = extract_fns(blk)
        if not fns:
            continue

        body = f"""// @ts-nocheck — auto-generated from swagger.json
/** @authms/{pkg} — auto-generated */
import type {{ ApiClient }} from '@authms/core';

"""
        for fn in fns:
            c = convert(fn)
            if c:
                body += c + "\n\n"

        pkg_dir = os.path.join(SDK_DIR, pkg)
        if not os.path.isdir(pkg_dir):
            shutil.copytree(TEMPLATE, pkg_dir, ignore=shutil.ignore_patterns("src", "node_modules", "dist"))
            pj = json.load(open(os.path.join(pkg_dir, "package.json"), encoding="utf-8"))
            pj["name"] = f"@authms/{pkg}"
            with open(os.path.join(pkg_dir, "package.json"), "w", encoding="utf-8") as f:
                json.dump(pj, f, indent=2)
                f.write("\n")

        idx = os.path.join(pkg_dir, "src", "index.ts")
        os.makedirs(os.path.dirname(idx), exist_ok=True)
        with open(idx, "w", encoding="utf-8") as f:
            f.write(body)

        n = body.count("export function ")
        print(f"  {pkg}: {n} functions")

if __name__ == "__main__":
    main()
