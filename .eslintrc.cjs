/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  plugins: [
    "import",
    "simple-import-sort",
    "vitest-globals",
  ],
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)", "**/*.spec.{j,t}s?(x)"],
      env: {
        "vitest-globals/env": true,
      },
    },
  ],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    indent: ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
    "comma-spacing": ["error", { before: false, after: true }],
    "object-curly-spacing": ["error", "always"],
    // Simple import sort
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    // Most option to manage imports
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"], // Node.js modules et dépendances externes
          ["internal"],            // Imports internes
          ["parent", "sibling"],   // Parent et fichiers siblings
          ["index"],               // Imports de fichiers index
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true }, // Tri alphabétique
      },
    ],
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};
