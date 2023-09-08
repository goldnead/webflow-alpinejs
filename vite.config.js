// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "localhost",
    cors: "*",
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },
  build: {
    minify: true,
    manifest: true,
    rollupOptions: {
      input: "./init.js",
      output: {
        format: "umd",
        entryFileNames: "init.js",
        esModule: false,
        compact: true,
      },
    },
  },
});
