import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name as string;
          if (info && info.endsWith('.png')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
}) 
