import { cloudflare } from "@cloudflare/vite-plugin"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), cloudflare(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
