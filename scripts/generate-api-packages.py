#!/usr/bin/env python3
"""
Generate TypeScript API packages for the Autional SDK
from each service's committed swagger single source:
`shared/<svc>/internal/docs/docs.go` (swag-generated, version-controlled).

为什么不读 `swagger/swagger.json`：它被各服务 .gitignore 排除（本地产物），
fresh clone / CI 上不存在，且可能是旧一代 swag 的产物（响应包装器命名不同 ⇒
指纹与已提交的 docs.go 不一致）。docs.go 是仓库里唯一入库的 API 契约，
工作区守卫 scripts/ci/check-sdk-generated.py 也读它 —— 两侧同源，才不会有
"生成器按 A 生成、守卫按 B 校验" 的假绿/假红。

Output: sdk/packages/api-{prefix}/src/index.ts
        sdk/packages/api-{prefix}/package.json   (if new)
        sdk/packages/api-{prefix}/tsconfig.json  (if new)

Usage:
    python sdk/scripts/generate-api-packages.py
    python sdk/scripts/generate-api-packages.py --service profile-service
    python sdk/scripts/generate-api-packages.py --check --shared /clean/shared
"""

import json
import os
import re
import sys
from datetime import datetime

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SDK_DIR = os.path.join(PROJECT_ROOT, "sdk")
SDK_PACKAGES_DIR = os.path.join(SDK_DIR, "packages")
WORKSPACE_SHARED_DIR = os.path.join(PROJECT_ROOT, "shared")

# 入库的 swagger 单源（swagger/swagger.json 被 gitignore，只在本地存在）
DOCS_GO_REL = os.path.join("internal", "docs", "docs.go")
# swag 把描述里的反引号写成 Go 拼接转义；docs.go 是 Go 源码，还原后再解析
_DOC_BACKTICK_ESCAPE = '` + "`" + `'

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

# ApiClient 方法 → 引入该方法的 @autional/core 最低版本。
# 生成代码直接调用这些方法，package.json 的 peer 下限必须覆盖实际用到的最高者：
# 声明 ">=0.1.0" 会让消费者装上缺 patch 的 0.3.5，运行期 TypeError。
# 表单一是 scripts/client-methods.json：本生成器与 CI 守卫
# scripts/check-generated-packages.mjs 共读同一份表，杜绝「两处各写一份再漂移」。
CLIENT_METHODS_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "client-methods.json"
)


def _load_client_methods():
    with open(CLIENT_METHODS_PATH, encoding="utf-8") as f:
        table = (json.load(f) or {}).get("methods") or {}
    if not table:
        raise SystemExit(f"{CLIENT_METHODS_PATH} 缺少 methods 表（生成器与 CI 守卫的单一源）")
    return table


CLIENT_METHOD_MIN_CORE = _load_client_methods()

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
    fully-qualified names (gitee_com_..._dto_SecretResponse).

    swaggo 泛型包装器 (dto.DataResponse-...、dto.ListResponse-compliance_Evidence)
    绝不能和载荷定义塌缩成同名：那两个定义会被当成一个，载荷字段全部丢失。
    这里给包装器一个独立名字；包装器本身不会被输出（见 envelope_kind）。"""
    parts = name.split(".")
    short = parts[-1]
    short = re.sub(r"[^\w-]", "", short)
    for kind in ("DataResponse", "ListResponse"):
        if short.startswith(kind + "-"):
            param = short[len(kind) + 1:]
            if param.startswith("array_"):
                param = param[len("array_"):]
            return f"{kind}Of{sanitize_type_name(param)}"
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


# 响应包装器（swaggo 的 dto_base.DataResponse[T] / ListResponse[T]）在 swagger 里
# 各自是一个定义。ApiClient 在运行时总是解包（core/src/api-client.ts:33 unwrapResponse），
# 所以生成器必须只看载荷类型，绝不能把包装器名当成 TS 类型名——否则包装器与载荷
# 会塌缩成同一个标识符，载荷定义被静默丢弃（2026-10-28 修）。
ENVELOPE_DATA_KEYS = {"code", "data", "message", "timestamp"}
ENVELOPE_LIST_KEYS = {"code", "items", "message", "pagination", "timestamp", "total"}


def envelope_kind(def_name, definitions):
    """返回 'data' / 'items'（该定义是响应包装器）或 None（普通定义）。"""
    schema = definitions.get(def_name)
    if not schema:
        return None
    props = schema.get("properties") or {}
    if "code" not in props or "message" not in props:
        return None
    keys = set(props)
    if "data" in props and keys <= ENVELOPE_DATA_KEYS:
        return "data"
    if "items" in props and keys <= ENVELOPE_LIST_KEYS:
        return "items"
    return None


def _schema_ts_type(schema, definitions):
    """把包装器内部的 data/items 模式翻译成载荷 TS 类型。"""
    if not isinstance(schema, dict):
        return "unknown"
    if schema.get("type") == "array":
        items = schema.get("items") or {}
        ref = items.get("$ref", "")
        if ref.startswith("#/definitions/"):
            return sanitize_type_name(ref.replace("#/definitions/", "")) + "[]"
        return "unknown[]"
    ref = schema.get("$ref", "")
    if ref.startswith("#/definitions/"):
        return sanitize_type_name(ref.replace("#/definitions/", ""))
    return "unknown"


def envelope_payload_type(def_name, definitions):
    """包装器 → 运行时可拿到的载荷类型。
    DataResponse[X] -> 'X' / 'X[]'；ListResponse[X] -> 'ApiListResult<X>'。"""
    kind = envelope_kind(def_name, definitions)
    if not kind:
        return None
    props = (definitions.get(def_name) or {}).get("properties") or {}
    if kind == "data":
        return _schema_ts_type(props.get("data"), definitions)
    inner = _schema_ts_type(props.get("items"), definitions)
    if inner.endswith("[]"):
        inner = inner[:-2]
    return f"ApiListResult<{inner}>"


def definition_exists(def_name, definitions):
    """swagger $ref 指向的定义是否真实存在（键名可能带长包前缀）。"""
    if def_name in definitions:
        return True
    base = sanitize_type_name(def_name)
    return any(sanitize_type_name(k) == base for k in definitions)


def resolve_response_type(schema, definitions):
    """Resolve response type, unwrapping DataResponse<T>/ListResponse<T> envelopes.
    The SDK client always unwraps at runtime, so the generated type is the payload."""
    ref = schema.get("$ref", "")
    if ref and ref.startswith("#/definitions/"):
        def_name = ref.replace("#/definitions/", "")
        if not definition_exists(def_name, definitions):
            return "unknown"
        payload = envelope_payload_type(def_name, definitions)
        if payload:
            return payload
        return sanitize_type_name(def_name)
    return swagger_to_ts_type(schema, definitions)


def swagger_to_ts_type(schema, definitions, indent=0):
    if not schema:
        return "unknown"
    ref = schema.get("$ref", "")
    if ref and ref.startswith("#/definitions/"):
        def_name = ref.replace("#/definitions/", "")
        if not definition_exists(def_name, definitions):
            return "unknown"
        payload = envelope_payload_type(def_name, definitions)
        if payload:
            return payload
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


def service_dir_name(svc_name):
    """服务名 → 工作区目录名（oauth-service → service-oauth）。"""
    if svc_name.startswith("service-"):
        return svc_name
    suffix = "-service"
    if svc_name.endswith(suffix):
        return "service-" + svc_name[: -len(suffix)]
    return svc_name


def _extract_braced(text, start):
    """从 start（'{' 下标）做字符串感知的花括号配对切片，返回 JSON 对象文本。"""
    depth, i, in_str, esc = 0, start, False, False
    while i < len(text):
        c = text[i]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return text[start:i + 1]
        i += 1
    raise ValueError("花括号不配对（docTemplate 截断？）")


def parse_docs_go(text):
    """docs.go 源码 → {"paths": {...}, "definitions": {...}}。

    docTemplate 是 swag 的 Go 模板（schemes/host/basePath/info 含 `{{...}}` 占位），
    只有 paths 与 definitions 是纯 JSON ⇒ 对这两个子对象做字符串感知切片后 json.loads。
    不渲染模板：渲染 = 复刻 swag 的模板引擎，迟早与 swag 版本漂移。
    """
    text = text.replace(_DOC_BACKTICK_ESCAPE, "`")
    m = re.search(r"const docTemplate = `", text)
    if not m:
        raise ValueError("无 docTemplate（不是 swag 生成物？）")
    pm = re.compile(r'"paths"\s*:\s*\{').search(text, m.end())
    if not pm:
        raise ValueError("docTemplate 无 paths")
    paths = json.loads(_extract_braced(text, pm.end() - 1))
    dm = re.compile(r'\n\s{4}"definitions"\s*:\s*\{').search(text, pm.end())
    definitions = json.loads(_extract_braced(text, dm.end() - 1)) if dm else {}
    return {"paths": paths, "definitions": definitions}


def load_swagger(svc_name, shared_dir=None):
    """读服务入库的 internal/docs/docs.go → {"paths","definitions"}；缺失返回 None。"""
    root = shared_dir or WORKSPACE_SHARED_DIR
    docs_go = os.path.join(root, service_dir_name(svc_name), DOCS_GO_REL)
    if not os.path.isfile(docs_go) or os.path.getsize(docs_go) == 0:
        return None
    with open(docs_go, "r", encoding="utf-8", errors="replace") as f:
        return parse_docs_go(f.read())


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
            refs.add(m.group(1))
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

    # 传递闭包：定义之间可多层嵌套（响应 → Detail → 内层 DTO），逐轮展开直至收敛
    processed = set()
    while True:
        pending = refs - processed
        if not pending:
            break
        for name in list(pending):
            processed.add(name)
            schema = definitions.get(name)
            if schema:
                walk(schema)

    return refs


def generate_types(definitions, used_refs):
    lines = []
    lines.append("// ====== Types ======")
    lines.append("")

    # 列表端点的载荷类型由 ApiClient 在运行时解包而来，定义在生成文件里，
    # 不依赖 swagger 里那个「pagination 只是内联 object」的残缺定义。
    if any(envelope_kind(r, definitions) == "items" for r in used_refs):
        lines.append("/** 列表端点分页信息（ApiClient 解包后字段已转 camelCase）。 */")
        lines.append("export interface ApiPaginationInfo {")
        lines.append("  total: number;")
        lines.append("  page: number;")
        lines.append("  pageSize: number;")
        lines.append("  totalPages: number;")
        lines.append("  hasNext: boolean;")
        lines.append("  hasPrev: boolean;")
        lines.append("}")
        lines.append("")
        lines.append("/** 列表端点的运行时返回值：ApiClient 已解包为 { items, total, pagination }。 */")
        lines.append("export interface ApiListResult<T> {")
        lines.append("  items: T[];")
        lines.append("  total?: number;")
        lines.append("  pagination?: ApiPaginationInfo;")
        lines.append("}")
        lines.append("")

    generated = {}
    for ref_name in sorted(used_refs):
        # 响应包装器不是载荷类型：解包后它不会出现在运行时返回值里。
        if envelope_kind(ref_name, definitions):
            continue
        ts_name = sanitize_type_name(ref_name)
        schema = definitions.get(ref_name)
        if not schema:
            continue
        canon = json.dumps(schema, sort_keys=True)
        if ts_name in generated:
            prev_name, prev_canon = generated[ts_name]
            if prev_canon == canon:
                # 结构完全一致（如 dto.SimpleResponse 是 dto_base.SimpleResponse 的别名）：
                # 合并成一个接口，无损。
                continue
            # 名称塌缩会静默丢掉一个定义（2026-10-28 前的 D 类缺陷根因）。必须响亮失败。
            print(f"  ERROR: TS 名称冲突 {ts_name!r}: {prev_name} vs {ref_name}")
            sys.exit(1)

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

        generated[ts_name] = (ref_name, canon)

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

        # form-urlencoded 端点（OAuth token/introspect/revoke 等）无法用 ApiClient 的
        # JSON 序列化正确表达，跳过以免生成“看似可用、实际丢参”的函数。
        if any(p.get("in") == "formData" for p in ep["parameters"]):
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
            "body_type": body_type,
            "body_params": body_params,
            "query_params": query_params,
            "prefix": prefix,
        })

    needs_query_helper = any(
        fi["query_params"] and fi["method"] in ("POST", "PUT", "PATCH") for fi in func_infos
    )
    if needs_query_helper:
        lines.append("// ApiClient 的 post/put 不收 query 参数，这里统一拼接到 URL")
        lines.append("function appendQuery(url: string, params?: Record<string, unknown>): string {")
        lines.append("  if (!params) return url;")
        lines.append("  const query = new URLSearchParams();")
        lines.append("  for (const [k, v] of Object.entries(params)) {")
        lines.append("    if (v !== undefined && v !== null) query.append(k, String(v));")
        lines.append("  }")
        lines.append("  const qs = query.toString();")
        lines.append("  return qs ? `${url}?${qs}` : url;")
        lines.append("}")
        lines.append("")

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
            url_expr = f"appendQuery(`{url}`, params)" if config_parts else f"`{url}`"
            if body_params:
                lines.append(f"  return client.post({url_expr}, data);")
            else:
                lines.append(f"  return client.post({url_expr});")
        elif method == "PUT":
            url_expr = f"appendQuery(`{url}`, params)" if config_parts else f"`{url}`"
            if body_params:
                lines.append(f"  return client.put({url_expr}, data);")
            else:
                lines.append(f"  return client.put({url_expr});")
        elif method == "DELETE":
            if config_parts:
                lines.append(f"  return client.delete(`{url}`, params);")
            else:
                lines.append(f"  return client.delete(`{url}`);")
        elif method == "PATCH":
            # ApiClient.patch(path, data) 只收两个参数：query 与 PUT 一样拼进 URL。
            url_expr = f"appendQuery(`{url}`, params)" if config_parts else f"`{url}`"
            if body_params:
                lines.append(f"  return client.patch({url_expr}, data);")
            else:
                lines.append(f"  return client.patch({url_expr});")
        else:
            lines.append(f"  return client.{method.lower()}(`{url}`);")

        lines.append("}")
        lines.append("")

    return "\n".join(lines), func_infos


def generate_description(prefix, svc_name):
    cap = prefix[0].upper() + prefix[1:]
    cap = re.sub(r"-(\w)", lambda m: m.group(1).upper(), cap)
    return f"Autional {cap} API — auto-generated TypeScript client from {svc_name}"


def core_floor(methods):
    """按本包实际调用的 ApiClient 方法求 @autional/core 最低兼容版本。"""
    unknown = sorted({m.upper() for m in methods} - set(CLIENT_METHOD_MIN_CORE))
    if unknown:
        raise ValueError(
            f"未登记的 ApiClient 方法 {unknown}："
            "请在 scripts/client-methods.json 的 methods 表补上引入版本"
        )
    versions = [CLIENT_METHOD_MIN_CORE[m.upper()] for m in methods]
    if not versions:
        versions = ["0.1.0"]
    return max(versions, key=lambda v: tuple(int(p) for p in v.split(".")))


def expected_artifacts(name, prefix, definitions, endpoints):
    """生成器对某服务应产出的全部内容（不落盘）。"""
    content, func_infos = generate_index_file(prefix, name, definitions, endpoints)
    floor = core_floor({fi["method"] for fi in func_infos})
    return {
        "index": content,
        "readme": generate_readme(prefix, name, func_infos),
        "description": generate_description(prefix, name),
        "peer": f">={floor}",
        "func_infos": func_infos,
    }


# index.ts 头部的 `Generated: YYYY-MM-DD` 每天都变；比较前抹掉，否则永远假红。
DATE_LINE_RE = re.compile(r"^ \* Generated: \d{4}-\d{2}-\d{2}$", re.M)


def check_package(prefix, want):
    """对比已提交产物与生成器应产出；返回漂移项清单（空 = 一致）。"""
    pkg_dir = os.path.join(SDK_PACKAGES_DIR, f"api-{prefix}")

    def read(rel):
        p = os.path.join(pkg_dir, rel)
        if not os.path.isfile(p):
            return None
        with open(p, encoding="utf-8", newline="") as f:
            return f.read().replace("\r\n", "\n")

    drift = []
    cur = read(os.path.join("src", "index.ts"))
    if cur is None:
        drift.append("src/index.ts(缺失)")
    elif DATE_LINE_RE.sub("", cur) != DATE_LINE_RE.sub("", want["index"]):
        drift.append("src/index.ts")

    if read("README.md") != want["readme"]:
        drift.append("README.md")

    pkg = None
    try:
        pkg = json.loads(read("package.json") or "null")
    except ValueError:
        drift.append("package.json(非法 JSON)")
    if isinstance(pkg, dict):
        if pkg.get("description") != want["description"]:
            drift.append("package.json:description")
        for field in ("peerDependencies", "devDependencies"):
            if (pkg.get(field) or {}).get("@autional/core") != want["peer"]:
                drift.append(f"package.json:{field}")
    elif pkg is None:
        drift.append("package.json(缺失)")
    return drift


def generate_package_json(prefix, svc_name, floor):
    return json.dumps({
        "name": f"@autional/api-{prefix}",
        "version": "0.1.0",
        "description": generate_description(prefix, svc_name),
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
            "build": f"tsup src/index.ts --format cjs,esm --dts --clean --external @autional/core",
            "typecheck": "tsc --noEmit",
            "clean": "rimraf dist"
        },
        "files": [
            "dist",
            "src"
        ],
        "peerDependencies": {
            "@autional/core": f">={floor}"
        },
        "devDependencies": {
            "@autional/core": f">={floor}",
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
                "@autional/core": ["../core/src/index.ts"]
            }
        },
        "include": ["src"],
        "exclude": ["node_modules", "dist"]
    }, indent=2) + "\n"


def generate_readme(prefix, svc_name, func_infos):
    """README 由生成器单源产出。

    历史：20 个包的 README 是 identity README 的复制粘贴（16 份逐字节相同），
    标题、包名、函数表全部指向 @autional/api-identity。手写维护 = 必然再腐坏，
    所以与 index.ts 从同一份 func_infos 生成。
    """
    def cell(text):
        return " ".join(str(text).split()).replace("|", "\\|")

    def signature(fi):
        parts = ["client"]
        parts += [f"{camel_case(p)}: string" for p in fi["path_params"]]
        if fi["body_type"]:
            parts.append(f"data: {fi['body_type']}")
        if fi["query_params"]:
            parts.append("params?")
        return f"{fi['name']}({', '.join(parts)})"

    lines = []
    lines.append(f"# @autional/api-{prefix}")
    lines.append("")
    lines.append(f"{generate_description(prefix, svc_name)} ({len(func_infos)} functions).")
    lines.append("")
    lines.append("> Auto-generated by `python sdk/scripts/generate-api-packages.py`. Do not edit by hand.")
    lines.append("")
    lines.append("## Functions")
    lines.append("")
    lines.append("| Function | Method | Path | Description |")
    lines.append("|----------|--------|------|-------------|")
    for fi in func_infos:
        desc = fi["summary"] or "-"
        lines.append(
            f"| `{cell(signature(fi))}` | {fi['method']} | `{cell(fi['path'])}` | {cell(desc)} |"
        )
    lines.append("")
    lines.append("## Install")
    lines.append("")
    lines.append("```bash")
    lines.append(f"npm install @autional/core @autional/api-{prefix}")
    lines.append("```")
    lines.append("")

    # Quick Start 只挑「零参数」函数：能保证示例可复制即跑。没有就不编造调用。
    # 排序偏好在「根路径 + 短名」，让示例落在 /xxx 这类入口上，而不是嵌套子资源。
    simple = min(
        (fi for fi in func_infos
         if not fi["path_params"] and not fi["body_params"] and not fi["query_params"]),
        key=lambda fi: (len(fi["path"].strip("/").split("/")), len(fi["name"])),
        default=None,
    )
    lines.append("## Quick Start")
    lines.append("")
    lines.append("```ts")
    lines.append("import { Autional, browserPlatform } from '@autional/core';")
    if simple:
        lines.append(f"import {{ {simple['name']} }} from '@autional/api-{prefix}';")
    lines.append("")
    lines.append("const autional = new Autional({")
    lines.append("  appId: 'my-app',")
    lines.append("  issuer: 'https://auth.example.com', // your Autional server URL")
    lines.append("  platform: browserPlatform,")
    lines.append("});")
    lines.append("await autional.initialize();")
    if simple:
        lines.append("")
        lines.append("// 返回值已由 ApiClient 解包为载荷（不是 { code, data, message } 信封）")
        lines.append(f"const result = await {simple['name']}(autional.api);")
        lines.append("console.log(result);")
    lines.append("```")
    lines.append("")
    if not simple:
        lines.append("本包没有零参数端点；调用方式见上方 Functions 表（首参恒为 `autional.api`）。")
        lines.append("")
    lines.append("## Conventions")
    lines.append("")
    lines.append("- Every function takes the `ApiClient` as its first argument (`autional.api`).")
    lines.append("- Field names convert automatically: `camelCase` at the call site, `snake_case` on the wire.")
    lines.append("- Return values are unwrapped payloads, not `{ code, data, message }` envelopes.")
    lines.append("")
    lines.append("See the [root SDK README](../../README.md) for tokens, refresh, and OAuth flows.")
    lines.append("")
    return "\n".join(lines)


def generate_index_file(prefix, svc_name, definitions, endpoints):
    now = datetime.now().strftime("%Y-%m-%d")
    lines = []
    lines.append("/**")
    lines.append(f" * @autional/api-{prefix} \u2014 Auto-generated from {svc_name} internal/docs/docs.go")
    lines.append(f" * Generated: {now}")
    lines.append(f" * DO NOT EDIT \u2014 run `python sdk/scripts/generate-api-packages.py` to regenerate")
    lines.append(" */")
    lines.append("")
    lines.append("import type { ApiClient } from '@autional/core';")

    used_refs = collect_referenced_defs(endpoints, definitions)
    types_section = generate_types(definitions, used_refs)
    if types_section:
        lines.append("")
        lines.append(types_section)

    func_section, func_infos = generate_functions(endpoints, definitions, prefix)
    lines.append("")
    lines.append(func_section)

    return "\n".join(lines) + "\n", func_infos


def ensure_package_scaffold(prefix, func_infos):
    pkg_dir = os.path.join(SDK_PACKAGES_DIR, f"api-{prefix}")
    os.makedirs(os.path.join(pkg_dir, "src"), exist_ok=True)

    svc_name = next((s["name"] for s in SERVICES if s["prefix"] == prefix), f"{prefix}-service")
    floor = core_floor({fi["method"] for fi in func_infos})
    pkg_json_path = os.path.join(pkg_dir, "package.json")
    if not os.path.isfile(pkg_json_path):
        with open(pkg_json_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(generate_package_json(prefix, svc_name, floor))
        print(f"  Created {pkg_json_path}")
    else:
        # 描述与 peer 下限由生成器单源维护：历史上 15 个包被写成
        # 「Identity Service API」（模板写死），且核心版本下限长期冻结在
        # ">=0.1.0"（缺 patch 的旧核心能装进来，运行期 TypeError）。
        want = f'"description": {json.dumps(generate_description(prefix, svc_name), ensure_ascii=False)}'
        with open(pkg_json_path, "r", encoding="utf-8", newline="") as f:
            text = f.read()
        fixed = re.sub(r'"description":\s*"(?:[^"\\]|\\.)*"', want, text, count=1)
        fixed = re.sub(
            r'("@autional/core":\s*")[^"]*(")',
            lambda m: f"{m.group(1)}>={floor}{m.group(2)}",
            fixed,
        )
        if fixed != text:
            with open(pkg_json_path, "w", encoding="utf-8", newline="") as f:
                f.write(fixed)
            print(f"  Updated description/peer floor in {pkg_json_path}")

    tsconfig_path = os.path.join(pkg_dir, "tsconfig.json")
    if not os.path.isfile(tsconfig_path):
        with open(tsconfig_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(generate_tsconfig())
        print(f"  Created {tsconfig_path}")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Generate SDK API packages from service docs.go")
    parser.add_argument("--service", type=str, default="", help="Only process a specific service")
    parser.add_argument(
        "--check", action="store_true",
        help="只校验已提交产物是否与服务文档一致（不写包文件）；有漂移 ⇒ 退出码 1",
    )
    parser.add_argument(
        "--shared", type=str, default="",
        help="shared/ 目录（默认 = 工作区根下的 shared/）；用干净导出的树校验已提交包时可指定",
    )
    args = parser.parse_args()
    shared_dir = args.shared or WORKSPACE_SHARED_DIR

    filter_services = SERVICES
    if args.service:
        filter_services = [s for s in SERVICES if s["name"] == args.service]
        if not filter_services:
            print(f"Unknown service: {args.service}")
            sys.exit(1)

    total_generated = 0
    drifted = 0
    for svc in filter_services:
        name = svc["name"]
        prefix = svc["prefix"]

        if name in SKIP_SERVICES:
            if not args.check:
                print(f"[SKIP] {name} — excluded (gateway/hash services)")
            continue

        # --check 是全量校验：ALREADY_EXISTS 的包早已由生成器托管，普通生成
        # 仍按历史行为跳过它们，校验不能跳（跳过 = 假绿）。
        if prefix in ALREADY_EXISTS and not args.service and not args.check:
            print(f"[SKIP] {name} — already exists (manual maintenance)")
            continue

        swagger = load_swagger(name, shared_dir)
        if not swagger:
            print(f"[SKIP] {name} — no internal/docs/docs.go")
            continue

        definitions = swagger.get("definitions", {})
        endpoints = collect_endpoints(swagger)
        public_endpoints = [ep for ep in endpoints if not is_skipped_path(ep["path"])]

        if not public_endpoints:
            print(f"[SKIP] {name} — no public endpoints")
            continue

        want = expected_artifacts(name, prefix, definitions, endpoints)
        func_infos = want["func_infos"]

        if args.check:
            drift = check_package(prefix, want)
            if drift:
                drifted += 1
                print(f"[DRIFT] {name} → packages/api-{prefix}: {', '.join(drift)}")
            else:
                print(f"[OK] {name} → packages/api-{prefix} 与 swagger 一致")
        else:
            ensure_package_scaffold(prefix, func_infos)
            pkg_dir = os.path.join(SDK_PACKAGES_DIR, f"api-{prefix}")
            out_path = os.path.join(pkg_dir, "src", "index.ts")
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            with open(out_path, "w", encoding="utf-8", newline="\n") as f:
                f.write(want["index"])
            with open(os.path.join(pkg_dir, "README.md"), "w", encoding="utf-8", newline="\n") as f:
                f.write(want["readme"])

            total_generated += 1
            # 报实际产出数：form-urlencoded 端点在 generate_functions 内被跳过，
            # 按 public_endpoints 计数会虚报（profile 51 vs 50、oauth 55 vs 50）。
            skipped = len(public_endpoints) - len(func_infos)
            note = f", {skipped} skipped (formData)" if skipped else ""
            print(f"[OK] {name} → sdk/packages/api-{prefix}/src/index.ts "
                  f"({len(func_infos)} functions{note})")

    if args.check:
        print()
        print(f"Check: {drifted} drifted.")
        sys.exit(1 if drifted else 0)

    print()
    print(f"Done: {total_generated} packages generated.")
    print(f"Run `pnpm build` or `pnpm typecheck` in sdk/packages/api-* to verify.")


if __name__ == "__main__":
    main()
