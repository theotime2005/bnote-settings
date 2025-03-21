import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { dirname } from "path";
import { defineConfig, loadEnv } from "vite";

import packageInfo from "./package.json";
import { sendLog } from "./src/scripts/send-error-message-script.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = loadEnv(process.env.MODE || "development", __dirname);

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    {
      name: "show-success-message",
      closeBundle() {
        if (env === "production") {
          sendLog({
            fileName: "Vite config",
            functionName: "closeBundle",
            type: "success",
            log: `Congratulations! the version ${packageInfo.version} is deployed successfully!`,
          });
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
