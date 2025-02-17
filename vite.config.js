/* eslint-disable */
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { dirname } from "path";
import { defineConfig, loadEnv } from "vite";
import vitePluginEnvCompatible from "vite-plugin-env-compatible";
import { sendLog } from "./src/scripts/send-error-message-script.js";
import tailwindcss from '@tailwindcss/vite'
import packageInfo from "./package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = loadEnv(process.env.MODE || "development", __dirname);

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vitePluginEnvCompatible(),
    {
      name: "show-success-message",
      closeBundle() {
      if (process.env.VUE_APP_ENVIRONMENT==="production") {
        sendLog({
          fileName: "Vite config",
          functionName: "closeBundle",
          type: "success",
          log: `Congratulations! the version ${packageInfo.version} is deployed successfully!`,
        })
      }
      },
    },
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
