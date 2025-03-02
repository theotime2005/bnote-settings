import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import vitestGlobals from "eslint-plugin-vitest-globals";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier/skip-formatting",
    "plugin:i18n-json/recommended",
  ),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "vitest-globals": vitestGlobals,
    },

    languageOptions: {
      globals: {
        ...globals.node,
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
    },
  },
  {
    files: ["**/__tests__/*.{j,t}s?(x)", "**/*.spec.{j,t}s?(x)"],

    languageOptions: {
      globals: {
        ...vitestGlobals.environments.env.globals,
      },
    },
  },
  {
    ignores: [
      ".idea/",
      ".vscode/",
      "public/",
      ".prettierrc.json",
      "jsconfig.json",
      "package-lock.json",
      "package.json",
    ],
  },
];
