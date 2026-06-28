#!/usr/bin/env python3
"""
Generate TypeScript API packages for the AuthMS SDK
from micro-service swagger.json files.

Output: sdk/packages/api-{prefix}/src/index.ts
        sdk/packages/api-{prefix}/package.json   (if new)
        sdk/packages/api-{prefix}/tsconfig.json  (if new)

Usage:
    python sdk/scripts/generate-api-packages.py
    python sdk/scripts/generate-api-packages.py --service profile-service
"""

import json
import os
import re
import sys
from datetime import datetime

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SDK_DIR = os.path.join(PROJECT_ROOT, "sdk")
SDK_PACKAGES_DIR = os.path.join(SDK_DIR, "packages")
MICRO_SERVICES_DIR = os.path.join(PROJECT_ROOT, "micro-services")

SERVICES = [
    {"name": "identity-service",      "prefix": "identity"},
    {"name": "profile-service",       "prefix": "profile"},
    {"name": "tenant-service",        "prefix": "tenant"},
    {"name": "session-service",       "prefix": "session"},
    {"name": "mfa-service",           "prefix": "mfa"},
    {"name": "oauth-service",         "prefix": "oauth"},
    {"name": "point-service",         "prefix": "point"},
    {"name": "wallet-service",        "prefix": "wallet"},
    {"name": "audit-service",         "prefix": "audit"},
    {"name": "notification-service",  "prefix": "notification"},
    {"name": "communication-service", "prefix": "communication"},
    {"name": "storage-service",       "prefix": "storage"},
    {"name": "billing-service",       "prefix": "billing"},
    {"name": "compliance-service",    "prefix": "compliance"},
    {"name": "status-service",        "prefix": "status"},
    {"name": "gateway-service",       "prefix": "gateway"},
    {"name": "secret-service",        "prefix": "secret"},
    {"name": "rbac-service",          "prefix": "rbac"},
    {"name": "pay-service",            "prefix": "pay"},
    {"name": "verification-service",   "prefix": "verification"},
    {"name": "saml-service",           "prefix": "saml"},
    {"name": "hash-service-standard",  "prefix": "hash-standard"},
    {"name": "hash-service-sm",        "prefix": "hash-sm"},
    {"name": "thirdparty-service",     "prefix": "thirdparty"},
]

SKIP_SERVICES = {
    "gateway-service",
    "hash-service-standard",
    "hash-service-sm",
}

ALREADY_EXISTS = {
    "identity",
    "tenant",
    "mfa",
    "billing",
}

SKIP_PATHS = {
    "/health", "/ready", "/metrics",
    "/docs", "/docs/openapi.json",
    "/.well-known/jwks.json",
}

TYPE_MAP = {
    "string": "string",
    "integer": "number",
    "number": "number",
    "boolean": "boolean",
    "object": "Record<string, unknown>",
}

TS_RESERVED = {
    "delete", "export", "import", "new", "class", "function",
    "const", "let", "var", "type", "interface", "enum", "implements",
    "package", "private", "protected", "public", "static",
    "default", "switch", "case", "catch", "try", "throw", "finally",
}


def camel_case(s):
    parts = s.split("_")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def safe_identifier(name):
    name = name.replace("-", "_").replace(".", "_").replace(" ", "_")
    name = re.sub(r"[^\w]", "", name)
    if name and name[0].isdigit():
        name = "_" + name
    if name.lower() in TS_RESERVED:
        name = "_" + name
    return name


def sanitize_type_name(name):
    """Extract a clean TypeScript type name from a swagger definition key.
    Handles both short names (dto.ProfileListResponse) and
    fully-qualified names (gitee_com_..._dto_SecretResponse)."""
    parts = name.split(".")
    short = parts[-1]
    short = re.sub(r"[^\w-]", "", short)
    if len(short) > 50:
        segs = re.split(r"[_-]+", short)
        for i in range(len(segs) - 1, -1, -1):
            if segs[i] and len(segs[i]) >= 2 and segs[i][0].isupper():
                short = segs[i]
                break
    else:
        short = re.sub(r"[^\w]", "", short)
    if short and not short[0].isupper():
        short = short[0].upper() + short[1:]
    return short


def extract_inner_type_from_ref(ref_name):
    """Extract the inner DTO type from a swaggo-v2 generic wrapper.
    dto.DataResponse-gitee_com_..._dto_SecretResponse  ->  SecretResponse
    dto.DataResponse-array_gitee_..._dto_SecretResponse -> SecretResponse[]
    Returns str or None."""
    after_dot = ref_name.rsplit(".", 1)[-1] if "." in ref_name else ref_name
    dash_pos = after_dot.find("-")
    if dash_pos == -1:
        return None
    param = after_dot[dash_pos + 1:]
    is_array = False
    if param.startswith("array_"):
        is_array = True
        param = param[len("array_"):]
    inner = sanitize_type_name(param)
    return f"{inner}[]" if is_array else inner


def resolve_response_type(schema, definitions):
    """Resolve response type, unwrapping DataResponse<T>/ListResponse<T> envelopes."""
    ref = schema.get("$ref", "")
    if ref and ref.startswith("#/definitions/"):
        def_name = ref.replace("#/definitions/", "")
        base = sanitize_type_name(def_name)
        if base in ("DataResponse", "ListResponse"):
            inner = extract_inner_type_from_ref(def_name)
            if inner:
                return inner
        return base
    return swagger_to_ts_type(schema, definitions)


def swagger_to_ts_type(schema, definitions, indent=0):
    if not schema:
        return "unknown"
    ref = schema.get("$ref", "")
    if ref and ref.startswith("#/definitions/"):
        def_name = ref.replace("#/definitions/", "")
        return sanitize_type_name(def_name)
    stype = schema.get("type", "")
    if stype == "array":
        items = schema.get("items", {})
        inner = swagger_to_ts_type(items, definitions, indent)
        return f"{inner}[]"
    if "enum" in schema:
        values = schema["enum"]
        return " | ".join(f'"{v}"' for v in values)
    if "allOf" in schema:
        parts = []
        for sub in schema["allOf"]:
            parts.append(swagger_to_ts_type(sub, definitions, indent))
        return " & ".join(parts)
    if "additionalProperties" in schema:
        add_props = schema["additionalProperties"]
        if isinstance(add_props, dict):
            inner = swagger_to_ts_type(add_props, definitions, indent)
            return f"Record<string, {inner}>"
        return "Record<string, unknown>"
    if stype in TYPE_MAP:
        return TYPE_MAP[stype]
    return "unknown"


def format_ts_comment(text):
    if not text:
        return ""
    text = text.replace("\r\n", " ").replace("\n", " ").replace("\r", " ")
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > 120:
        text = text[:117] + "..."
    return text


def resource_segment(path, param):
    parts = [p for p in path.strip("/").split("/") if p]
    for i, p in enumerate(parts):
        if p == "{" + param + "}":
            if i > 0 and not parts[i - 1].startswith("{"):
                return safe_identifier(parts[i - 1])
            break
    return safe_identifier(param)


def is_skipped_path(path):
    return path in SKIP_PATHS or path.startswith("/internal/")


def load_swagger(svc_name):
    json_path = os.path.join(MICRO_SERVICES_DIR, svc_name, "docs", "swagger.json")
    if not os.path.isfile(json_path):
        return None
    if os.path.getsize(json_path) == 0:
        return None
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


def collect_endpoints(swagger):
    endpoints = []
    paths = swagger.get("paths", {})
    for path, methods in sorted(paths.items()):
        for method, detail in sorted(methods.items()):
            endpoints.append({
                "method": method.upper(),
                "path": path,
                "summary": detail.get("summary", ""),
                "description": detail.get("description", ""),
                "tags": detail.get("tags", []),
                "parameters": detail.get("parameters", []),
                "responses": detail.get("responses", {}),
            })
    return endpoints


def collect_referenced_defs(endpoints, definitions):
    refs = set()
    ref_pattern = re.compile(r'#/definitions/([^"]+)')

    def walk(schema):
        if not schema or not isinstance(schema, dict):
            return
        ref = schema.get("$ref", "")
        m = ref_pattern.match(ref)
        if m:
            ref_name = m.group(1)
            refs.add(ref_name)
            base = sanitize_type_name(ref_name)
            if base in ("DataResponse", "ListResponse"):
                inner = extract_inner_type_from_ref(ref_name)
                if inner:
                    inner_clean = inner.rstrip("[]")
                    for k in definitions:
                        if sanitize_type_name(k) == inner_clean:
                            refs.add(k)
                            break
        for key in ("items", "additionalProperties"):
            v = schema.get(key)
            if isinstance(v, dict):
                walk(v)
        for sub in schema.get("allOf", []):
            walk(sub)
        for sub in schema.get("oneOf", []):
            walk(sub)
        props = schema.get("properties", {})
        for pv in props.values():
            walk(pv)

    for ep in endpoints:
        for param in ep.get("parameters", []):
            walk(param.get("schema", {}))
        for code, resp in ep.get("responses", {}).items():
            walk(resp.get("schema", {}))

    def resolve_transitive(ref_name):
        if ref_name in refs:
            return
        refs.add(ref_name)
        schema = definitions.get(ref_name)
        if schema:
            walk(schema)

    pending = list(refs)
    while pending:
        name = pending.pop()
        resolve_transitive(name)

    return refs


SHARED_SKIP_TYPES = {"Problem", "PageInfo", "DataResponse", "ListResponse", "FieldViolation", "SimpleResponse"}


def generate_types(definitions, used_refs):
    lines = []
    lines.append("// ====== Types ======")
    lines.append("")

    generated = set()
    for ref_name in sorted(used_refs):
        ts_name = sanitize_type_name(ref_name)
        if ts_name in generated or ts_name in SHARED_SKIP_TYPES:
            continue
        schema = definitions.get(ref_name)
        if not schema:
            continue

        stype = schema.get("type", "")
        has_props = "properties" in schema
        has_allof = "allOf" in schema
        has_addprops = "additionalProperties" in schema
        has_enum = "enum" in schema
        has_items = stype == "array" and schema.get("items", {}).get("$ref")

        if not any([has_props, has_allof, has_addprops, has_enum, has_items]):
            if stype == "object":
                pass
            else:
                continue

        generated.add(ts_name)

        desc = schema.get("description", "")
        stype = schema.get("type", "")

        if desc:
            lines.append(f"/** {format_ts_comment(desc)} */")

        if "properties" in schema:
            lines.append(f"export interface {ts_name} {{")
            required_fields = schema.get("required", [])
            for prop_name, prop in sorted(schema["properties"].items()):
                req = prop_name in required_fields
                ts_prop_name = camel_case(safe_identifier(prop_name))
                ts_type = swagger_to_ts_type(prop, definitions)
                if not req:
                    ts_prop_name += "?"
                pdesc = prop.get("description", "")
                comment = ""
                if pdesc:
                    comment = f"  // {format_ts_comment(pdesc)}"
                lines.append(f"  {ts_prop_name}: {ts_type};{comment}")
            lines.append("}")
            lines.append("")

        elif "allOf" in schema:
            parts = []
            extra_props = {}
            for sub in schema["allOf"]:
                ref = sub.get("$ref", "")
                if ref:
                    parts.append(swagger_to_ts_type(sub, definitions))
                if sub.get("properties"):
                    extra_props.update(sub["properties"])
            if parts and extra_props:
                lines.append(f"export type {ts_name} = {' & '.join(parts)} & {{")
                for pn, pp in extra_props.items():
                    lines.append(f"  {camel_case(safe_identifier(pn))}: {swagger_to_ts_type(pp, definitions)};")
                lines.append("};")
                lines.append("")
            elif parts:
                lines.append(f"export type {ts_name} = {' & '.join(parts)};")
                lines.append("")

        elif "additionalProperties" in schema:
            add_props = schema["additionalProperties"]
            if isinstance(add_props, dict):
                inner = swagger_to_ts_type(add_props, definitions)
                lines.append(f"export type {ts_name} = Record<string, {inner}>;")
            else:
                lines.append(f"export type {ts_name} = Record<string, unknown>;")
            lines.append("")

        elif stype == "object" and not any(k in schema for k in ("properties", "allOf", "additionalProperties", "enum", "items")):
            lines.append(f"export type {ts_name} = Record<string, unknown>;")
            lines.append("")

        elif stype == "array":
            items = schema.get("items", {})
            if items.get("$ref"):
                inner = sanitize_type_name(items["$ref"].replace("#/definitions/", ""))
                lines.append(f"export type {ts_name} = {inner}[];")
                lines.append("")

        elif "enum" in schema:
            values = schema["enum"]
            ts_values = " | ".join(f'"{v}"' for v in values)
            lines.append(f"export type {ts_name} = {ts_values};")
            lines.append("")

    if len(lines) == 2:
        return ""
    return "\n".join(lines)


def build_function_name(path, method, svc_prefix):
    path_parts = [p for p in path.strip("/").split("/") if p]
    skip_prefixes = {"api", "v1"}
    meaningful = [p for p in path_parts if p not in skip_prefixes and not p.startswith("{")]

    if meaningful:
        base = camel_case("_".join(safe_identifier(s) for s in meaningful[:6]))
    else:
        fallback = [safe_identifier(p) for p in path_parts if not p.startswith("{")][:4]
        base = camel_case("_".join(fallback))

    path_params = re.findall(r"\{(\w+)\}", path)
    for pp in path_params:
        rs = resource_segment(path, pp)
        base += "By" + "".join(c[0].upper() + c[1:] for c in camel_case(rs).split("_"))

    func_name = method.lower() + base[0].upper() + base[1:]
    return func_name


def generate_functions(endpoints, definitions, prefix):
    lines = []
    lines.append("// ====== API Functions (tree-shakeable: independent exports) ======")
    lines.append("")

    seen_names = set()
    func_infos = []

    for ep in endpoints:
        method = ep["method"]
        path = ep["path"]
        summary = ep["summary"]
        desc = ep["description"]

        if is_skipped_path(path):
            continue

        func_name = build_function_name(path, method, prefix)
        if func_name in seen_names:
            i = 2
            while f"{func_name}{i}" in seen_names:
                i += 1
            func_name = f"{func_name}{i}"
        seen_names.add(func_name)

        path_params = re.findall(r"\{(\w+)\}", path)
        body_params = [p for p in ep["parameters"] if p.get("in") == "body"]
        query_params = [p for p in ep["parameters"] if p.get("in") == "query"]

        response_type = "void"
        for code, resp in ep["responses"].items():
            if code.startswith("20") or code.startswith("2"):
                schema = resp.get("schema") or {}
                rt = resolve_response_type(schema, definitions)
                if rt and rt != "unknown":
                    response_type = rt
                break

        param_list = [f"{camel_case(p)}: string" for p in path_params]

        body_type = None
        if body_params:
            bp = body_params[0]
            schema = bp.get("schema") or {}
            body_type = swagger_to_ts_type(schema, definitions)
            param_list.append(f"data: {body_type}")

        if query_params:
            qp_fields = []
            for qp in query_params:
                qname = qp["name"]
                qtype = swagger_to_ts_type(qp, definitions)
                qrequired = qp.get("required", False)
                if not qrequired:
                    qname += "?"
                qdesc = qp.get("description", "")
                comment = f"  // {qdesc}" if qdesc else ""
                qp_fields.append(f"  {qname}: {qtype};{comment}")
            if qp_fields:
                param_list.append("params?: {\n" + "\n".join(qp_fields) + "\n}")

        func_infos.append({
            "name": func_name,
            "summary": summary,
            "method": method,
            "path": path,
            "path_params": path_params,
            "param_list": param_list,
            "response_type": response_type,
            "body_params": body_params,
            "query_params": query_params,
            "prefix": prefix,
        })

    for fi in func_infos:
        summary = fi["summary"]
        if summary:
            lines.append(f"/** {format_ts_comment(summary)} */")

        params_str = ", ".join(fi["param_list"]) if fi["param_list"] else ""
        func_sig = f"export function {fi['name']}(client: ApiClient"
        if params_str:
            func_sig += f", {params_str}"
        func_sig += f"): Promise<{fi['response_type']}>"
        func_sig += " {"
        lines.append(func_sig)

        prefix = fi["prefix"]
        path = fi["path"]
        url = f"/{prefix}/api/v1{path}"
        for pp in fi["path_params"]:
            url = url.replace(f"{{{pp}}}", f"${{{camel_case(pp)}}}")

        method = fi["method"]
        body_params = fi["body_params"]
        query_params = fi["query_params"]

        config_parts = []
        if query_params:
            config_parts.append("params")

        if method == "GET":
            if config_parts:
                lines.append(f"  return client.get(`{url}`, {{ {' , '.join(config_parts)} }});")
            else:
                lines.append(f"  return client.get(`{url}`);")
        elif method == "POST":
            if body_params:
                if config_parts:
                    lines.append(f"  return client.post(`{url}`, data, {{ {' , '.join(config_parts)} }});")
                else:
                    lines.append(f"  return client.post(`{url}`, data);")
            else:
                if config_parts:
                    lines.append(f"  return client.post(`{url}`, undefined, {{ {' , '.join(config_parts)} }});")
                else:
                    lines.append(f"  return client.post(`{url}`);")
        elif method == "PUT":
            if body_params:
                if config_parts:
                    lines.append(f"  return client.put(`{url}`, data, {{ {' , '.join(config_parts)} }});")
                else:
                    lines.append(f"  return client.put(`{url}`, data);")
            else:
                if config_parts:
                    lines.append(f"  return client.put(`{url}`, {{ {' , '.join(config_parts)} }});")
                else:
                    lines.append(f"  return client.put(`{url}`);")
        elif method == "DELETE":
            delete_args = []
            if body_params:
                delete_args.append("data")
            delete_args.extend(config_parts)
            if delete_args:
                lines.append(f"  return client.delete(`{url}`, {{ {' , '.join(delete_args)} }});")
            else:
                lines.append(f"  return client.delete(`{url}`);")
        elif method == "PATCH":
            if body_params:
                if config_parts:
                    lines.append(f"  return client.patch(`{url}`, data, {{ {' , '.join(config_parts)} }});")
                else:
                    lines.append(f"  return client.patch(`{url}`, data);")
            else:
                if config_parts:
                    lines.append(f"  return client.patch(`{url}`, {{ {' , '.join(config_parts)} }});")
                else:
                    lines.append(f"  return client.patch(`{url}`);")
        else:
            lines.append(f"  return client.{method.lower()}(`{url}`);")

        lines.append("}")
        lines.append("")

    return "\n".join(lines), func_infos


def generate_module_augmentation(prefix, func_infos):
    cap = prefix[0].upper() + prefix[1:]
    cap = re.sub(r"-(\w)", lambda m: m.group(1).upper(), cap)

    lines = []
    lines.append("// ====== Module Augmentation =====")
    lines.append(f"// Installing this package auto-types useAuthms().api.{prefix}")
    lines.append("")
    lines.append(f"export interface {cap}Api {{")
    for fi in func_infos:
        param_types = fi["param_list"]
        if param_types:
            lines.append(f"  {fi['name']}: typeof {fi['name']};")
        else:
            lines.append(f"  {fi['name']}: typeof {fi['name']};")
    lines.append("}")
    lines.append("")
    lines.append("declare module '@authms/core' {")
    lines.append("  interface RegisteredApis {")
    lines.append(f"    {prefix}: {cap}Api;")
    lines.append("  }")
    lines.append("}")
    return "\n".join(lines)


def generate_package_json(prefix, svc_name):
    cap = prefix[0].upper() + prefix[1:]
    cap = re.sub(r"-(\w)", lambda m: m.group(1).upper(), cap)
    return json.dumps({
        "name": f"@authms/api-{prefix}",
        "version": "0.1.0",
        "description": f"AuthMS {cap} API — auto-generated TypeScript client from {svc_name}",
        "main": "./dist/index.js",
        "module": "./dist/index.mjs",
        "types": "./dist/index.d.ts",
        "exports": {
            ".": {
                "types": "./dist/index.d.ts",
                "import": "./dist/index.mjs",
                "require": "./dist/index.js"
            }
        },
        "sideEffects": False,
        "scripts": {
            "build": f"tsup src/index.ts --format cjs,esm --dts --clean --external @authms/core",
            "typecheck": "tsc --noEmit",
            "clean": "rimraf dist"
        },
        "files": [
            "dist",
            "src"
        ],
        "peerDependencies": {
            "@authms/core": ">=0.1.0"
        },
        "devDependencies": {
            "@authms/core": ">=0.1.0",
            "rimraf": "^5.0.0",
            "tsup": "^8.4.0",
            "typescript": "^5.8.0"
        },
        "license": "MIT"
    }, indent=2) + "\n"


def generate_tsconfig():
    return json.dumps({
        "extends": "../../tsconfig.base.json",
        "compilerOptions": {
            "paths": {
                "@authms/core": ["../core/src/index.ts"]
            }
        },
        "include": ["src"],
        "exclude": ["node_modules", "dist"]
    }, indent=2) + "\n"


def generate_index_file(prefix, svc_name, definitions, endpoints):
    now = datetime.now().strftime("%Y-%m-%d")
    lines = []
    lines.append("/**")
    lines.append(f" * @authms/api-{prefix} \u2014 Auto-generated from {svc_name} swagger.json")
    lines.append(f" * Generated: {now}")
    lines.append(f" * DO NOT EDIT \u2014 run `python sdk/scripts/generate-api-packages.py` to regenerate")
    lines.append(" */")
    lines.append("")
    lines.append("import type { ApiClient } from '@authms/core';")

    used_refs = collect_referenced_defs(endpoints, definitions)
    types_section = generate_types(definitions, used_refs)
    if types_section:
        lines.append("")
        lines.append(types_section)

    func_section, func_infos = generate_functions(endpoints, definitions, prefix)
    lines.append("")
    lines.append(func_section)

    if func_infos:
        aug_section = generate_module_augmentation(prefix, func_infos)
        lines.append(aug_section)

    return "\n".join(lines)


def ensure_package_scaffold(prefix):
    pkg_dir = os.path.join(SDK_PACKAGES_DIR, f"api-{prefix}")
    os.makedirs(os.path.join(pkg_dir, "src"), exist_ok=True)

    pkg_json_path = os.path.join(pkg_dir, "package.json")
    if not os.path.isfile(pkg_json_path):
        svc_name = next((s["name"] for s in SERVICES if s["prefix"] == prefix), f"{prefix}-service")
        with open(pkg_json_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(generate_package_json(prefix, svc_name))
        print(f"  Created {pkg_json_path}")

    tsconfig_path = os.path.join(pkg_dir, "tsconfig.json")
    if not os.path.isfile(tsconfig_path):
        with open(tsconfig_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(generate_tsconfig())
        print(f"  Created {tsconfig_path}")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Generate SDK API packages from swagger.json")
    parser.add_argument("--service", type=str, default="", help="Only process a specific service")
    args = parser.parse_args()

    filter_services = SERVICES
    if args.service:
        filter_services = [s for s in SERVICES if s["name"] == args.service]
        if not filter_services:
            print(f"Unknown service: {args.service}")
            sys.exit(1)

    total_generated = 0
    for svc in filter_services:
        name = svc["name"]
        prefix = svc["prefix"]

        if name in SKIP_SERVICES:
            print(f"[SKIP] {name} \u2014 excluded (gateway/hash services)")
            continue

        if prefix in ALREADY_EXISTS and not args.service:
            print(f"[SKIP] {name} \u2014 already exists (manual maintenance)")
            continue

        swagger = load_swagger(name)
        if not swagger:
            print(f"[SKIP] {name} \u2014 no swagger.json")
            continue

        definitions = swagger.get("definitions", {})
        endpoints = collect_endpoints(swagger)
        public_endpoints = [ep for ep in endpoints if not is_skipped_path(ep["path"])]

        if not public_endpoints:
            print(f"[SKIP] {name} \u2014 no public endpoints")
            continue

        ensure_package_scaffold(prefix)

        content = generate_index_file(prefix, name, definitions, endpoints)
        out_path = os.path.join(SDK_PACKAGES_DIR, f"api-{prefix}", "src", "index.ts")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)

        total_generated += 1
        func_count = sum(1 for ep in public_endpoints)
        print(f"[OK] {name} \u2192 sdk/packages/api-{prefix}/src/index.ts ({func_count} functions)")

    print()
    print(f"Done: {total_generated} packages generated.")
    print(f"Run `pnpm build` or `pnpm typecheck` in sdk/packages/api-* to verify.")


if __name__ == "__main__":
    main()
