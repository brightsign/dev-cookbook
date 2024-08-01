import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts'],
  format: ['cjs', 'esm'],
  splitting: false,
  clean: true,
  dts: true,
  target: 'node14',
});