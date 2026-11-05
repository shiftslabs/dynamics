import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: { "/api": "http://127.0.0.1:8787" },
  },
});