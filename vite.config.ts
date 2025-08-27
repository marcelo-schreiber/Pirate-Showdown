import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";
import glsl from 'vite-plugin-glsl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  optimizeDeps: {
    exclude: ['@dimforge/rapier3d-compat']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
