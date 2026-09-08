import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// Vite config: React + SVGR (SVG as React components), path alias @ -> src, higher chunk warning limit for assets.
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:6000',
      '/uploads': 'http://localhost:6000',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-swiper': ['swiper'],
          'vendor-ui': ['@headlessui/react', 'react-datepicker', 'react-icons'],
        },
      },
    },
  },
});
