import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

import { opdevPlugin } from "./vite-plugin-opdev";

export default defineConfig(({ mode }) => ({
  plugins: [solid(), opdevPlugin(mode)],
  base: mode === "development" ? "/block/" : "./",
  build: {
    outDir: "dist",
    target: "es2015",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "solid-js": ["solid-js"],
        },
      },
    },
  },
  server: {
    headers: {
      "Access-Control-Allow-Private-Network": "true",
    },
    port: 5173,
  },
}));
