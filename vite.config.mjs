import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dynamicImport from 'vite-plugin-dynamic-import'
import commonjs from 'vite-plugin-commonjs'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {patchCssModules} from 'vite-css-modules'

function allowJetBrainsIcons(id) {
  if (id.includes('/node_modules/@jetbrains/icons/')) {
    return true
  }
  return undefined
}

export default defineConfig(({command}) => ({
  plugins: [
    react(),
    patchCssModules({generateSourceTypes: true}),
    command === 'serve' && [
      dynamicImport({
        filter: allowJetBrainsIcons,
      }),
      commonjs({
        filter: allowJetBrainsIcons,
      }),
    ],
  ],
  build: {
    target: browserslistToEsbuild(),
    lib: {
      formats: ['es'],
      entry: {
        index: 'src/index.ts',
        'components/index': 'src/components/index.ts',
        'plugin/index': 'src/plugin/index.tsx',
        'plugin/registry': 'src/plugin/registry.ts',
        'services/index': 'src/services/index.ts',
        'tab-plugin/index': 'src/tab-plugin/index.ts',
        'utils/index': 'src/utils/index.ts',
      },
      cssFileName: 'index',
    },
    rollupOptions: {
      external: id => {
        const isInternal = id.startsWith('.') || id.startsWith('/')
        return !isInternal
      },
    },
  },
}))
