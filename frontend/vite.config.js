import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy libraries into separate cached chunks
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'motion':        ['framer-motion'],
          'markdown':      ['react-markdown', 'remark-gfm'],
          'highlighter':   ['react-syntax-highlighter'],
          'query':         ['@tanstack/react-query'],
        },
      },
    },
  },
});
