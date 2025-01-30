/* eslint-disable */
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { dirname } from "path";
import { defineConfig, loadEnv } from "vite";
import vitePluginEnvCompatible from "vite-plugin-env-compatible";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = loadEnv(process.env.MODE || "development", __dirname);

export default defineConfig({
  plugins: [
    vue(),
    vitePluginEnvCompatible(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __APP_ENV__: JSON.stringify(env.APP_ENV),
  },
});
