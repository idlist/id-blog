import { dirname } from 'desm'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import astro from 'eslint-plugin-astro'
import astroParser from 'astro-eslint-parser'

const __dirname = dirname(import.meta.url)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
})

const ignoresGlobal = [
  '.astro/**',
]

const astroFiles = [
  'src/**/*.astro',
]

const jsFiles = [
  'eslint.config.js',
]

const tsFiles = [
  ...astroFiles.map((path) => `${path}/*.ts`),
  '*.ts',
  'src/**/*.ts',
  'scripts/**/*.ts',
]

export default [
  {
    ignores: ignoresGlobal,
  },
  {
    files: astroFiles,
    plugins: {
      astro,
    },
    processor: astro.processors['client-side-ts'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        extraFileExtensions: ['.astro'],
      },
      globals: {
        ...globals.node,
        ...astro.environments.astro.globals,
      },
    },
    rules: {
      ...astro.configs.recommended.rules,

      'astro/semi': ['warn', 'never'],
    },
  },
  {
    files: tsFiles,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  ...compat.config({
    overrides: [
      {
        files: tsFiles,
        extends: ['plugin:@typescript-eslint/recommended'],
      },
    ],
  }),
  {
    files: tsFiles,
    rules: {
      '@typescript-eslint/no-empty': 'off',
      '@typescript-eslint/no-empty-interface': 'off',

      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'warn',
    },
  },
  {
    files: jsFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    ...js.configs.recommended,
    rules: {
      'no-empty': 'off',

      'no-empty-function': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'warn',
    },
  },
  {
    files: [...tsFiles, ...jsFiles],
    rules: {
      indent: ['warn', 2, { SwitchCase: 1 }],
      semi: ['warn', 'never'],
      quotes: ['warn', 'single'],
      'comma-dangle': ['warn', 'always-multiline'],
      'arrow-parens': ['warn', 'always'],
      'eol-last': ['warn', 'always'],
    },
  },
]
