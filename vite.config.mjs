import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 1. Set the base path for AWS subfolder hosting
    base: '/vendor/',

    plugins: [react()],

    // 2. Optimization for the 'Memory Allocation' issue
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Split node_modules into its own file to save memory
              return 'vendor_libs';
            }
          },
        },
      },
    },

    server: {
      host: true,
      proxy: {
        '/api': {
          target: 'http://3.7.112.78/bespoke/public',
          changeOrigin: true,
          secure: false,
          credentials: true,
        }
      }
    }
  }
})