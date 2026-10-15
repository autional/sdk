import { defineConfig } from 'tsup';

const externals = ['next', '@autional/core', '@autional/react', 'react', 'react-dom'];

// 包粒化（C7/C3N）：middleware/server 与 Provider 分入口构建 ——
// middleware 属 react-server 图，若与客户端 hooks 混装同一 bundle，
// Next.js 编译中间件即失败。Provider 入口以 banner 保留 "use client" 指令。
export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    external: externals,
  },
  {
    entry: { middleware: 'src/middleware.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    external: externals,
  },
  {
    entry: { server: 'src/server.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    external: externals,
  },
  {
    // provider.tsx 源码自带 "use client"，esbuild 保留入口文件指令（banner 会重复，勿加）
    entry: { provider: 'src/provider.tsx' },
    format: ['cjs', 'esm'],
    dts: true,
    external: externals,
  },
]);
