import { defineConfig } from 'tsup'

// @chat-adapter/telegram (Vercel Chat SDK) is ESM-only — its package `exports`
// has no `require`/`default` condition, so a CJS `require()` of it throws
// ERR_PACKAGE_PATH_NOT_EXPORTED. To ship a WORKING dual build (like @mastra/slack),
// keep the adapter external in ESM (lean, deduped) but bundle it into the CJS
// output so `require('@mastra/telegram')` never touches the adapter's ESM-only
// entry. Only @mastra/core stays external in both.
const ADAPTER = ['@chat-adapter/telegram', '@chat-adapter/shared', 'chat']

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ['@mastra/core'],
  },
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: false,
    clean: false,
    sourcemap: true,
    external: ['@mastra/core'],
    noExternal: ADAPTER,
  },
])
