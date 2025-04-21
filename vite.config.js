import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import packageInfo from "./package.json";
import { sendLog } from "./src/scripts/send-error-message-script.js";

export default defineConfig(({ mode }) => {
  const config = {
    plugins: [
      vue(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
  if (mode === "production") {
    sendLog({
      fileName: "config",
      functionName: "main",
      type: "info",
      log: `Building ${packageInfo.name} ${packageInfo.version} for production`,
      environment: false,
    });
  }

  return config;
});
