import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import vitestGlobals from "eslint-plugin-vitest-globals";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  ...compat.extends( // Utiliser FlatCompat pour les configurations basées sur des chaînes
    "@vue/eslint-config-prettier/skip-formatting",
    "@vue/eslint-config-typescript",
    "plugin:i18n-json/recommended", // Assurez-vous que ce plugin est compatible et installé
  ),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "vitest-globals": vitestGlobals,
      "@typescript-eslint": tseslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        parser: tsparser,
        extraFileExtensions: ['.vue'],
      },
    },

    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],

      "comma-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],

      "object-curly-spacing": ["error", "always"],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "block", next: "block" },
        { blankLine: "always", prev: "function", next: "function" },
        { blankLine: "always", prev: "class", next: "function" },
      ],
      "prefer-const": ["error"],
      "space-before-blocks": ["error"],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "never",
          named: "never",
          asyncArrow: "ignore",
        },
      ],
      "space-in-parens": ["error"],
      "space-infix-ops": ["error"],
      "func-call-spacing": ["error"],
      "key-spacing": ["error"],
      "no-trailing-spaces": ["error"],
      "no-multi-spaces": ["error"],
      "func-style": ["error", "declaration", { "allowArrowFunctions": false }],
      
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
  {
    files: ["**/tests/*.{j,t}s?(x)", "**/*.spec.{j,t}s?(x)"],

    languageOptions: {
      globals: {
        ...vitestGlobals.environments.env.globals,
      },
    },
  },
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tsparser,
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  {
    ignores: [
      ".idea/",
      ".vscode/",
      "src/*.json",
      "dist/",
      "public/",
      ".versionrc.json",
      "jsconfig.json",
      "package-lock.json",
      "package.json",
    ],
  },
];