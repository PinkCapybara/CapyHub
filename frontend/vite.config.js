import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "tailwindcss/version.js": resolve(
        "./node_modules/tailwindcss/package.json",
      ),
    },
  },
  optimizeDeps: {
    include: ["tailwindcss"],
  },
});
