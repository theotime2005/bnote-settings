import { fileURLToPath } from "node:url";

import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      setupFiles: "src/__tests__/vite.config.setup.test.js",
      globals: true,
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
    },
  }),
);
