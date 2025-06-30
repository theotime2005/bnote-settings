import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import packageInfo from "./package.json";
import { sendLog } from "./src/scripts/send-log-message-script.js";

export default defineConfig(({ mode }) => {
  const config = {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      open: true,
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
