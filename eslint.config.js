import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import pluginJsxA11y from "eslint-plugin-jsx-a11y"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"
import pluginImport from "eslint-plugin-import"
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort"
import pluginUnusedImports from "eslint-plugin-unused-imports"

const reactTsConfig = {
  name: "react+ts",
  files: ["src/**/*.{js,ts,jsx,tsx}"],
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
}

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


const shadcnUiConfig = {
  name: "shadcn-ui",
  files: ["src/components/ui/**/*.{ts,tsx}"],
  rules: {
    "react-refresh/only-export-components": "off",
  },
}

export default defineConfig([
  globalIgnores(["dist", "build", "public", "node_modules", "**/*.config.*"]),
  reactTsConfig,
  importConfig,
  shadcnUiConfig,
])