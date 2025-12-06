import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { configDefaults } from "vitest/config";

export default defineVitestConfig({
  test: {
    setupFiles: ["tests/helpers/vite.config.setup.test.js"],
    globals: true,
    environment: "nuxt",

    exclude: [
      ...configDefaults.exclude,
      "e2e/**",
      ".nuxt/**",
      ".output/**",
      "server/config.js",
    ],

    root: fileURLToPath(new URL("./", import.meta.url)),

    reporters: process.env.GITHUB_ACTIONS
      ? ["dot", "github-actions"]
      : ["dot"],
  },
});
