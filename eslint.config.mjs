import path from 'node:path'
import {fileURLToPath} from 'node:url'

import tseslint from 'typescript-eslint'

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import {fixupConfigRules} from '@eslint/compat'
import {FlatCompat} from '@eslint/eslintrc'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import consts from '@jetbrains/eslint-config/consts.js'
import js from '@eslint/js'
import globals from 'globals'

const {error, ignore} = consts

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default tseslint.config(
  {
    ignores: ['**/dist', '**/*.d.ts'],
  },
  ...fixupConfigRules(
    compat.extends(
      '@jetbrains',
      '@jetbrains/eslint-config/es6',
      '@jetbrains/eslint-config/browser',
      '@jetbrains/eslint-config/react',
    ),
  ),
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': error,
      '@typescript-eslint/no-unused-vars': [
        error,
        {caughtErrors: 'none', destructuredArrayIgnorePattern: '^_'},
      ],
      'no-magic-numbers': ignore,
      '@typescript-eslint/no-magic-numbers': [
        error,
        {
          ignore: [-1, 0, 1],
          ignoreEnums: true,
        },
      ],
      'import/extensions': [
        error,
        'always',
        {
          js: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-cycle': error,
      'import/no-extraneous-dependencies': [
        error,
        {
          devDependencies: [
            'eslint.config.mjs',
            'vite.config.mjs',
            '**/*.stories.tsx',
            '.storybook/**',
            'tsc-teamcity.js',
          ],

          peerDependencies: true,
        },
      ],
      'react/jsx-uses-react': ignore,
      'react/react-in-jsx-scope': ignore,
      complexity: ignore,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      'import/core-modules': ['typescript-eslint'],
    },
  },
  ...[
    ...fixupConfigRules(compat.extends('@jetbrains/eslint-config/node')),
    {rules: {'import/no-commonjs': ignore, '@typescript-eslint/no-require-imports': ignore}},
  ].map(config => ({
    ...config,
    files: ['*.config.js', 'browserslist/index.js', 'getWebpackConfig.js', 'tsc-teamcity.js'],
  })),
  {
    files: ['**/*.mjs'],
    rules: {'import/extensions': ignore},
  },
  {
    files: ['**/*.test.ts'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  storybook.configs['flat/recommended'],
)
