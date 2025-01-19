import globals from "globals";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      semi: ["error", "always"], // Obligatoire d'ajouter des points-virgules
      quotes: ["error", "double"], // Utilisation des guillemets doubles
      indent: ["error", 2], // Indentation avec 2 espaces
      "comma-dangle": ["error", "always-multiline"], // Virgule finale requise pour les objets/multilignes
      "comma-spacing": ["error", { before: false, after: true }], // Espaces autour des virgules
      "object-curly-spacing": ["error", "always"], // Espaces à l'intérieur des accolades
    },
  },
  ...pluginVue.configs["flat/essential"],
];
