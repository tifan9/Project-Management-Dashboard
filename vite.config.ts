import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Get the current file's full path (equivalent to __filename in CommonJS)
const __filename = fileURLToPath(import.meta.url);

// Get the directory name (equivalent to __dirname in CommonJS)
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
      
    },
  },
  base: "/",
});