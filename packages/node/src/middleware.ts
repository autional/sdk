/**
 * Autional Node.js SDK — Express / Fastify 中间件
 *
 * 提供服务器端 JWT token 验证能力。
 * 使用方式:
 *   Express: app.use(autionalExpress({ issuer: '...', apiUrl: '...' }))
 *   Fastify: app.register(autionalFastify, { issuer: '...', apiUrl: '...' })
 */
import { Autional, browserPlatform, type AutionalConfig } from '@autional/core';

export interface NodeAutionalConfig {
  issuer: string;
  apiUrl?: string;
  appId?: string;
  /** 排除路径（不验证 token） */
  exclude?: string[];
}

/**
 * Express 中间件——验证 Bearer token 并注入 req.user
 */
export function autionalExpress(config: NodeAutionalConfig) {
  const autional = new Autional({
    appId: config.appId || 'node-sdk',
    issuer: config.issuer,
    apiUrl: config.apiUrl,
    platform: browserPlatform,
    syncTabs: false,
  });

  autional.initialize().catch(() => {});

  return async (req: any, _res: any, next: any) => {
    if (config.exclude?.some(p => req.path.startsWith(p))) {
      return next();
    }

    const header = req.headers?.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const claims = autional.tokenManager.decodeToken(token);
      if (claims && !autional.tokenManager.isTokenExpired(token)) {
        req.user = {
          id: claims.sub || claims.user_id,
          tenantId: claims.tenant_id,
          role: claims.role,
        };
      } else {
        return _res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
      }
    } catch {
      return _res.status(401).json({ code: 'UNAUTHORIZED', message: 'Token verification failed' });
    }

    next();
  };
}

/**
 * Fastify 插件——验证 Bearer token 并注入 request.user
 */
export function autionalFastify(fastify: any, config: NodeAutionalConfig, done: any) {
  const autional = new Autional({
    appId: config.appId || 'node-sdk',
    issuer: config.issuer,
    apiUrl: config.apiUrl,
    platform: browserPlatform,
    syncTabs: false,
  });

  autional.initialize().catch(() => {});

  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request: any, reply: any) => {
    if (config.exclude?.some((p: string) => request.url.startsWith(p))) {
      return;
    }

    const header = request.headers?.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      request.user = null;
      return;
    }

    try {
      const claims = autional.tokenManager.decodeToken(token);
      if (claims && !autional.tokenManager.isTokenExpired(token)) {
        request.user = {
          id: claims.sub || claims.user_id,
          tenantId: claims.tenant_id,
          role: claims.role,
        };
      } else {
        reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
      }
    } catch {
      reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Token verification failed' });
    }
  });

  done();
}

/** 获取当前用户信息（Express） */
export function getUser(req: any): { id: string; tenantId?: string; role?: string } | null {
  return req.user || null;
}
