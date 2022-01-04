import * as path from 'path'
import { defineConfig } from 'vite'
import vitePluginDts from 'vite-plugin-dts'
import cleanupPlugin from 'rollup-plugin-cleanup'
import strip from '@rollup/plugin-strip'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs'],
    },
    outDir: './lib',
    rollupOptions: {
      external: [],
    },
  },
  plugins: [
    vitePluginDts({
      outputDir: './lib',
      insertTypesEntry: true,
    }),
    cleanupPlugin({
      comments: 'all',
    }),
    strip({
      functions: ['console.log', 'assert.*', 'debug'],
      include: '**/*.(ts|js)',
    }),
  ],
})
