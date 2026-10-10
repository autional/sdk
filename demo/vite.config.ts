import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@autional/core': path.resolve(__dirname, '../packages/core/src'),
      '@autional/react': path.resolve(__dirname, '../packages/react/src'),
      '@autional/api-identity': path.resolve(__dirname, '../packages/api-identity/src'),
    },
  },
  server: {
    port: 5173,
    watch: {
      ignored: ['!**/packages/core/src/**', '!**/packages/react/src/**', '!**/packages/api-identity/src/**'],
    },
    proxy: {
      '/.well-known': { target: 'http://localhost:11080', changeOrigin: true },
      '/identity': { target: 'http://localhost:11080', changeOrigin: true, rewrite: (path) => path.replace(/^\/identity/, '/bff/identity') },
      // 只代理 API 形状路径；否则会吞掉 SPA 路由 /oauth/callback（SDK 约定回调路径）
      '/oauth/api': { target: 'http://localhost:11080', changeOrigin: true, rewrite: (path) => path.replace(/^\/oauth/, '/bff/oauth') },
      '/billing': { target: 'http://localhost:11080', changeOrigin: true, rewrite: (path) => path.replace(/^\/billing/, '/bff/billing') },
      '/mfa': { target: 'http://localhost:11080', changeOrigin: true, rewrite: (path) => path.replace(/^\/mfa/, '/bff/mfa') },
      '/tenant': { target: 'http://localhost:11080', changeOrigin: true, rewrite: (path) => path.replace(/^\/tenant/, '/bff/tenant') },
    },
  },
});
