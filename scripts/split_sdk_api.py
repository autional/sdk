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
    """Extract exported functions from block lines. Handles multi-line signatures."""
    fns = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip().startswith("export async function "):
            i += 1
            continue

        # Collect lines until we find the function body opening ') {'
        # Multi-line params can contain { } braces (object types)
        fn_start = i
        while i < len(lines) and not (') {' in lines[i] and lines[i].strip().startswith(('}', ')', 'export'))):
            i += 1
        if i >= len(lines):
            break

        # Now i points to the line with ') {'
        sig_lines = lines[fn_start:i+1]
        
        # Collect body with simple brace counting from ') {'
        body_lines = []
        depth = 0
        started = False
        j = i
        # The ') {' line itself contains the opening brace
        body_lines.append(lines[j])
        depth += lines[j].count("{") - lines[j].count("}")
        started = True
        j += 1
        
        while j < len(lines):
            l = lines[j]
            body_lines.append(l)
            depth += l.count("{") - l.count("}")
            j += 1
            if started and depth <= 0:
                break
        
        # Combine signature first line with rest
        fn_lines = [lines[fn_start]] + body_lines
        fns.append(fn_lines)
        i = j

    return fns


def convert(fn_lines):
    """Convert api.ts function to SDK tree-shakeable format."""
    sig_line = fn_lines[0]
    m = re.match(r"export async function (\w+)", sig_line)
    if not m:
        return None
    name = m.group(1)

    # Extract the API call line from the function body
    api_call = None
    for line in fn_lines:
        if 'api.get(' in line or 'api.post(' in line or 'api.put(' in line or 'api.delete(' in line or 'api.patch(' in line:
            api_call = line.strip()
            break

    if not api_call:
        return None

    # Convert: const res = await api.get(`/path`, ...) → return client.get(`/path`)
    # Also: await api.delete(...) → client.delete(...)
    api_call = re.sub(r'(const res\s*=\s*)?await api\.', 'return client.', api_call)
    api_call = api_call.rstrip(';')

    return f"""export function {name}(client: ApiClient, data?: Record<string, unknown>) {{
  {api_call};
}}"""


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
