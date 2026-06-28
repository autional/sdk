#!/usr/bin/env python3
"""
Split the monolithic api.ts into per-service SDK API packages.

Usage:
  python scripts/generate/generate_api_ts.py   # First, generate api.ts
  python scripts/split_sdk_api.py              # Then, split into SDK packages
"""
import os, re, json, shutil
from datetime import datetime

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
API_FILE = os.path.join(PROJECT_ROOT, "web", "packages", "shared", "src", "generated", "api.ts")
SDK_DIR = os.path.join(PROJECT_ROOT, "sdk", "packages")

SERVICE_TEMPLATE = os.path.join(SDK_DIR, "api-identity")
if not os.path.isdir(SERVICE_TEMPLATE):
    print(f"Template not found: {SERVICE_TEMPLATE}")
    exit(1)

# Service header → SDK package name
# Based on the header comments in api.ts (e.g. "// Identity Service")
TITLE_TO_PKG = {
    "Identity Service": "api-identity",
    "Tenant Service": "api-tenant",
    "Mfa Service": "api-mfa",
    "Oauth Service": "api-oauth",
    "Session Service": "api-session",
    "Profile Service": "api-profile",
    "Billing Service": "api-billing",
    "Wallet Service": "api-wallet",
    "Point Service": "api-point",
    "Notification Service": "api-notification",
    "Communication Service": "api-communication",
    "Storage Service": "api-storage",
    "Audit Service": "api-audit",
    "Compliance Service": "api-compliance",
    "Status Service": "api-status",
    "Pay Service": "api-pay",
    "Verification Service": "api-verification",
    "Saml Service": "api-saml",
    "Secret Service": "api-secret",
    "Rbac Service": "api-rbac",
    "Thirdparty Service": "api-thirdparty",
}

HEADER_PATTERN = re.compile(r"^// =+\s*$")
TITLE_PATTERN = re.compile(r"^// (.+)$")

def split_api(api_content):
    """Split api.ts content into per-service blocks."""
    lines = api_content.split("\n")
    blocks = {}
    current_svc = None
    current_lines = []
    in_header = False
    header_line = ""

    for line in lines:
        stripped = line.strip()
        
        # Detect service header: three lines — // ===..., // Title, // ===...
        if HEADER_PATTERN.match(stripped):
            if in_header:
                in_header = False
                if current_svc:
                    blocks[current_svc] = current_lines
                    current_lines = []
                current_svc = None
            else:
                in_header = True
                continue

        if in_header and not current_svc:
            # Second line of header = service title
            current_svc = stripped.lstrip("// ").strip()
            continue

        if current_svc:
            current_lines.append(line)
        elif not current_svc and len(current_lines) == 0:
            # Preamble (imports, etc.)
            continue

    # Last block
    if current_svc and current_lines:
        blocks[current_svc] = current_lines

    return blocks


def convert_to_sdk(lines, pkg_name):
    """Convert raw api.ts function to SDK format."""
    sdk_lines = []
    sdk_lines.append("/**")
    sdk_lines.append(f" * @authms/{pkg_name} — Auto-generated from swagger.json")
    sdk_lines.append(f" * Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sdk_lines.append(" * DO NOT EDIT — run `pnpm generate:api` to regenerate")
    sdk_lines.append(" */")
    sdk_lines.append("")
    sdk_lines.append("import type { ApiClient } from '@authms/core';")
    sdk_lines.append("")

    func_pattern = re.compile(r"^export async function (\w+)\((.*?)\) \{\s*$")
    api_pattern = re.compile(r"api\.(get|post|put|delete)\(")
    res_pattern = re.compile(r"const res = ")
    ts_nocheck = False

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Skip comment separators and empty preamble
        if stripped.startswith("// ===") or stripped.startswith("// "):
            i += 1
            continue

        if not stripped:
            i += 1
            continue

        # Function declaration
        m = func_pattern.match(stripped)
        if m:
            func_name = m.group(1)
            params = m.group(2)

            # Build SDK-style function signature
            # Change: export async function xxx(params?) { ... }
            # To:     export function xxx(client: ApiClient, data?) { ... }
            
            sdk_lines.append(f"export function {func_name}(client: ApiClient, {params}) {{")
            
            # Collect function body until closing brace
            i += 1
            while i < len(lines):
                body_line = lines[i]
                
                # Replace api.get/post/put/delete with client.get/post/put/delete
                body_line = re.sub(r'\bapi\.(get|post|put|delete)\(', r'client.\1(', body_line)
                
                # Replace res =  with return 
                body_line = body_line.replace('const res = ', 'return ')
                body_line = body_line.replace('  return res.data;\n', '')
                
                sdk_lines.append(body_line)
                
                if body_line.strip() == '}':
                    sdk_lines.append('')
                    break
                i += 1
            i += 1
            continue

        i += 1

    return "\n".join(sdk_lines)


def create_package(pkg_name, content, title):
    """Create or update an SDK API package."""
    pkg_dir = os.path.join(SDK_DIR, pkg_name)
    template_dir = os.path.join(SDK_DIR, "api-identity")

    if not os.path.isdir(pkg_dir):
        # Copy template
        shutil.copytree(template_dir, pkg_dir, ignore=shutil.ignore_patterns("src", "node_modules", "dist"))
        # Update package.json name
        pj = os.path.join(pkg_dir, "package.json")
        with open(pj, encoding="utf-8") as f:
            data = json.load(f)
        data["name"] = f"@authms/{pkg_name}"
        data["description"] = f"AuthMS {title} API — auto-generated TypeScript client"
        with open(pj, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            f.write("\n")

    # Write index.ts
    idx = os.path.join(pkg_dir, "src", "index.ts")
    os.makedirs(os.path.dirname(idx), exist_ok=True)
    with open(idx, "w", encoding="utf-8") as f:
        f.write(content)

    func_count = content.count("export function ")
    print(f"  {pkg_name}: {func_count} functions")

def main():
    with open(API_FILE, encoding="utf-8") as f:
        content = f.read()

    blocks = split_api(content)
    print(f"Found {len(blocks)} service blocks")

    generated = 0
    for title, lines in blocks.items():
        pkg = TITLE_TO_PKG.get(title)
        if not pkg:
            print(f"  UNKNOWN service: {title}")
            continue

        if pkg in ("api-identity", "api-tenant", "api-mfa", "api-billing"):
            print(f"  SKIP {pkg} — already exists")
            continue

        sdk_content = convert_to_sdk(lines, pkg)
        create_package(pkg, sdk_content, title)
        generated += 1

    print(f"\nGenerated {generated} new packages")

if __name__ == "__main__":
    main()
