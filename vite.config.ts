import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import unoCSS from "unocss/vite";
import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), unoCSS()],
  resolve: {
    alias: {
      "@": join(__dirname, "/src"),
      "@components": join(__dirname, "/src/components"),
    },
  },
});
