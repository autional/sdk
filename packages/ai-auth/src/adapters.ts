/**
 * Runtime adapters.
 *
 * - Cloudflare Workers / Vercel Edge: the Web `Request`/`Response` handler is
 *   used directly.
 * - Node (including Vercel Node functions): convert IncomingMessage/ServerResponse
 *   to/from the Web standard objects.
 */

import type { AiAuth } from './types.js';

export type WebHandler = (request: Request) => Promise<Response>;

/** Cloudflare Workers `export default { fetch }`. */
export function createCloudflareHandler(auth: AiAuth): { fetch: WebHandler } {
  return { fetch: (request) => auth.route(request) };
}

/** Vercel Edge / Next.js App Router `export default`. */
export function createVercelEdgeHandler(auth: AiAuth): WebHandler {
  return (request) => auth.route(request);
}

interface NodeIncomingMessage {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  [Symbol.asyncIterator](): AsyncIterator<Uint8Array>;
}

interface NodeServerResponse {
  statusCode: number;
  setHeader(name: string, value: string | string[]): void;
  end(body?: Uint8Array | string): void;
}

function headerValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value.join(', ');
  return value;
}

function requestUrl(request: NodeIncomingMessage): string {
  const host = headerValue(request.headers['x-forwarded-host']) ?? headerValue(request.headers.host) ?? 'localhost';
  const proto = headerValue(request.headers['x-forwarded-proto']) ?? 'https';
  const path = request.url ?? '/';
  return `${proto}://${host}${path.startsWith('/') ? path : `/${path}`}`;
}

async function readBody(request: NodeIncomingMessage): Promise<Uint8Array | undefined> {
  const method = (request.method ?? 'GET').toUpperCase();
  if (method === 'GET' || method === 'HEAD') return undefined;
  const chunks: Uint8Array[] = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return undefined;
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/** Vercel Node runtime / plain Node `(req, res)` handler. */
export function createNodeHandler(auth: AiAuth): (req: NodeIncomingMessage, res: NodeServerResponse) => Promise<void> {
  return async (req, res) => {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined || key.toLowerCase() === 'set-cookie') continue;
      const joined = headerValue(value);
      if (joined !== undefined) headers.set(key, joined);
    }
    const body = await readBody(req);
    const request = new Request(requestUrl(req), {
      method: req.method ?? 'GET',
      headers,
      ...(body ? { body: body as BodyInit } : {}),
    });
    const response = await auth.route(request);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') return;
      res.setHeader(key, value);
    });
    const setCookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
    if (setCookies.length > 0) res.setHeader('set-cookie', setCookies);
    const arrayBuffer = await response.arrayBuffer();
    res.end(new Uint8Array(arrayBuffer));
  };
}
