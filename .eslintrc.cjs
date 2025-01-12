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
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};
