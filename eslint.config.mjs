import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import prettierConfig from "@vue/eslint-config-prettier/skip-formatting";
import i18nJson from "eslint-plugin-i18n-json";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import vitestGlobals from "eslint-plugin-vitest-globals";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  prettierConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "vitest-globals": vitestGlobals,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      ecmaVersion: "latest",
      sourceType: "module",
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
      "vue/block-order": [
        "error",
        {
          order: ["script", "template", "style"],
        },
      ],
      "vue/multi-word-component-names": "off",
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
    files: ["locales/*.json", "i18n/locales/*.json"],
    plugins: {
      "i18n-json": i18nJson,
    },
    processor: i18nJson.processors[".json"],
    rules: {
      "i18n-json/valid-json": "error",
      "i18n-json/sorted-keys": [
        "error",
        {
          order: "asc",
          indentSpaces: 4,
        },
      ],
      "i18n-json/identical-keys": [
        "error",
        {
          filePath: path.resolve(__dirname, "i18n/locales/fr.json"),
        },
      ],
    },
  },
  {
    ignores: [
      "dist/",
      "public/",
      ".nuxt/",
      ".output/",
      "node_modules/",
    ],
  },
];
