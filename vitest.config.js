import { fileURLToPath } from "node:url";

import { defineVitestProject } from "@nuxt/test-utils/config";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      await defineVitestProject({
        test: {
          name: "unit",
          environment: "jsdom",

          include: [
            "tests/unit/**/*.test.js",
            "tests/unit/**/*.spec.js",
          ],

          setupFiles: ["tests/helpers/vite.config.setup.test.js"],
          globals: true,
          resolve: {
            alias: {
              "@": fileURLToPath(new URL("./", import.meta.url)),
              "~": fileURLToPath(new URL("./", import.meta.url)),
            },
          },
        },
      }),

      await defineVitestProject({
        test: {
          name: "integration",
          environment: "nuxt",

          include: [
            "tests/integration/**/*.test.js",
            "tests/integration/**/*.spec.js",
          ],

          setupFiles: ["tests/helpers/vite.config.setup.test.js"],
          globals: true,
          resolve: {
            alias: {
              "@": fileURLToPath(new URL("./", import.meta.url)),
              "~": fileURLToPath(new URL("./", import.meta.url)),
            },
          },
        },
      }),

      await defineVitestProject({
        test: {
          name: "acceptance",
          environment: "nuxt",
          include: [
            "tests/acceptance/**/*.test.js",
            "tests/acceptance/**/*.spec.js",
          ],

          setupFiles: ["tests/helpers/vite.config.setup.test.js"],
          globals: true,
          resolve: {
            alias: {
              "@": fileURLToPath(new URL("./", import.meta.url)),
              "~": fileURLToPath(new URL("./", import.meta.url)),
            },
          },
        },
      }),
    ],

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
