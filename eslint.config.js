import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import astro from 'eslint-plugin-astro'
import astroParser from 'astro-eslint-parser'

const ignoresGlobal = [
  '.astro/**',
  'src/generated.ts',
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

export default ts.config(
  {
    ignores: ignoresGlobal,
  },
  {
    files: astroFiles,
    extends: [
      ...astro.configs.recommended,
    ],
    processor: astro.processors['client-side-ts'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: ts.parser,
        sourceType: 'module',
        extraFileExtensions: ['.astro'],
      },
      globals: {
        ...globals.node,
        ...astro.environments.astro.globals,
      },
    },
    rules: {
      'astro/semi': ['warn', 'never'],
    },
  },
  {
    files: tsFiles,
    extends: [
      js.configs.recommended,
      ...ts.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: tsFiles,
    rules: {
      'no-empty': 'off',
      '@typescript-eslint/no-empty': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

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
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      indent: ['warn', 2, { SwitchCase: 1 }],
      semi: ['warn', 'never'],
      quotes: ['warn', 'single'],
      'comma-dangle': ['warn', 'always-multiline'],
      'arrow-parens': ['warn', 'always'],
      'eol-last': ['warn', 'always'],
    },
  },
)
