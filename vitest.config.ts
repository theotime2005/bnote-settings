import { fileURLToPath } from "node:url";

import { configDefaults, defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    setupFiles: "tests/vite.config.setup.test.js",
    globals: true,
    environment: "happy-dom",
    // TODO: Rewrite acceptance tests without helper.
    exclude: [...configDefaults.exclude, "e2e/**", ".nuxt/**", ".output/**","tests/acceptance"],
    root: fileURLToPath(new URL("./", import.meta.url)),
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./", import.meta.url)),
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
