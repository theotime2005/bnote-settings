import js from "@eslint/js";
import vueI18n from "@intlify/eslint-plugin-vue-i18n";
import prettierConfig from "@vue/eslint-config-prettier/skip-formatting";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import vitestGlobals from "eslint-plugin-vitest-globals";
import pluginVue from "eslint-plugin-vue";
import eslintPluginYml from "eslint-plugin-yml";
import globals from "globals";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  prettierConfig,
  ...vueI18n.configs.recommended,
  ...eslintPluginYml.configs.recommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "vitest-globals": vitestGlobals,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        $fetch: "readonly",
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
      "@intlify/vue-i18n/no-raw-text": "off",
    },
    settings: {
      "vue-i18n": {
        localeDir: "./i18n/locales/*.json",
        messageSyntaxVersion: "^11.0.0",
      },
    },
  },
  {
    files: ["**/tests/**/*.{j,t}s?(x)", "**/*.spec.{j,t}s?(x)"],

    languageOptions: {
      globals: {
        ...vitestGlobals.environments.env.globals,
      },
    },
  },

  {
    ignores: [
      "output/",
      ".vercel/",
      "dist/",
      "public/",
      ".nuxt/",
      ".output/",
      "node_modules/",
    ],
  },
];
