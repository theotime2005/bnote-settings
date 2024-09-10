/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    node: true,
  },
  root: true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "object-curly-spacing": ["error", "always"],
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};
