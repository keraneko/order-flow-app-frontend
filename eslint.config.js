import globals from "globals"
import pluginJs from '@eslint/js'
import tsEsLint from 'typescript-eslint'
import pluginReact from "eslint-plugin-react";
import pluginHooks from "eslint-plugin-react-hooks";
import pluginRefresh from "eslint-plugin-react-refresh";
import pluginJsxA11y from "eslint-plugin-jsx-a11y"
import { defineConfig} from "eslint/config"
import pluginImport from "eslint-plugin-import"
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort"
import pluginUnusedImports from "eslint-plugin-unused-imports"

const reactConfig = {
  name: 'React Config',
  files: ['src/**/*.{js,ts,jsx,tsx}'],
  languageOptions: {
    ...pluginJsxA11y.flatConfigs.recommended.languageOptions,
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: {
    react: pluginReact,
    'react-hooks': pluginHooks,
    'react-refresh': pluginRefresh,
    'jsx-a11y': pluginJsxA11y,
  },
  rules: {
    ...pluginReact.configs.flat.recommended.rules,
    ...pluginHooks.configs.recommended.rules,
    ...pluginRefresh.configs.recommended.rules,
    ...pluginJsxA11y.flatConfigs.recommended.rules,
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};

const importConfig = {
  name: "imports",
  files: ["src/**/*.{js,ts,jsx,tsx}"],
  plugins: {
    import: pluginImport,
    "simple-import-sort": pluginSimpleImportSort,
    "unused-imports": pluginUnusedImports,
  },
  settings: {
    "import/resolver": {
      typescript: { alwaysTryTypes: true },
    },
  },
  rules: {
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",

    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ['^react(-dom)?', '^node:', '^@?\\w', '^@/.*'],
          ['^\\.+/(?!assets/)', '^.+\\.json$', '^.+\\.(svg|png|jpg)$', '^.+\\.s?css$'],
        ],
      },
    ],
    "simple-import-sort/exports": "error",

    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
}

const stylisticConfig = {
  name: 'Stylistic Config',
  files: ['src/**/*.{js,ts,jsx,tsx}'],
  rules: {
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: ['function', `class`] },
      { blankLine: 'always', prev: '*', next: ['if', 'switch'] },
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'never', prev: 'directive', next: 'directive' },
    ],
  },
};


export default defineConfig([
   { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'] },
  {
    ignores: [
      '{dist,build,public,node_modules}/**',
      '**/lib/utils.{js,ts}',
      'src/components/ui/**',
      '**/*.config.*',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2025,
      },
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.*.json'],
      },
    },
  },
  pluginJs.configs.recommended,
  tsEsLint.configs.recommendedTypeChecked,
  tsEsLint.configs.stylistic,
  reactConfig,
  importConfig,
  stylisticConfig,
])