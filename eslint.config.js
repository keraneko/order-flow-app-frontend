import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import pluginImport from "eslint-plugin-import"
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort"
import pluginUnusedImports from "eslint-plugin-unused-imports"
import globals from 'globals'
import tseslint from 'typescript-eslint'


export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      pluginJsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ...pluginJsxA11y.flatConfigs.recommended.languageOptions,
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      import: pluginImport,
      "simple-import-sort": pluginSimpleImportSort,
      "unused-imports": pluginUnusedImports,
    },
    settings: {
    // TSのパス解決（@/〜など）を import ルールが理解できるように
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,},
    },
    },

    rules: {
      // importの基本ルール
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",

      // 並び替え
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // 未使用import削除
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
  },

  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
])
